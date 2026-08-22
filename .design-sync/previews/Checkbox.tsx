import {
  Checkbox,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@qr-manager/ui";

export function States() {
  return (
    <div className="flex w-72 flex-col gap-4">
      <Field orientation="horizontal">
        <Checkbox id="cb-off" />
        <FieldLabel htmlFor="cb-off">Unchecked</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="cb-on" defaultChecked />
        <FieldLabel htmlFor="cb-on">Checked</FieldLabel>
      </Field>
      <Field orientation="horizontal" data-disabled="true">
        <Checkbox id="cb-disabled" disabled />
        <FieldLabel htmlFor="cb-disabled">Disabled</FieldLabel>
      </Field>
      <Field orientation="horizontal" data-disabled="true">
        <Checkbox id="cb-disabled-on" disabled defaultChecked />
        <FieldLabel htmlFor="cb-disabled-on">Disabled + checked</FieldLabel>
      </Field>
      <Field orientation="horizontal" data-invalid>
        <Checkbox id="cb-invalid" aria-invalid />
        <FieldLabel htmlFor="cb-invalid">Invalid</FieldLabel>
      </Field>
    </div>
  );
}

export function InField() {
  return (
    <div className="w-80">
      <Field orientation="horizontal">
        <Checkbox id="cb-utm" defaultChecked />
        <FieldContent>
          <FieldTitle>Append UTM parameters</FieldTitle>
          <FieldDescription>
            Adds utm_source=qr to the destination on every redirect.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  );
}

export function Group() {
  return (
    <div className="w-80">
      <FieldSet>
        <FieldLegend variant="label">Record on scan</FieldLegend>
        <FieldGroup className="gap-3">
          <Field orientation="horizontal">
            <Checkbox id="cb-geo" defaultChecked />
            <FieldLabel htmlFor="cb-geo">Coarse location</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="cb-ua" defaultChecked />
            <FieldLabel htmlFor="cb-ua">Device and user agent</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="cb-ref" />
            <FieldLabel htmlFor="cb-ref">Referrer</FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  );
}

export function Invalid() {
  return (
    <div className="w-80">
      <Field orientation="horizontal" data-invalid>
        <Checkbox id="cb-terms" aria-invalid />
        <FieldContent>
          <FieldTitle>I understand static codes cannot be re-pointed</FieldTitle>
          <FieldError>Confirm before printing this Wi-Fi code.</FieldError>
        </FieldContent>
      </Field>
    </div>
  );
}
