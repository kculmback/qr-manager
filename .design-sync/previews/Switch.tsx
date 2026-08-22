import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
  Switch,
} from "@qr-manager/ui";

export function States() {
  return (
    <div className="flex w-72 flex-col gap-4">
      <Field orientation="horizontal">
        <FieldLabel htmlFor="sw-off">Off</FieldLabel>
        <Switch id="sw-off" />
      </Field>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="sw-on">On</FieldLabel>
        <Switch id="sw-on" defaultChecked />
      </Field>
      <Field orientation="horizontal" data-disabled="true">
        <FieldLabel htmlFor="sw-disabled">Disabled</FieldLabel>
        <Switch id="sw-disabled" disabled />
      </Field>
      <Field orientation="horizontal" data-disabled="true">
        <FieldLabel htmlFor="sw-disabled-on">Disabled + on</FieldLabel>
        <Switch id="sw-disabled-on" disabled defaultChecked />
      </Field>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex w-72 flex-col gap-4">
      <Field orientation="horizontal">
        <FieldLabel htmlFor="sw-default">Default</FieldLabel>
        <Switch id="sw-default" defaultChecked />
      </Field>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="sw-sm">Small</FieldLabel>
        <Switch id="sw-sm" size="sm" defaultChecked />
      </Field>
    </div>
  );
}

export function SettingsRows() {
  return (
    <div className="w-80">
      <FieldGroup>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Fire scan actions</FieldTitle>
            <FieldDescription>
              Call the Home Assistant webhook on every scan.
            </FieldDescription>
          </FieldContent>
          <Switch defaultChecked />
        </Field>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Record coarse location</FieldTitle>
            <FieldDescription>
              Derived from the scanner IP — city level only.
            </FieldDescription>
          </FieldContent>
          <Switch />
        </Field>
      </FieldGroup>
    </div>
  );
}
