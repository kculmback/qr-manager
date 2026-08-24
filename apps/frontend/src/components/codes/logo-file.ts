import { base64ByteLength, MAX_LOGO_BYTES } from "@qr-manager/validators";

/**
 * Turns a file someone picked into the data URI the code row stores.
 *
 * Every upload is re-encoded rather than embedded as-is. That is what makes the
 * stored value predictable: always a PNG, always square, always small enough
 * for the row -- and nothing of the original file's bytes survives, so an
 * uploaded image cannot smuggle a payload or a camera's location metadata into
 * an artwork blob that later gets handed out in a downloadable SVG.
 */

/**
 * The square the logo is drawn into.
 *
 * Generous next to the ~200px a logo occupies in a 1024px print export, so the
 * export never has to upscale, and small enough that a photograph re-encodes
 * to well under the row's budget.
 */
const LOGO_PIXELS = 512;

/** Tried when the full-size PNG will not fit -- a photograph, usually. */
const FALLBACK_PIXELS = 256;

const TOO_LARGE =
  "That image is too detailed to store. Try a simpler logo, or one with a flat background.";

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file is not an image this browser can read."));
    };

    image.src = url;
  });
}

/**
 * Draws the image centred inside a transparent square and encodes it as PNG.
 *
 * Square because the code excavates a square hole for it: padding here means a
 * wide logo is letterboxed into that hole rather than stretched to fill it.
 */
function toSquarePng(image: HTMLImageElement, pixels: number): string {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = pixels;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser cannot process images.");

  // An SVG carrying only a `viewBox` has no intrinsic size, and browsers do
  // not agree on what to report for one -- Safari says zero, which would draw
  // nothing at all and save a blank square. Falling back to the full box is the
  // right answer for a vector anyway: it has no resolution to lose.
  const sourceWidth = image.naturalWidth || pixels;
  const sourceHeight = image.naturalHeight || pixels;

  const scale = Math.min(pixels / sourceWidth, pixels / sourceHeight);
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;

  context.drawImage(
    image,
    (pixels - width) / 2,
    (pixels - height) / 2,
    width,
    height,
  );

  return canvas.toDataURL("image/png");
}

function fits(dataUri: string): boolean {
  const base64 = dataUri.slice(dataUri.indexOf(",") + 1);
  return base64ByteLength(base64) <= MAX_LOGO_BYTES;
}

export async function readLogoFile(file: File): Promise<string> {
  const image = await loadImage(file);

  const full = toSquarePng(image, LOGO_PIXELS);
  if (fits(full)) return full;

  // Detail, not dimensions, is what makes a PNG large, so halving the square is
  // a real reduction rather than a rounding one.
  const smaller = toSquarePng(image, FALLBACK_PIXELS);
  if (fits(smaller)) return smaller;

  throw new Error(TOO_LARGE);
}
