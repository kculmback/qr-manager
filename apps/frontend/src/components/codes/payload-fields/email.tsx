import type { EmailPayload } from "@qr-manager/validators";

import type { PayloadFieldsProps } from "./types";
import { CodeField, formString, optionalFormString } from "../code-field";

export function EmailFields({
  defaultValue,
  disabled,
  errors,
}: PayloadFieldsProps<EmailPayload>) {
  return (
    <>
      <CodeField
        errors={errors}
        name="to"
        label="To"
        type="email"
        required
        placeholder="hello@example.com"
        defaultValue={defaultValue?.to}
        disabled={disabled}
      />
      <CodeField
        errors={errors}
        name="subject"
        label="Subject"
        maxLength={200}
        defaultValue={defaultValue?.subject}
        disabled={disabled}
      />
      <CodeField
        errors={errors}
        name="body"
        label="Message"
        multiline
        rows={3}
        maxLength={1000}
        defaultValue={defaultValue?.body}
        disabled={disabled}
        description="Pre-fills the draft. The sender can still edit it before sending."
      />
    </>
  );
}

export function emailFromFormData(data: FormData): EmailPayload {
  return {
    to: formString(data, "to"),
    subject: optionalFormString(data, "subject"),
    body: optionalFormString(data, "body"),
  };
}
