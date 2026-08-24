import type { CodeStyle } from "@qr-manager/validators";
import { codeErrorCorrection } from "@qr-manager/validators";

/**
 * Four modules of quiet zone, as the QR specification requires. Scanners are
 * markedly less reliable without it, and `qrcode.react` defaults to none.
 */
export const MARGIN_MODULES = 4;

/** A code's artwork: the stored style, plus its logo when one is loaded. */
export interface QrArt {
  style: CodeStyle;
  /**
   * Base64 data URI, or nothing.
   *
   * The list endpoint omits the logo bytes, so `undefined` there means "not
   * loaded" while `null` on a single code means "there is none". Both draw
   * without a logo; only the error correction level cares which, and that is
   * what `hasLogo` is for.
   */
  logo?: string | null;
  /** Whether the real code has a logo, even if its bytes are not to hand. */
  hasLogo?: boolean;
}

/**
 * The `qrcode.react` props for one code's artwork.
 *
 * Shared so the detail preview, the export canvas and the list thumbnails all
 * derive the same grid: the error correction level is part of what determines
 * the module pattern, so a thumbnail that guessed it would draw a code the
 * printed one does not look like.
 */
export function qrArtProps({
  style,
  logo,
  hasLogo = logo != null,
  size,
}: QrArt & { size: number }) {
  const box = Math.round(size * style.logoScale);

  return {
    fgColor: style.foreground,
    bgColor: style.background,
    marginSize: MARGIN_MODULES,
    level: codeErrorCorrection(hasLogo),
    // Square, because `readLogoFile` pads uploads to square -- an oblong box
    // here would stretch the image rather than letterbox it.
    imageSettings: logo
      ? { src: logo, width: box, height: box, excavate: true }
      : undefined,
  };
}
