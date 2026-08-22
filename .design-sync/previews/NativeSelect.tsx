import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@qr-manager/ui";

export function InField() {
  return (
    <div className="w-80">
      <Field>
        <FieldLabel htmlFor="ns-type">Payload type</FieldLabel>
        <NativeSelect id="ns-type" defaultValue="wifi" className="w-full">
          <NativeSelectOption value="url">URL</NativeSelectOption>
          <NativeSelectOptGroup label="Offline payloads">
            <NativeSelectOption value="wifi">Wi-Fi network</NativeSelectOption>
            <NativeSelectOption value="vcard">Contact card</NativeSelectOption>
          </NativeSelectOptGroup>
          <NativeSelectOptGroup label="Messaging">
            <NativeSelectOption value="sms">SMS</NativeSelectOption>
            <NativeSelectOption value="email">Email</NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
        <FieldDescription>
          Determines how the payload is encoded.
        </FieldDescription>
      </Field>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex flex-col items-start gap-3">
      <NativeSelect defaultValue="30d">
        <NativeSelectOption value="7d">Last 7 days</NativeSelectOption>
        <NativeSelectOption value="30d">Last 30 days</NativeSelectOption>
        <NativeSelectOption value="90d">Last 90 days</NativeSelectOption>
      </NativeSelect>
      <NativeSelect size="sm" defaultValue="30d">
        <NativeSelectOption value="7d">Last 7 days</NativeSelectOption>
        <NativeSelectOption value="30d">Last 30 days</NativeSelectOption>
        <NativeSelectOption value="90d">Last 90 days</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}

export function States() {
  return (
    <div className="w-80">
      <FieldGroup>
        <Field data-disabled="true">
          <FieldLabel htmlFor="ns-disabled">Payload type</FieldLabel>
          <NativeSelect
            id="ns-disabled"
            disabled
            defaultValue="wifi"
            className="w-full"
          >
            <NativeSelectOption value="wifi">Wi-Fi network</NativeSelectOption>
          </NativeSelect>
          <FieldDescription>Locked once the code is printed.</FieldDescription>
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor="ns-invalid">Campaign</FieldLabel>
          <NativeSelect
            id="ns-invalid"
            aria-invalid
            defaultValue=""
            className="w-full"
          >
            <NativeSelectOption value="">Select a campaign…</NativeSelectOption>
            <NativeSelectOption value="spring">
              Spring launch
            </NativeSelectOption>
          </NativeSelect>
          <FieldError>Pick a campaign for this code.</FieldError>
        </Field>
      </FieldGroup>
    </div>
  );
}
