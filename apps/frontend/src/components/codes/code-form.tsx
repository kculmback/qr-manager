import type { SyntheticEvent } from "react";
import type { z } from "zod/v4";
import { useCallback, useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";

import type { CodeContent, CodeMode, CodeType } from "@qr-manager/validators";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@qr-manager/ui/components/alert";
import { Button } from "@qr-manager/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@qr-manager/ui/components/field";
import {
  NativeSelect,
  NativeSelectOption,
} from "@qr-manager/ui/components/native-select";
import { Spinner } from "@qr-manager/ui/components/spinner";
import { Switch } from "@qr-manager/ui/components/switch";
import {
  CODE_TYPE_NAMES,
  CODE_TYPES,
  codeContentSchema,
  codeStyleSchema,
  DEFAULT_CODE_STYLE,
  encodedByteLength,
  encodePayload,
  MAX_ENCODED_BYTES,
  supportsDynamic,
} from "@qr-manager/validators";

import type { Appearance } from "./appearance-fields";
import type { FieldErrorMap } from "~/lib/use-field-errors";
import { useFieldErrors } from "~/lib/use-field-errors";
import { AppearanceFields } from "./appearance-fields";
import { CodeField, formString, optionalFormString } from "./code-field";
import { PAYLOAD_FIELDSETS } from "./payload-fields";
import { CategoryField, TagsField } from "./taxonomy-fields";

export interface CodeFormValues extends Appearance {
  name: string;
  mode: CodeMode;
  slug?: string;
  content: CodeContent;
  /** Category *name*, or null for none. The server creates it if it is new. */
  category: string | null;
  /** Tag names, likewise. */
  tags: string[];
}

export interface CodeFormProps {
  /** Existing values when editing. */
  initial?: Appearance & {
    name: string;
    mode: CodeMode;
    slug: string;
    content: CodeContent;
    category: string | null;
    tags: string[];
  };
  submitLabel: string;
  isPending: boolean;
  /** Server-side failure, shown above the submit button. */
  submitError?: string | null;
  onSubmit: (values: CodeFormValues) => void;
  /**
   * Fires on every artwork change, so a page showing the real code alongside
   * the form can repaint it before anything is saved. Colours are chosen by
   * looking at the result, which a preview of the *saved* state cannot show.
   */
  onAppearanceChange?: (appearance: Appearance) => void;
}

/**
 * Maps zod issues onto the per-field error map.
 *
 * Payload issues arrive as `["content", "payload", "ssid"]`, so the last string
 * segment is the field name -- the same key the fieldsets use.
 */
function toFieldErrors(error: z.ZodError): FieldErrorMap {
  const mapped: FieldErrorMap = {};

  for (const issue of error.issues) {
    const field = [...issue.path]
      .reverse()
      .find((segment) => typeof segment === "string");
    const key = typeof field === "string" ? field : "form";
    mapped[key] ??= issue.message;
  }

  return mapped;
}

/**
 * What saving will and will not change out in the world.
 *
 * Only shown when editing, and only when a static code is involved on one side
 * or the other. A static code's content lives in the printed image, so an edit
 * here cannot reach a copy that has already left the building -- and the app
 * saying nothing would let somebody believe it had.
 *
 * Dynamic to dynamic is silent: that case is the whole point of the feature.
 */
function EditWarning({ from, to }: { from: CodeMode; to: CodeMode }) {
  if (from === "dynamic" && to === "dynamic") return null;

  // The only case where saving actively breaks something that works today.
  const isBreaking = from === "dynamic" && to === "static";

  return (
    <Alert variant={isBreaking ? "destructive" : "default"}>
      <TriangleAlert />
      <AlertTitle>
        {isBreaking
          ? "This will break codes already printed"
          : "Codes already printed will not change"}
      </AlertTitle>
      <AlertDescription>
        {from === "static" && to === "static" && (
          <p>
            Saving produces a new image. Anything already printed or shared
            keeps its current content forever &mdash; the only way to update it
            is to print the new code and replace the old one.
          </p>
        )}
        {from === "static" && to === "dynamic" && (
          <p>
            Copies already printed stay static and keep their current content
            forever. Only codes printed after saving will use the short link.
          </p>
        )}
        {isBreaking && (
          <p>
            The short link stops resolving as soon as you save, so every copy
            already printed or shared stops working. The new content reaches
            only the people who scan a freshly printed code.
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
}

export function CodeForm({
  initial,
  submitLabel,
  isPending,
  submitError,
  onSubmit,
  onAppearanceChange,
}: CodeFormProps) {
  const [type, setType] = useState<CodeType>(initial?.content.type ?? "url");
  const [isDynamic, setIsDynamic] = useState(
    initial
      ? initial.mode === "dynamic"
      : CODE_TYPES.url.defaultMode === "dynamic",
  );
  // Neither of these can come out of the `FormData` the way the rest of the
  // form does: both are comboboxes whose value is chosen rather than typed.
  const [category, setCategory] = useState<string | null>(
    initial?.category ?? null,
  );
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  // Likewise: a colour comes from a picker and a logo from a file, neither of
  // which survives a round trip through `FormData` as the value we store.
  const [appearance, setAppearance] = useState<Appearance>({
    style: initial?.style ?? DEFAULT_CODE_STYLE,
    logo: initial?.logo ?? null,
  });

  useEffect(
    () => onAppearanceChange?.(appearance),
    [appearance, onAppearanceChange],
  );

  const errors = useFieldErrors();
  const { replaceErrors } = errors;

  const definition = CODE_TYPES[type];
  const canBeDynamic = supportsDynamic(type);
  const mode: CodeMode = canBeDynamic && isDynamic ? "dynamic" : "static";
  const { Fields, fromFormData } = PAYLOAD_FIELDSETS[type];

  const changeType = useCallback(
    (next: CodeType) => {
      setType(next);
      // Each type defaults to what suits it: a link is dynamic, a contact card
      // is static even though it could be either.
      setIsDynamic(CODE_TYPES[next].defaultMode === "dynamic");
      replaceErrors({});
    },
    [replaceErrors],
  );

  const handleSubmit = useCallback(
    (event: SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.currentTarget);
      const parsed = codeContentSchema.safeParse({
        type,
        payload: fromFormData(data),
      });

      if (!parsed.success) {
        replaceErrors(toFieldErrors(parsed.error));
        return;
      }

      // Colours are checked with the same schema the server uses, so the
      // contrast rule has one definition rather than a copy that can drift.
      const style = codeStyleSchema.safeParse(appearance.style);

      if (!style.success) {
        replaceErrors(toFieldErrors(style.error));
        return;
      }

      // Only a static code carries its payload in the grid, so only a static
      // code can overflow it. Checked here as well as on the server so the
      // message lands next to the field rather than as a failed request.
      if (
        mode === "static" &&
        encodedByteLength(encodePayload(parsed.data)) > MAX_ENCODED_BYTES
      ) {
        replaceErrors({
          form: "There is too much content here to fit in a scannable code.",
        });
        return;
      }

      replaceErrors({});
      onSubmit({
        name: formString(data, "name"),
        mode,
        slug: optionalFormString(data, "slug"),
        content: parsed.data,
        style: style.data,
        logo: appearance.logo,
        category,
        tags,
      });
    },
    [
      type,
      mode,
      category,
      tags,
      appearance,
      fromFormData,
      onSubmit,
      replaceErrors,
    ],
  );

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <CodeField
          errors={errors}
          name="name"
          label="Name"
          required
          maxLength={120}
          placeholder="Poster in the lobby"
          defaultValue={initial?.name}
          disabled={isPending}
          description="Only you see this. It is how you will find the code later."
        />

        <Field>
          <FieldLabel htmlFor="type">Type</FieldLabel>
          <NativeSelect
            id="type"
            className="w-full"
            value={type}
            onChange={(event) =>
              changeType(event.currentTarget.value as CodeType)
            }
            disabled={isPending}
          >
            {CODE_TYPE_NAMES.map((value) => (
              <NativeSelectOption key={value} value={value}>
                {CODE_TYPES[value].label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <FieldDescription>{definition.description}</FieldDescription>
        </Field>

        <FieldSeparator />

        {/* Remounts on type change so a previous type's values cannot leak into
            the new fieldset through stale `defaultValue`s. */}
        <FieldGroup key={type}>
          <Fields
            errors={errors}
            disabled={isPending}
            defaultValue={
              initial?.content.type === type
                ? initial.content.payload
                : undefined
            }
          />
        </FieldGroup>

        {canBeDynamic && (
          <>
            <FieldSeparator />

            <Field orientation="horizontal">
              <FieldLabel htmlFor="dynamic">Dynamic</FieldLabel>
              <Switch
                id="dynamic"
                checked={isDynamic}
                onCheckedChange={setIsDynamic}
                disabled={isPending}
              />
            </Field>
            <FieldDescription>
              {isDynamic
                ? "The code points at a short link on this server, so you can change where it goes without reprinting it."
                : "The code carries its content directly. Nothing to look up, but it can never be changed."}
            </FieldDescription>

            {isDynamic && (
              <CodeField
                errors={errors}
                name="slug"
                label="Custom short link"
                defaultValue={initial?.slug}
                disabled={isPending}
                placeholder="lobby-poster"
                description={
                  initial
                    ? "Changing this breaks every copy of this code already printed."
                    : "Optional. Leave empty for a short random one."
                }
              />
            )}
          </>
        )}

        <FieldSeparator />

        {/* Artwork, not content: these change how the code looks without
            touching the value encoded into it. */}
        <AppearanceFields
          value={appearance}
          onChange={setAppearance}
          disabled={isPending}
          errors={errors}
        />

        <FieldSeparator />

        {/* Filing, not content: neither of these changes a single pixel of the
            code itself, so they sit below everything that does. */}
        <CategoryField
          errors={errors}
          value={category}
          onChange={setCategory}
          disabled={isPending}
        />

        <TagsField
          errors={errors}
          value={tags}
          onChange={setTags}
          disabled={isPending}
        />

        {initial && <EditWarning from={initial.mode} to={mode} />}

        {(submitError ?? errors.errors.form) && (
          <FieldError>{submitError ?? errors.errors.form}</FieldError>
        )}

        <Field orientation="horizontal">
          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner />}
            {submitLabel}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
