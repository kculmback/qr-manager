import type { CodeType } from "@qr-manager/validators";

import type { FieldErrors } from "~/lib/use-field-errors";
import { EmailFields, emailFromFormData } from "./email";
import { GeoFields, geoFromFormData } from "./geo";
import { SmsFields, smsFromFormData } from "./sms";
import { TextFields, textFromFormData } from "./text";
import { UrlFields, urlFromFormData } from "./url";
import { VCardFields, vcardFromFormData } from "./vcard";
import { WifiFields, wifiFromFormData } from "./wifi";

interface FieldsetProps {
  defaultValue?: Record<string, unknown>;
  disabled?: boolean;
  errors: FieldErrors;
}

/**
 * The form half of the payload registry.
 *
 * Kept here rather than in `@qr-manager/validators` so that package stays free
 * of React and the DOM -- it is imported by the API and the migration runner
 * too. Reading a `FormData` is a browser concern; validating the result is not.
 */
export const PAYLOAD_FIELDSETS: Record<
  CodeType,
  {
    Fields: (props: FieldsetProps) => React.ReactNode;
    fromFormData: (data: FormData) => unknown;
  }
> = {
  url: { Fields: UrlFields, fromFormData: urlFromFormData },
  vcard: { Fields: VCardFields, fromFormData: vcardFromFormData },
  wifi: { Fields: WifiFields, fromFormData: wifiFromFormData },
  text: { Fields: TextFields, fromFormData: textFromFormData },
  email: { Fields: EmailFields, fromFormData: emailFromFormData },
  sms: { Fields: SmsFields, fromFormData: smsFromFormData },
  geo: { Fields: GeoFields, fromFormData: geoFromFormData },
};
