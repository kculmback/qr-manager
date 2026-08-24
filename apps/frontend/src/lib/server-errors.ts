import type { TRPCClientErrorLike } from "@trpc/client";

import type { AppRouter } from "@qr-manager/api";

import type { FieldErrorMap } from "./use-field-errors";

/** A failed mutation, split into what belongs where on the form. */
export interface SubmitError {
  /** Messages that name the control they are about. */
  fields: FieldErrorMap;
  /** Whatever is left over, for the form's own error slot. */
  message: string | null;
}

/**
 * Sorts a tRPC failure into per-field messages and a form-level one.
 *
 * The API's error formatter (`packages/api/src/trpc.ts`) exposes any `ZodError`
 * cause as `data.zodError`, so this covers both kinds of server rejection that
 * name a field: input schema failures, and deliberate conflicts like a short
 * link somebody else already holds. Without this the form could only print the
 * raw message -- for a zod failure, a JSON blob of issues -- in its footer.
 *
 * `z.flattenError` keys on the *first* path segment, which is the field name
 * for everything this form sends at the top level. A nested payload issue would
 * key on `content` instead and match no control; that path is unreachable in
 * practice, because the form validates `codeContentSchema` -- the same schema
 * the server uses -- before it submits at all.
 */
export function toSubmitError(
  error: TRPCClientErrorLike<AppRouter>,
): SubmitError {
  const zodError = error.data?.zodError;

  if (!zodError) return { fields: {}, message: error.message };

  const fields: FieldErrorMap = {};

  for (const [name, messages] of Object.entries(zodError.fieldErrors)) {
    const message = messages?.[0];
    if (message) fields[name] = message;
  }

  return {
    fields,
    // Only fall back to the raw message when nothing landed on a field, so a
    // conflict does not get reported twice in two different places.
    message:
      zodError.formErrors[0] ??
      (Object.keys(fields).length > 0 ? null : error.message),
  };
}
