import type { SmsPayload } from "@qr-manager/validators";

import type { PayloadFieldsProps } from "./types";
import { CodeField, formString, optionalFormString } from "../code-field";

export function SmsFields({
  defaultValue,
  disabled,
  errors,
}: PayloadFieldsProps<SmsPayload>) {
  return (
    <>
      <CodeField
        errors={errors}
        name="phone"
        label="Phone number"
        type="tel"
        required
        placeholder="+1 555 0100"
        defaultValue={defaultValue?.phone}
        disabled={disabled}
        description="Include the country code so the code works abroad."
      />
      <CodeField
        errors={errors}
        name="message"
        label="Message"
        multiline
        rows={3}
        maxLength={500}
        defaultValue={defaultValue?.message}
        disabled={disabled}
      />
    </>
  );
}

export function smsFromFormData(data: FormData): SmsPayload {
  return {
    phone: formString(data, "phone"),
    message: optionalFormString(data, "message"),
  };
}
