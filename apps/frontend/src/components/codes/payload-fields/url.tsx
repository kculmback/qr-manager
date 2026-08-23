import type { UrlPayload } from "@qr-manager/validators";

import type { PayloadFieldsProps } from "./types";
import { CodeField, formString } from "../code-field";

export function UrlFields({
  defaultValue,
  disabled,
  errors,
}: PayloadFieldsProps<UrlPayload>) {
  return (
    <CodeField
      errors={errors}
      name="url"
      label="Destination"
      type="url"
      inputMode="url"
      required
      placeholder="https://example.com"
      defaultValue={defaultValue?.url}
      disabled={disabled}
      description="Where scanning the code takes people."
    />
  );
}

export function urlFromFormData(data: FormData): UrlPayload {
  return { url: formString(data, "url") };
}
