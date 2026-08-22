import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Textarea,
} from "@qr-manager/ui";

export function InField() {
  return (
    <div className="w-80">
      <Field>
        <FieldLabel htmlFor="textarea-notes">Internal notes</FieldLabel>
        <Textarea
          id="textarea-notes"
          rows={3}
          defaultValue="Printed run of 2,000 flyers for the spring launch. Re-point to the summer page in June."
        />
        <FieldDescription>
          Never encoded — visible only in the dashboard.
        </FieldDescription>
      </Field>
    </div>
  );
}

export function States() {
  return (
    <div className="w-80">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="textarea-empty">vCard address</FieldLabel>
          <Textarea
            id="textarea-empty"
            rows={3}
            placeholder="220 Harbour Road&#10;Bristol BS1 4RN"
          />
        </Field>
        <Field data-disabled="true">
          <FieldLabel htmlFor="textarea-disabled">Encoded payload</FieldLabel>
          <Textarea
            id="textarea-disabled"
            rows={3}
            disabled
            defaultValue="WIFI:T:WPA;S:Harbour Guest;P:seaside-2025;;"
          />
          <FieldDescription>
            Generated from the Wi-Fi fields above.
          </FieldDescription>
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor="textarea-invalid">Webhook body</FieldLabel>
          <Textarea
            id="textarea-invalid"
            rows={3}
            aria-invalid
            defaultValue={'{ "code": "spring-25", }'}
          />
          <FieldError>Body must be valid JSON.</FieldError>
        </Field>
      </FieldGroup>
    </div>
  );
}
