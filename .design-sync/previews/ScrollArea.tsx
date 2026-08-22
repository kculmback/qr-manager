import { Badge, Checkbox, Label, ScrollArea, Separator } from "@qr-manager/ui";

const SCANS = [
  { time: "14:02:11", place: "Dublin, IE", device: "iOS" },
  { time: "13:58:47", place: "Cork, IE", device: "Android" },
  { time: "13:51:02", place: "Dublin, IE", device: "iOS" },
  { time: "13:44:39", place: "Galway, IE", device: "Android" },
  { time: "13:31:20", place: "Belfast, GB", device: "iOS" },
  { time: "13:18:55", place: "Dublin, IE", device: "macOS" },
  { time: "13:04:12", place: "Limerick, IE", device: "Android" },
  { time: "12:57:33", place: "Dublin, IE", device: "iOS" },
  { time: "12:40:08", place: "Cork, IE", device: "iOS" },
  { time: "12:22:41", place: "Dublin, IE", device: "Android" },
];

const TAGS = [
  "spring-launch",
  "print",
  "flyer",
  "retail",
  "in-store",
  "table-tent",
  "conference",
  "reception",
];

export function ScanLog() {
  return (
    <ScrollArea className="h-56 w-80 rounded-xl border">
      <div className="p-3 text-sm">
        <p className="text-muted-foreground pb-2 text-xs font-medium uppercase">
          Recent scans
        </p>
        {SCANS.map((scan) => (
          <div key={scan.time}>
            <div className="flex items-center justify-between py-1.5">
              <span className="tabular-nums">{scan.time}</span>
              <span className="text-muted-foreground">{scan.place}</span>
              <Badge variant="secondary">{scan.device}</Badge>
            </div>
            <Separator />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export function PayloadPreview() {
  return (
    <ScrollArea className="bg-muted h-40 w-80 rounded-xl">
      <pre className="p-3 font-mono text-xs leading-relaxed">
        {`BEGIN:VCARD
VERSION:3.0
N:Nolan;Aoife;;;
FN:Aoife Nolan
ORG:Harbour Coffee Co.
TITLE:Store Manager
TEL;TYPE=CELL:+353 87 555 0142
EMAIL:aoife@harbourcoffee.ie
ADR;TYPE=WORK:;;12 Quay St;Galway;;H91 X2P4;IE
URL:https://harbourcoffee.ie
NOTE:Encoded literally — static code.
END:VCARD`}
      </pre>
    </ScrollArea>
  );
}

export function TagPicker() {
  return (
    <ScrollArea className="h-32 w-64 rounded-xl border">
      <div className="flex flex-col gap-1 p-2">
        {TAGS.map((tag) => (
          <Label
            key={tag}
            className="hover:bg-muted flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm"
          >
            <Checkbox defaultChecked={tag === "print"} />
            {tag}
          </Label>
        ))}
      </div>
    </ScrollArea>
  );
}
