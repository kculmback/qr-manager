import type { VCardPayload } from "@qr-manager/validators";

import type { PayloadFieldsProps } from "./types";
import { CodeField, optionalFormString } from "../code-field";

export function VCardFields({
  defaultValue,
  disabled,
  errors,
}: PayloadFieldsProps<VCardPayload>) {
  const shared = { errors, disabled } as const;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <CodeField
          {...shared}
          name="firstName"
          label="First name"
          maxLength={64}
          defaultValue={defaultValue?.firstName}
        />
        <CodeField
          {...shared}
          name="lastName"
          label="Last name"
          maxLength={64}
          defaultValue={defaultValue?.lastName}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CodeField
          {...shared}
          name="organization"
          label="Organisation"
          maxLength={128}
          defaultValue={defaultValue?.organization}
        />
        <CodeField
          {...shared}
          name="title"
          label="Job title"
          maxLength={128}
          defaultValue={defaultValue?.title}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CodeField
          {...shared}
          name="phone"
          label="Phone"
          type="tel"
          maxLength={32}
          defaultValue={defaultValue?.phone}
        />
        <CodeField
          {...shared}
          name="email"
          label="Email"
          type="email"
          maxLength={254}
          defaultValue={defaultValue?.email}
        />
      </div>

      <CodeField
        {...shared}
        name="url"
        label="Website"
        type="url"
        maxLength={512}
        placeholder="https://example.com"
        defaultValue={defaultValue?.url}
      />

      <CodeField
        {...shared}
        name="street"
        label="Street"
        maxLength={128}
        defaultValue={defaultValue?.street}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <CodeField
          {...shared}
          name="city"
          label="City"
          maxLength={64}
          defaultValue={defaultValue?.city}
        />
        <CodeField
          {...shared}
          name="region"
          label="Region"
          maxLength={64}
          defaultValue={defaultValue?.region}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CodeField
          {...shared}
          name="postalCode"
          label="Postal code"
          maxLength={16}
          defaultValue={defaultValue?.postalCode}
        />
        <CodeField
          {...shared}
          name="country"
          label="Country"
          maxLength={64}
          defaultValue={defaultValue?.country}
        />
      </div>

      <CodeField
        {...shared}
        name="note"
        label="Note"
        multiline
        rows={2}
        maxLength={512}
        defaultValue={defaultValue?.note}
        description="A contact card is long, so it makes a dense code. Fewer fields scan more reliably."
      />
    </>
  );
}

export function vcardFromFormData(data: FormData): VCardPayload {
  return {
    firstName: optionalFormString(data, "firstName"),
    lastName: optionalFormString(data, "lastName"),
    organization: optionalFormString(data, "organization"),
    title: optionalFormString(data, "title"),
    phone: optionalFormString(data, "phone"),
    email: optionalFormString(data, "email"),
    url: optionalFormString(data, "url"),
    street: optionalFormString(data, "street"),
    city: optionalFormString(data, "city"),
    region: optionalFormString(data, "region"),
    postalCode: optionalFormString(data, "postalCode"),
    country: optionalFormString(data, "country"),
    note: optionalFormString(data, "note"),
  };
}
