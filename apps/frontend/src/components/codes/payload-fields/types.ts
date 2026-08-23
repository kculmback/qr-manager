import type { FieldErrors } from "~/lib/use-field-errors";

/** Props every per-type fieldset takes. */
export interface PayloadFieldsProps<TPayload> {
  /** Existing values when editing; absent when creating. */
  defaultValue?: Partial<TPayload>;
  disabled?: boolean;
  errors: FieldErrors;
}

/** Reads a checkbox/switch out of an uncontrolled form. */
export function formBoolean(data: FormData, name: string): boolean {
  const value = data.get(name);
  return value === "on" || value === "true" || value === "1";
}
