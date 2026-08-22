import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
  RadioGroup,
  RadioGroupItem,
} from "@qr-manager/ui";

export function Basic() {
  return (
    <div className="w-80">
      <FieldSet>
        <FieldLegend variant="label">Redirect type</FieldLegend>
        <RadioGroup defaultValue="temporary">
          <Field orientation="horizontal">
            <RadioGroupItem value="temporary" id="rg-302" />
            <FieldLabel htmlFor="rg-302">302 — temporary</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="permanent" id="rg-301" />
            <FieldLabel htmlFor="rg-301">301 — permanent</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="proxy" id="rg-proxy" />
            <FieldLabel htmlFor="rg-proxy">Proxy — no redirect</FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
    </div>
  );
}

export function ChoiceCards() {
  return (
    <div className="w-80">
      <RadioGroup defaultValue="dynamic">
        <FieldLabel htmlFor="rg-dynamic">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Dynamic code</FieldTitle>
              <FieldDescription>
                Encodes a short URL — the destination stays editable after
                printing.
              </FieldDescription>
            </FieldContent>
            <RadioGroupItem value="dynamic" id="rg-dynamic" />
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="rg-static">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Static code</FieldTitle>
              <FieldDescription>
                Encodes the payload literally. Required for Wi-Fi credentials.
              </FieldDescription>
            </FieldContent>
            <RadioGroupItem value="static" id="rg-static" />
          </Field>
        </FieldLabel>
      </RadioGroup>
    </div>
  );
}

export function Disabled() {
  return (
    <div className="w-80">
      <FieldSet>
        <FieldLegend variant="label">Error correction level</FieldLegend>
        <RadioGroup defaultValue="medium" disabled>
          <Field orientation="horizontal" data-disabled="true">
            <RadioGroupItem value="low" id="rg-low" />
            <FieldLabel htmlFor="rg-low">Low — 7%</FieldLabel>
          </Field>
          <Field orientation="horizontal" data-disabled="true">
            <RadioGroupItem value="medium" id="rg-medium" />
            <FieldLabel htmlFor="rg-medium">Medium — 15%</FieldLabel>
          </Field>
        </RadioGroup>
        <FieldDescription>
          Locked while the code has printed scans.
        </FieldDescription>
      </FieldSet>
    </div>
  );
}

export function Invalid() {
  return (
    <div className="w-80">
      <FieldSet data-invalid>
        <FieldLegend variant="label">QR payload type</FieldLegend>
        <RadioGroup>
          <Field orientation="horizontal" data-invalid>
            <RadioGroupItem value="url" id="rg-url" aria-invalid />
            <FieldLabel htmlFor="rg-url">URL</FieldLabel>
          </Field>
          <Field orientation="horizontal" data-invalid>
            <RadioGroupItem value="vcard" id="rg-vcard" aria-invalid />
            <FieldLabel htmlFor="rg-vcard">Contact card</FieldLabel>
          </Field>
        </RadioGroup>
        <FieldError>Pick a payload type to continue.</FieldError>
      </FieldSet>
    </div>
  );
}
