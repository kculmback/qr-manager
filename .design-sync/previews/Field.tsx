import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
  Input,
  Switch,
  Textarea,
} from "@qr-manager/ui";

export function Basic() {
  return (
    <div className="w-80">
      <Field>
        <FieldLabel htmlFor="qr-name">Code name</FieldLabel>
        <Input id="qr-name" defaultValue="Spring launch flyer" />
        <FieldDescription>Only you see this — it is not encoded.</FieldDescription>
      </Field>
    </div>
  );
}

export function Invalid() {
  return (
    <div className="w-80">
      <Field data-invalid>
        <FieldLabel htmlFor="qr-target">Destination URL</FieldLabel>
        <Input id="qr-target" defaultValue="notaurl" aria-invalid />
        <FieldError>Enter a full URL, including https://</FieldError>
      </Field>
    </div>
  );
}

export function HorizontalToggle() {
  return (
    <div className="w-96">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Fire scan actions</FieldTitle>
          <FieldDescription>
            Call the configured webhook every time this code is scanned.
          </FieldDescription>
        </FieldContent>
        <Switch defaultChecked />
      </Field>
    </div>
  );
}

export function Grouped() {
  return (
    <div className="w-96">
      <FieldSet>
        <FieldLegend>Redirect settings</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="slug">Short slug</FieldLabel>
            <Input id="slug" defaultValue="spring-25" />
            <FieldDescription>Encoded as /r/spring-25</FieldDescription>
          </Field>
          <FieldSeparator />
          <Field>
            <FieldLabel htmlFor="notes">Notes</FieldLabel>
            <Textarea id="notes" rows={3} defaultValue="Printed run of 2,000." />
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  );
}
