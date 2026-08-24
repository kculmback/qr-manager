import { useCallback, useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";

import { Button } from "@qr-manager/ui/components/button";
import { cn } from "@qr-manager/ui/lib/utils";

import type { QrArt } from "./qr-art";
import { qrArtProps } from "./qr-art";

/** Pixel size of the PNG export -- large enough to print without artefacts. */
const PNG_EXPORT_SIZE = 1024;

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function toFilename(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "qr-code";
}

/**
 * Whether a logo has been decoded, so the export canvas can be trusted.
 *
 * `qrcode.react` draws the logo onto the canvas only once its own `<img>` has
 * loaded, and `toBlob` reads whatever is there at the time. Without this gate a
 * quick click on Download PNG saves a code with a hole where the logo should
 * be -- silently, and only sometimes, which is the worst kind of wrong.
 */
function useLogoLoaded(logo: string | null | undefined): boolean {
  // Which logo has decoded, rather than a boolean: swapping the logo has to
  // reset the gate, and holding the src is what does that without the effect
  // writing state on its way in.
  const [decoded, setDecoded] = useState<string | null>(null);

  useEffect(() => {
    if (!logo) return;

    let cancelled = false;
    const image = new Image();
    const settle = () => {
      // A logo that will not decode is not worth blocking the export over --
      // the code itself is still correct without it.
      if (!cancelled) setDecoded(logo);
    };

    image.onload = settle;
    image.onerror = settle;
    image.src = logo;

    return () => {
      cancelled = true;
    };
  }, [logo]);

  return !logo || decoded === logo;
}

export interface QrPreviewProps extends QrArt {
  /** The exact string encoded into the grid, as computed by the API. */
  value: string;
  /** Used for the download filename and the accessible title. */
  name: string;
  size?: number;
  className?: string;
}

export function QrPreview({
  value,
  name,
  style,
  logo,
  size = 256,
  className,
}: QrPreviewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoLoaded = useLogoLoaded(logo);

  const downloadSvg = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Self-contained even with a logo: the image is an inline data URI, so the
    // file a print shop opens has nothing to fetch.
    downloadBlob(
      new Blob([new XMLSerializer().serializeToString(svg)], {
        type: "image/svg+xml",
      }),
      `${toFilename(name)}.svg`,
    );
  }, [name]);

  const downloadPng = useCallback(() => {
    // The offscreen canvas below carries the print-resolution copy; the visible
    // QR is an SVG so it stays crisp at any display size.
    canvasRef.current?.toBlob((blob) => {
      if (blob) downloadBlob(blob, `${toFilename(name)}.png`);
    }, "image/png");
  }, [name]);

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* The code's own background, not white: the quiet zone is part of the
          artwork, and a white frame around a coloured one is not what gets
          printed. */}
      <div
        className="rounded-3xl p-4"
        style={{ backgroundColor: style.background }}
      >
        <QRCodeSVG
          ref={svgRef}
          value={value}
          size={size}
          title={`QR code for ${name}`}
          {...qrArtProps({ style, logo, size })}
        />
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={downloadSvg}>
          <Download />
          SVG
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={downloadPng}
          disabled={!logoLoaded}
        >
          <Download />
          PNG
        </Button>
      </div>

      {/* Rendered but never shown: `toBlob` reads the bitmap regardless of
          visibility, and this keeps the PNG export at print resolution without
          a second visible code. */}
      <QRCodeCanvas
        ref={canvasRef}
        value={value}
        size={PNG_EXPORT_SIZE}
        className="hidden"
        {...qrArtProps({ style, logo, size: PNG_EXPORT_SIZE })}
      />
    </div>
  );
}
