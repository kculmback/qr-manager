import { z } from "zod/v4";

import type { CodeTypeDef } from "./types";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal("").transform(() => undefined));

export const vcardPayloadSchema = z
  .object({
    firstName: z.string().trim().max(64).optional(),
    lastName: z.string().trim().max(64).optional(),
    organization: optionalText(128),
    title: optionalText(128),
    phone: optionalText(32),
    email: optionalText(254),
    url: optionalText(512),
    street: optionalText(128),
    city: optionalText(64),
    region: optionalText(64),
    postalCode: optionalText(16),
    country: optionalText(64),
    note: optionalText(512),
  })
  .refine((payload) => !!(payload.firstName ?? payload.lastName), {
    message: "Enter at least a first or last name.",
    path: ["firstName"],
  });

export type VCardPayload = z.infer<typeof vcardPayloadSchema>;

/**
 * `;` and `,` are structural in vCard, so they must be escaped inside a value,
 * and newlines become a literal `\n`. Backslashes go first -- otherwise the
 * escapes added by the later passes would themselves get escaped.
 */
function escapeVCard(value: string): string {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/([;,])/g, "\\$1");
}

/**
 * vCard 3.0, not 4.0: 3.0 is what phone contact importers actually implement.
 *
 * Long lines are deliberately *not* folded at 75 octets as RFC 2426 asks. QR
 * payloads never travel over SMTP, and more scanners mishandle a folded line
 * than are bothered by a long one.
 */
export function encodeVCard(payload: VCardPayload): string {
  const first = payload.firstName ?? "";
  const last = payload.lastName ?? "";

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    // Both are required in practice: some importers read only the structured
    // `N`, others only the display-name `FN`.
    `N:${escapeVCard(last)};${escapeVCard(first)};;;`,
    `FN:${escapeVCard([first, last].filter(Boolean).join(" "))}`,
  ];

  if (payload.organization)
    lines.push(`ORG:${escapeVCard(payload.organization)}`);
  if (payload.title) lines.push(`TITLE:${escapeVCard(payload.title)}`);
  if (payload.phone) lines.push(`TEL;TYPE=CELL:${escapeVCard(payload.phone)}`);
  if (payload.email)
    lines.push(`EMAIL;TYPE=INTERNET:${escapeVCard(payload.email)}`);
  if (payload.url) lines.push(`URL:${escapeVCard(payload.url)}`);

  const address = [
    payload.street,
    payload.city,
    payload.region,
    payload.postalCode,
    payload.country,
  ];
  if (address.some(Boolean)) {
    // ADR is seven semicolon-separated components; the first two (post office
    // box and extended address) are deprecated and left empty.
    lines.push(
      `ADR;TYPE=HOME:;;${address.map((part) => escapeVCard(part ?? "")).join(";")}`,
    );
  }

  if (payload.note) lines.push(`NOTE:${escapeVCard(payload.note)}`);

  lines.push("END:VCARD");

  // CRLF per RFC 2426.
  return lines.join("\r\n");
}

export const vcardType: CodeTypeDef<VCardPayload> = {
  label: "Contact card",
  description:
    "Adds a contact to the phone's address book. Static encodes the card directly; dynamic serves a .vcf file that stays editable.",
  schema: vcardPayloadSchema,
  encode: encodeVCard,
  // A dynamic contact card works by redirecting to a hosted `.vcf` download,
  // which the backend serves from the same `/r/:slug` handler. Static is the
  // default anyway: scanning it pops the contact card instantly, with no round
  // trip and no network.
  supportsDynamic: true,
  defaultMode: "static",
};
