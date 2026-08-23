import type { TextPayload } from "@qr-manager/validators";

import type { PayloadFieldsProps } from "./types";
import { CodeField, formString } from "../code-field";

export function TextFields({
  defaultValue,
  disabled,
  errors,
}: PayloadFieldsProps<TextPayload>) {
  return (
    <CodeField
      errors={errors}
      name="text"
      label="Text"
      multiline
      rows={4}
      required
      maxLength={1200}
      defaultValue={defaultValue?.text}
      disabled={disabled}
      description="Shown as-is by the scanner. Longer text makes a denser, harder-to-scan code."
    />
  );
}

export function textFromFormData(data: FormData): TextPayload {
  return { text: formString(data, "text") };
}
