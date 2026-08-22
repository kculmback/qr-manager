import { MoreHorizontalIcon } from "lucide-react";

import {
  Badge,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@qr-manager/ui";

const codes = [
  {
    id: "9fK2",
    name: "Spring launch flyer",
    type: "URL",
    dynamic: true,
    destination: "acme.co/spring",
    scans: 1284,
    created: "Mar 4, 2026",
  },
  {
    id: "Qw7L",
    name: "Reception Wi-Fi",
    type: "Wi-Fi",
    dynamic: false,
    destination: "ACME-Guest (WPA2)",
    scans: 412,
    created: "Feb 19, 2026",
  },
  {
    id: "Bd31",
    name: "Trade show badge",
    type: "vCard",
    dynamic: true,
    destination: "acme.co/c/rosa",
    scans: 96,
    created: "Jan 30, 2026",
  },
  {
    id: "Zt58",
    name: "Warehouse door",
    type: "URL",
    dynamic: true,
    destination: "ha.local/webhook/door",
    scans: 3047,
    created: "Nov 12, 2025",
  },
];

export function CodeList() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Destination</TableHead>
          <TableHead className="text-right">Scans</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {codes.map((code) => (
          <TableRow key={code.id}>
            <TableCell className="font-medium">{code.name}</TableCell>
            <TableCell>
              <Badge variant="secondary">{code.type}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground font-mono text-xs">
              {code.destination}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {code.scans.toLocaleString()}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {code.created}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function WithSelectionAndActions() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">
            <Checkbox aria-label="Select all codes" />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Mode</TableHead>
          <TableHead className="text-right">Scans</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {codes.slice(0, 3).map((code, i) => (
          <TableRow key={code.id} data-state={i === 0 ? "selected" : undefined}>
            <TableCell>
              <Checkbox
                defaultChecked={i === 0}
                aria-label={`Select ${code.name}`}
              />
            </TableCell>
            <TableCell className="font-medium">{code.name}</TableCell>
            <TableCell>
              <Badge variant={code.dynamic ? "default" : "secondary"}>
                {code.dynamic ? "Dynamic" : "Static"}
              </Badge>
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {code.scans.toLocaleString()}
            </TableCell>
            <TableCell>
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label={`Actions for ${code.name}`}
              >
                <MoreHorizontalIcon />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function WithFooterAndCaption() {
  return (
    <Table>
      <TableCaption>Scans by code — last 30 days.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Short link</TableHead>
          <TableHead className="text-right">Scans</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {codes.map((code) => (
          <TableRow key={code.id}>
            <TableCell className="font-medium">{code.name}</TableCell>
            <TableCell className="text-muted-foreground font-mono text-xs">
              qr.acme.co/s/{code.id}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {code.scans.toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right tabular-nums">4,839</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
