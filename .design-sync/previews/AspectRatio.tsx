import {
  AspectRatio,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qr-manager/ui";

// Deterministic stand-in for a rendered QR bitmap — finder squares plus a
// stable module pattern, so the cell shows real artwork instead of a grey box.
const MODULES = 21;
const filled = (row: number, col: number) => {
  const finder =
    (row < 7 && col < 7) ||
    (row < 7 && col > MODULES - 8) ||
    (row > MODULES - 8 && col < 7);
  if (finder) {
    const r = row > MODULES - 8 ? row - (MODULES - 7) : row;
    const c = col > MODULES - 8 ? col - (MODULES - 7) : col;
    const ring = Math.max(Math.abs(r - 3), Math.abs(c - 3));
    return ring === 3 || ring <= 1;
  }
  return (row * 7 + col * 13 + ((row * col) % 5)) % 3 === 0;
};

function QrArtwork() {
  return (
    <svg
      viewBox={`0 0 ${MODULES} ${MODULES}`}
      className="text-foreground size-full"
      role="img"
      aria-label="QR code for /r/spring-25"
    >
      {Array.from({ length: MODULES }).flatMap((_, row) =>
        Array.from({ length: MODULES }).map((__, col) =>
          filled(row, col) ? (
            <rect
              key={`${row}-${col}`}
              x={col}
              y={row}
              width={1}
              height={1}
              fill="currentColor"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

export function QrPreview() {
  return (
    <div className="w-48">
      <AspectRatio ratio={1} className="bg-card rounded-xl p-3 ring-1 ring-border">
        <QrArtwork />
      </AspectRatio>
    </div>
  );
}

export function Widescreen() {
  return (
    <div className="w-72">
      <AspectRatio
        ratio={16 / 9}
        className="bg-muted text-muted-foreground flex items-center justify-center overflow-hidden rounded-xl px-4 text-center text-sm"
      >
        Landing page preview — promo.example.com/spring
      </AspectRatio>
    </div>
  );
}

export function InCard() {
  return (
    <Card className="w-64">
      <CardContent>
        <AspectRatio ratio={1} className="bg-background rounded-lg p-2 ring-1 ring-border">
          <QrArtwork />
        </AspectRatio>
      </CardContent>
      <CardHeader>
        <CardTitle>Table tent menu</CardTitle>
        <CardDescription>Dynamic code — /r/menu-q3</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary">1,204 scans</Badge>
      </CardContent>
    </Card>
  );
}
