import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
} from "@qr-manager/ui";

export function InField() {
  return (
    <div className="w-80">
      <Field>
        <FieldLabel htmlFor="input-name">Code name</FieldLabel>
        <Input id="input-name" defaultValue="Spring launch flyer" />
        <FieldDescription>
          Only you see this — it is not encoded.
        </FieldDescription>
      </Field>
    </div>
  );
}

export function Types() {
  return (
    <div className="w-80">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="input-url">Destination URL</FieldLabel>
          <Input
            id="input-url"
            type="url"
            defaultValue="https://qr.example.com/spring-25"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-email">Report recipient</FieldLabel>
          <Input
            id="input-email"
            type="email"
            placeholder="scans@example.com"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-ttl">Redirect cache (seconds)</FieldLabel>
          <Input id="input-ttl" type="number" defaultValue={300} />
        </Field>
      </FieldGroup>
    </div>
  );
}

export function States() {
  return (
    <div className="w-80">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="input-slug">Short slug</FieldLabel>
          <Input id="input-slug" placeholder="spring-25" />
        </Field>
        <Field data-disabled="true">
          <FieldLabel htmlFor="input-locked">Short slug</FieldLabel>
          <Input id="input-locked" defaultValue="spring-25" disabled />
          <FieldDescription>Locked once the code is printed.</FieldDescription>
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor="input-bad">Destination URL</FieldLabel>
          <Input id="input-bad" defaultValue="example.com/spring" aria-invalid />
          <FieldError>Enter a full URL, including https://</FieldError>
        </Field>
      </FieldGroup>
    </div>
  );
}
