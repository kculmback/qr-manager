import {
  ArrowUpRightIcon,
  CircleAlertIcon,
  QrCodeIcon,
  WifiIcon,
} from "lucide-react";

import { Badge } from "@qr-manager/ui";

export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Dynamic</Badge>
      <Badge variant="secondary">Static</Badge>
      <Badge variant="destructive">Expired</Badge>
      <Badge variant="outline">Draft</Badge>
      <Badge variant="ghost">Archived</Badge>
      <Badge variant="link">Scan history</Badge>
    </div>
  );
}

export function WithIcons() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>
        <QrCodeIcon data-icon="inline-start" />
        URL
      </Badge>
      <Badge variant="secondary">
        <WifiIcon data-icon="inline-start" />
        Wi-Fi
      </Badge>
      <Badge variant="destructive">
        <CircleAlertIcon data-icon="inline-start" />
        Webhook failed
      </Badge>
      <Badge variant="outline">
        Open target
        <ArrowUpRightIcon data-icon="inline-end" />
      </Badge>
    </div>
  );
}

export function Counts() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="secondary" className="tabular-nums">
        1,284 scans
      </Badge>
      <Badge variant="outline" className="tabular-nums">
        37
      </Badge>
      <Badge className="min-w-5 rounded-full px-1 tabular-nums">9</Badge>
    </div>
  );
}

export function InContext() {
  return (
    <div className="w-80 rounded-2xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">
            Spring launch flyer
          </div>
          <div className="text-muted-foreground truncate text-xs">
            qr.acme.co/s/9fK2 → acme.co/spring
          </div>
        </div>
        <Badge variant="secondary">Dynamic</Badge>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant="outline">URL</Badge>
        <Badge variant="outline">Print</Badge>
        <Badge variant="destructive">
          <CircleAlertIcon data-icon="inline-start" />
          Action failing
        </Badge>
      </div>
    </div>
  );
}
