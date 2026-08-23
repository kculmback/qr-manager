import { useId, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@qr-manager/ui/components/combobox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@qr-manager/ui/components/field";
import {
  CATEGORY_NAME_MAX_LENGTH,
  dedupeTaxonomyNames,
  MAX_TAGS_PER_CODE,
  normalizeTaxonomyName,
  TAG_NAME_MAX_LENGTH,
  taxonomyKey,
} from "@qr-manager/validators";

import type { FieldErrors } from "~/lib/use-field-errors";
import { useTRPC } from "~/lib/trpc";

/**
 * The categories and tags this user already has, as the combobox options.
 *
 * Both fields query it; react-query dedupes the two calls into one request.
 * Neither field is limited to what comes back -- naming something new is how a
 * category or tag gets created in the first place, so both are creatable.
 */
function useTaxonomy() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.taxonomy.all.queryOptions());
  return data ?? { categories: [], tags: [] };
}

/**
 * The option list with the typed query appended as a "create this one" option,
 * unless it already names an existing option.
 *
 * The created option's *value is the name itself*, so choosing it needs no
 * special case downstream -- only its label differs, and the field spots which
 * one it is by comparing against the returned `creating`. Base UI then treats
 * it as a genuine item, which is what makes keyboard highlighting and Enter to
 * select work without any extra wiring.
 *
 * The match is case-insensitive, mirroring the server: typing `LOBBY` when
 * `lobby` exists offers the existing tag rather than a duplicate.
 */
function useCreatableItems(names: string[], query: string) {
  return useMemo(() => {
    const name = normalizeTaxonomyName(query);
    const exists =
      name === "" ||
      names.some((existing) => taxonomyKey(existing) === taxonomyKey(name));

    return {
      items: exists ? names : [...names, name],
      // Appended last, so an exact-ish existing option always sorts above
      // "create" and takes the automatic highlight.
      creating: exists ? null : name,
    };
  }, [names, query]);
}

function CreatableItem({
  name,
  creating,
}: {
  name: string;
  creating: boolean;
}) {
  return (
    <ComboboxItem value={name}>
      {creating ? (
        <>
          <Plus />
          Create &ldquo;{name}&rdquo;
        </>
      ) : (
        name
      )}
    </ComboboxItem>
  );
}

interface TaxonomyFieldProps {
  disabled?: boolean;
  errors: FieldErrors;
}

/**
 * The code's category: a single-select combobox over the categories the user
 * already has, which also creates one from whatever is typed.
 *
 * A plain select would mean creating the category somewhere else first, before
 * anything could be filed under it. Free text alone would give six spellings
 * of "Marketing". The combobox is both: existing ones are one keystroke away,
 * and a genuinely new name is one more.
 */
export function CategoryField({
  value,
  onChange,
  disabled,
  errors,
}: TaxonomyFieldProps & {
  value: string | null;
  onChange: (category: string | null) => void;
}) {
  const inputId = useId();
  const { categories } = useTaxonomy();
  const [query, setQuery] = useState(value ?? "");

  const names = useMemo(
    () => categories.map((category) => category.name),
    [categories],
  );
  const { items, creating } = useCreatableItems(names, query);
  const error = errors.errors.category;

  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={inputId}>Category</FieldLabel>

      <Combobox
        items={items}
        value={value}
        onValueChange={onChange}
        inputValue={query}
        onInputValueChange={setQuery}
        autoHighlight
        disabled={disabled}
      >
        {/* `showClear` is how the category gets removed again: there is no
            "none" option to pick, because none is the absence of a value. */}
        <ComboboxInput
          id={inputId}
          showClear
          aria-invalid={!!error}
          maxLength={CATEGORY_NAME_MAX_LENGTH}
          placeholder="Marketing"
          disabled={disabled}
        />

        <ComboboxContent>
          <ComboboxEmpty>
            Type a name to create your first category.
          </ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <CreatableItem
                key={item}
                name={item}
                creating={item === creating}
              />
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      <FieldDescription>
        Optional, and one at most. Pick one or type a new name.
      </FieldDescription>
      <FieldError>{error}</FieldError>
    </Field>
  );
}

/**
 * The code's tags: the same combobox in multiple mode, with the chosen tags as
 * removable chips inside the input.
 *
 * Controlled rather than read out of the `FormData` like most of this form --
 * a chip list has no single control to read. `CodeForm` owns the array.
 */
export function TagsField({
  value,
  onChange,
  disabled,
  errors,
}: TaxonomyFieldProps & {
  value: string[];
  onChange: (tags: string[]) => void;
}) {
  const inputId = useId();
  // The popup hangs off the chip container rather than the bare input, which
  // moves around as chips wrap onto new lines.
  const anchor = useComboboxAnchor();
  const { tags: known } = useTaxonomy();
  const [query, setQuery] = useState("");

  const names = useMemo(() => known.map((tag) => tag.name), [known]);
  const { items, creating } = useCreatableItems(names, query);

  const isFull = value.length >= MAX_TAGS_PER_CODE;
  const error = errors.errors.tags;

  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={inputId}>Tags</FieldLabel>

      <Combobox
        multiple
        items={items}
        value={value}
        onValueChange={(next) => {
          onChange(dedupeTaxonomyNames(next).slice(0, MAX_TAGS_PER_CODE));
          // Clear the box only when a tag was added, so removing a chip does
          // not also wipe a half-typed one.
          if (next.length > value.length) setQuery("");
        }}
        inputValue={query}
        onInputValueChange={setQuery}
        autoHighlight
        disabled={disabled}
      >
        {/* Chips are read back positionally by `ComboboxChipRemove`, so they
            have to render in the same order as `value`. */}
        <ComboboxChips ref={anchor} aria-invalid={!!error}>
          {value.map((tag) => (
            <ComboboxChip key={tag}>{tag}</ComboboxChip>
          ))}
          <ComboboxChipsInput
            id={inputId}
            maxLength={TAG_NAME_MAX_LENGTH}
            placeholder={value.length === 0 ? "events, printed, 2026" : ""}
            disabled={disabled || isFull}
          />
        </ComboboxChips>

        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>Type a name to create your first tag.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <CreatableItem
                key={item}
                name={item}
                creating={item === creating}
              />
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      <FieldDescription>
        {isFull
          ? `That is the limit of ${MAX_TAGS_PER_CODE} tags.`
          : "Optional. Pick as many as you like, or type new ones."}
      </FieldDescription>
      <FieldError>{error}</FieldError>
    </Field>
  );
}
