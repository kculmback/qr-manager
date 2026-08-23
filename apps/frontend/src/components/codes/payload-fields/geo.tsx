import type { GeoPayload } from "@qr-manager/validators";
import { FieldDescription } from "@qr-manager/ui/components/field";

import type { PayloadFieldsProps } from "./types";
import { CodeField, formString } from "../code-field";

export function GeoFields({
  defaultValue,
  disabled,
  errors,
}: PayloadFieldsProps<GeoPayload>) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <CodeField
          errors={errors}
          name="latitude"
          label="Latitude"
          type="number"
          step="any"
          min={-90}
          max={90}
          required
          placeholder="51.5072"
          defaultValue={defaultValue?.latitude}
          disabled={disabled}
        />
        <CodeField
          errors={errors}
          name="longitude"
          label="Longitude"
          type="number"
          step="any"
          min={-180}
          max={180}
          required
          placeholder="-0.1276"
          defaultValue={defaultValue?.longitude}
          disabled={disabled}
        />
      </div>
      <FieldDescription>
        Android opens these in a map app. iOS Camera often ignores them, so a
        link to a map is the safer choice if your audience is mostly on iPhones.
      </FieldDescription>
    </>
  );
}

export function geoFromFormData(data: FormData): GeoPayload {
  // `Number("")` is 0 and `Number("abc")` is NaN, but neither can get here:
  // both fields are `required` and `type="number"`, and the schema rejects NaN
  // for anything that bypasses the browser.
  return {
    latitude: Number(formString(data, "latitude")),
    longitude: Number(formString(data, "longitude")),
  };
}
