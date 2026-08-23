import { useCallback, useRef } from "react";
import { Download } from "lucide-react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";

import { Button } from "@qr-manager/ui/components/button";
import { cn } from "@qr-manager/ui/lib/utils";

/** Pixel size of the PNG export -- large enough to print without artefacts. */
const PNG_EXPORT_SIZE = 1024;

/**
 * Four modules of quiet zone, as the QR specification requires. Scanners are
 * markedly less reliable without it, and `qrcode.react` defaults to none.
 */
const MARGIN_MODULES = 4;

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

export interface QrPreviewProps {
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
  size = 256,
  className,
}: QrPreviewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const downloadSvg = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;

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
      <div className="rounded-3xl bg-white p-4">
        <QRCodeSVG
          ref={svgRef}
          value={value}
          size={size}
          marginSize={MARGIN_MODULES}
          // `M` corrects ~15% damage, which is the usual print/scan trade-off.
          // `H` only becomes necessary once a logo is excavating modules.
          level="M"
          title={`QR code for ${name}`}
        />
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={downloadSvg}>
          <Download />
          SVG
        </Button>
        <Button variant="outline" size="sm" onClick={downloadPng}>
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
        marginSize={MARGIN_MODULES}
        level="M"
        className="hidden"
      />
    </div>
  );
}
