import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@qr-manager/ui/components/field";
import { Input } from "@qr-manager/ui/components/input";
import { Spinner } from "@qr-manager/ui/components/spinner";
import { slugSchema } from "@qr-manager/validators";

import type { FieldErrors } from "~/lib/use-field-errors";
import { useTRPC } from "~/lib/trpc";

/** How long the field has to sit still before its value is worth a request. */
const CHECK_DELAY_MS = 400;

export type SlugStatus =
  /** Nothing to say: empty, unchanged, static, or the check itself failed. */
  "idle" | "invalid" | "checking" | "available" | "taken";

export interface SlugCheck {
  status: SlugStatus;
  /** Set for `invalid` and `taken`, where the message belongs on the field. */
  error: string | null;
}

/** Neither of these can be saved, so the form stops before it asks. */
export function blocksSubmit(check: SlugCheck): boolean {
  return check.status === "invalid" || check.status === "taken";
}

/**
 * Whether the short link the user is typing can actually be claimed.
 *
 * Two checks, cheapest first. Format and reserved words come from
 * `slugSchema` -- the same schema the API validates with -- so a malformed slug
 * never costs a request. Only a well-formed one is asked about, and only after
 * the field has been quiet for a moment.
 *
 * The answer is advisory. Someone else can claim the slug between this query
 * and the save, which is why the create and update mutations still handle the
 * conflict rather than trusting what the form was told.
 */
export function useSlugAvailability({
  slug,
  enabled,
  current,
}: {
  slug: string;
  /** False for a static code, which never reaches the redirect table. */
  enabled: boolean;
  /** The slug this code already has. Keeping it is not a conflict with itself. */
  current?: string;
}): SlugCheck {
  const trpc = useTRPC();

  // Normalized the way the server would, so what is asked about and what gets
  // saved cannot differ by a stray capital or a trailing space.
  const value = slug.trim().toLowerCase();

  const [settled, setSettled] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), CHECK_DELAY_MS);
    return () => clearTimeout(timer);
  }, [value]);

  const parsed = useMemo(() => slugSchema.safeParse(settled), [settled]);

  const skip = !enabled || settled === "" || settled === current;

  const query = useQuery(
    trpc.code.slugAvailable.queryOptions(
      { slug: parsed.success ? parsed.data : settled },
      {
        enabled: !skip && parsed.success,
        // Long enough to survive toggling dynamic off and on, short enough that
        // a slug freed a minute ago stops reading as taken.
        staleTime: 30_000,
      },
    ),
  );

  const answer = query.data;

  return useMemo(() => {
    if (!enabled || value === "" || value === current) {
      return { status: "idle" as const, error: null };
    }

    // Typed past what was asked about: a request is coming either way.
    if (value !== settled) return { status: "checking" as const, error: null };

    if (!parsed.success) {
      return {
        status: "invalid" as const,
        error:
          parsed.error.issues[0]?.message ?? "That short link is not valid.",
      };
    }

    // A failed request is not evidence of anything, so it must not block a save
    // the server would have accepted. The unique index has the final say.
    if (query.isError) return { status: "idle" as const, error: null };

    if (answer?.slug !== settled) {
      return { status: "checking" as const, error: null };
    }

    return answer.available
      ? { status: "available" as const, error: null }
      : {
          status: "taken" as const,
          error: "That short link is already taken.",
        };
  }, [enabled, value, current, settled, parsed, query.isError, answer]);
}

export function SlugField({
  errors,
  value,
  onChange,
  check,
  disabled,
  editing,
}: {
  errors: FieldErrors;
  value: string;
  onChange: (value: string) => void;
  check: SlugCheck;
  disabled: boolean;
  /** Editing an existing code, whose short link may already be in print. */
  editing: boolean;
}) {
  // A message from the server outranks the live check: it describes the save
  // the user actually attempted.
  const error = errors.errors.slug ?? check.error;

  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor="slug">Custom short link</FieldLabel>
      <Input
        {...errors.fieldProps("slug")}
        aria-invalid={!!error}
        value={value}
        onChange={(event) => {
          // Replaces rather than extends `fieldProps.onChange`, so clearing the
          // stale message is this handler's job now.
          errors.clearError("slug");
          onChange(event.currentTarget.value);
        }}
        disabled={disabled}
        placeholder="lobby-poster"
        autoComplete="off"
        spellCheck={false}
      />
      <FieldDescription>
        {check.status === "checking" ? (
          <span className="flex items-center gap-2">
            <Spinner />
            Checking whether that one is free&hellip;
          </span>
        ) : check.status === "available" ? (
          "That short link is free."
        ) : editing ? (
          "Changing this breaks every copy of this code already printed."
        ) : (
          "Optional. Leave empty for a short random one."
        )}
      </FieldDescription>
      <FieldError>{error}</FieldError>
    </Field>
  );
}
