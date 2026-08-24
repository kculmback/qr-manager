import { z } from "zod/v4";

/**
 * How a QR code is drawn: its two colours, and how large a logo sits in the
 * middle of it.
 *
 * Everything here is presentation. None of it changes the value encoded into
 * the grid, which is why it lives apart from the payload -- an edit to a colour
 * cannot change where a code points, and an edit to a payload cannot change how
 * it looks. NFC tags have no artwork at all, so a style on an NFC row is inert
 * rather than wrong.
 */

/* -------------------------------------------------------------------------- */
/*                                   Colours                                  */
/* -------------------------------------------------------------------------- */

export const DEFAULT_FOREGROUND = "#000000";
export const DEFAULT_BACKGROUND = "#ffffff";

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

/**
 * Six-digit hex, normalised to lower case.
 *
 * No named colours, no `rgb()` and no alpha channel: the value is written
 * straight into an SVG that gets downloaded and handed to a printer, and the
 * contrast check below needs three channels it can actually read. Three-digit
 * hex is rejected rather than expanded so a colour has one spelling in the
 * database and two rows never differ only in how they were typed.
 */
export const hexColorSchema = z
  .string()
  .trim()
  .regex(HEX_COLOR, "Use a six-digit hex colour, like #1f2937.")
  .transform((value) => value.toLowerCase());

/** One sRGB channel, linearised as WCAG defines it. */
function linearise(value: number): number {
  const channel = value / 255;
  return channel <= 0.03928
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance of a `#rrggbb` colour, 0 (black) to 1 (white). */
export function relativeLuminance(hex: string): number {
  const int = Number.parseInt(hex.slice(1), 16);
  return (
    0.2126 * linearise((int >> 16) & 0xff) +
    0.7152 * linearise((int >> 8) & 0xff) +
    0.0722 * linearise(int & 0xff)
  );
}

/** WCAG contrast ratio between two colours, 1 (identical) to 21 (black/white). */
export function contrastRatio(a: string, b: string): number {
  const first = relativeLuminance(a);
  const second = relativeLuminance(b);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * The least contrast a scanner can be relied on to resolve.
 *
 * Lower than the 4.5 WCAG asks of body text, because a QR code is large blocks
 * rather than thin strokes, and higher than the point where a phone camera
 * starts guessing -- print, screen glare and a cheap sensor all eat into
 * whatever the two colours measure here.
 */
export const MIN_CONTRAST_RATIO = 3;

/* -------------------------------------------------------------------------- */
/*                                    Logo                                    */
/* -------------------------------------------------------------------------- */

/**
 * What a stored logo may be: raster formats a browser draws inertly.
 *
 * SVG is deliberately absent. The logo is embedded in the downloadable SVG as
 * a data URI, and an SVG-inside-SVG is a document rather than a bitmap -- a
 * scriptable one, from a file the user uploaded. Browsers already refuse to run
 * scripts in image context, but the artwork pipeline is no place to be relying
 * on that.
 */
export const LOGO_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"];

const LOGO_DATA_URI =
  /^data:image\/(?:png|jpeg|webp);base64,([A-Za-z0-9+/]*={0,2})$/;

/**
 * The largest logo that can be stored, decoded.
 *
 * It lives on the code row and travels with every read of that code, so this is
 * a transfer budget rather than an image-quality one. Comfortably more than a
 * 512px logo needs; the browser re-encodes uploads to fit (see `readLogoFile`).
 */
export const MAX_LOGO_BYTES = 96 * 1024;

/** Decoded byte length of a base64 string, without decoding it. */
export function base64ByteLength(base64: string): number {
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}

export const codeLogoSchema = z
  .string()
  .refine(
    (value) => LOGO_DATA_URI.test(value),
    "That is not a PNG, JPEG or WebP image.",
  )
  .refine(
    (value) => {
      const [, base64] = LOGO_DATA_URI.exec(value) ?? [];
      return base64 !== undefined && base64ByteLength(base64) <= MAX_LOGO_BYTES;
    },
    `Logos have to be under ${Math.round(MAX_LOGO_BYTES / 1024)} KB.`,
  );

/* -------------------------------------------------------------------------- */
/*                                    Style                                   */
/* -------------------------------------------------------------------------- */

/**
 * How much of the code's width the logo covers.
 *
 * The modules underneath are cleared, not merely covered, so this is the share
 * of the code being thrown away. Level `H` recovers about 30% of a code, and
 * the finder patterns in the corners are not available to spend -- so a quarter
 * of the width is already the optimistic end of what stays scannable.
 */
export const MIN_LOGO_SCALE = 0.1;
export const MAX_LOGO_SCALE = 0.25;
export const DEFAULT_LOGO_SCALE = 0.2;

/**
 * Why this pair of colours will not scan, or null if it will.
 *
 * A function rather than two refinements, because the form asks the same
 * question live -- colours get chosen by looking at them, and finding out they
 * are unreadable only after pressing Save is too late to be useful. One
 * definition means the warning under the swatches and the rule the server
 * enforces cannot say different things.
 */
export function describeContrastProblem(colors: {
  foreground: string;
  background: string;
}): string | null {
  if (
    contrastRatio(colors.foreground, colors.background) < MIN_CONTRAST_RATIO
  ) {
    return "These two colours are too close for a scanner to tell apart.";
  }

  // Plenty of decoders handle an inverted code and plenty do not, and which one
  // is in somebody's hand is exactly what a printed code cannot know.
  if (
    relativeLuminance(colors.foreground) >= relativeLuminance(colors.background)
  ) {
    return "The code colour has to be darker than the background.";
  }

  return null;
}

export const codeStyleSchema = z
  .object({
    /** The dark modules. */
    foreground: hexColorSchema,
    /** The quiet zone and the light modules. */
    background: hexColorSchema,
    logoScale: z.number().min(MIN_LOGO_SCALE).max(MAX_LOGO_SCALE),
  })
  // Deliberately unpathed. Contrast is a fact about the *pair*, so pinning the
  // issue to one of the two swatches would both blame the wrong field and
  // duplicate the warning the form already shows under both of them.
  .superRefine((style, ctx) => {
    const problem = describeContrastProblem(style);
    if (problem) ctx.addIssue({ code: "custom", message: problem });
  });

export type CodeStyle = z.infer<typeof codeStyleSchema>;

/** What a code with no styling of its own is drawn as. */
export const DEFAULT_CODE_STYLE: CodeStyle = {
  foreground: DEFAULT_FOREGROUND,
  background: DEFAULT_BACKGROUND,
  logoScale: DEFAULT_LOGO_SCALE,
};

/**
 * The error correction level to encode at.
 *
 * A logo does not sit on top of the code, it replaces the modules underneath.
 * `H` is what buys those modules back: it recovers ~30% of a damaged code
 * against `M`'s ~15%. Derived rather than offered as a setting, because the
 * only answer that reads reliably is the one that follows from the logo.
 */
export function codeErrorCorrection(hasLogo: boolean): "M" | "H" {
  return hasLogo ? "H" : "M";
}
