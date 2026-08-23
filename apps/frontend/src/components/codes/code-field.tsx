import type { ComponentProps, ReactNode } from "react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@qr-manager/ui/components/field";
import { Input } from "@qr-manager/ui/components/input";
import { Textarea } from "@qr-manager/ui/components/textarea";

import type { FieldErrors } from "~/lib/use-field-errors";

interface CodeFieldBase {
  name: string;
  label: string;
  description?: ReactNode;
  errors: FieldErrors;
}

/**
 * Discriminated on `multiline` so the control's own props stay exact -- a
 * single merged type would leave `rows` unavailable and collide on `ref`.
 */
export type CodeFieldProps =
  | (CodeFieldBase & { multiline?: false } & Omit<
        ComponentProps<"input">,
        "id" | "name"
      >)
  | (CodeFieldBase & { multiline: true } & Omit<
        ComponentProps<"textarea">,
        "id" | "name"
      >);

/**
 * One labelled control with its description and error slot.
 *
 * Exists because the seven payload types would otherwise repeat the same
 * fifteen lines of Field/Label/Input/Error wiring for every field they have.
 */
export function CodeField(props: CodeFieldProps) {
  const { name, label, description, errors, ...rest } = props;
  const error = errors.errors[name];

  const shared = { ...errors.fieldProps(name), "aria-invalid": !!error };

  let control: ReactNode;
  if (rest.multiline) {
    const { multiline: _multiline, ...textareaProps } = rest;
    control = <Textarea {...shared} {...textareaProps} />;
  } else {
    const { multiline: _multiline, ...inputProps } = rest;
    control = <Input {...shared} {...inputProps} />;
  }

  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      {control}
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{error}</FieldError>
    </Field>
  );
}

/** Reads a text value out of an uncontrolled form, trimmed. */
export function formString(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/** Same, but collapses an empty field to `undefined` for optional payload keys. */
export function optionalFormString(
  data: FormData,
  name: string,
): string | undefined {
  return formString(data, name) || undefined;
}
