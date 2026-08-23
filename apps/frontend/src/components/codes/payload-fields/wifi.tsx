import type { WifiPayload } from "@qr-manager/validators";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@qr-manager/ui/components/field";
import {
  NativeSelect,
  NativeSelectOption,
} from "@qr-manager/ui/components/native-select";
import { Switch } from "@qr-manager/ui/components/switch";
import { WIFI_SECURITY } from "@qr-manager/validators";

import type { PayloadFieldsProps } from "./types";
import { CodeField, formString, optionalFormString } from "../code-field";
import { formBoolean } from "./types";

const SECURITY_LABELS: Record<(typeof WIFI_SECURITY)[number], string> = {
  WPA: "WPA / WPA2 / WPA3",
  WEP: "WEP",
  nopass: "Open (no password)",
};

export function WifiFields({
  defaultValue,
  disabled,
  errors,
}: PayloadFieldsProps<WifiPayload>) {
  const securityError = errors.errors.security;

  return (
    <>
      <CodeField
        errors={errors}
        name="ssid"
        label="Network name (SSID)"
        required
        maxLength={32}
        defaultValue={defaultValue?.ssid}
        disabled={disabled}
      />

      <Field data-invalid={!!securityError}>
        <FieldLabel htmlFor="security">Security</FieldLabel>
        <NativeSelect
          className="w-full"
          {...errors.fieldProps("security")}
          defaultValue={defaultValue?.security ?? "WPA"}
          disabled={disabled}
        >
          {WIFI_SECURITY.map((value) => (
            <NativeSelectOption key={value} value={value}>
              {SECURITY_LABELS[value]}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <FieldError>{securityError}</FieldError>
      </Field>

      <CodeField
        errors={errors}
        name="password"
        label="Password"
        maxLength={63}
        defaultValue={defaultValue?.password}
        disabled={disabled}
        description="Leave empty only for an open network."
      />

      <Field orientation="horizontal">
        <FieldLabel htmlFor="hidden">Hidden network</FieldLabel>
        <Switch
          id="hidden"
          name="hidden"
          defaultChecked={defaultValue?.hidden}
          disabled={disabled}
        />
      </Field>

      <FieldDescription>
        Wi-Fi codes are always static. The phone reads the credentials while it
        is still offline, so there is nobody to ask for an updated destination.
      </FieldDescription>
    </>
  );
}

export function wifiFromFormData(data: FormData): WifiPayload {
  return {
    ssid: formString(data, "ssid"),
    security: formString(data, "security") as WifiPayload["security"],
    password: optionalFormString(data, "password"),
    hidden: formBoolean(data, "hidden"),
  };
}
