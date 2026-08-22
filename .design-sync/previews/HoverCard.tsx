import { QrCodeIcon, ScanLineIcon } from "lucide-react";

import {
  Badge,
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Separator,
} from "@qr-manager/ui";

export function CodePreview() {
  return (
    <div className="flex justify-center p-4">
      <HoverCard defaultOpen>
        <HoverCardTrigger
          render={<Button variant="link" className="px-0" />}
        >
          qr.sh/spring-25
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex items-start gap-3">
            <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-2xl">
              <QrCodeIcon className="text-muted-foreground size-5" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-medium">Spring launch flyer</span>
              <span className="text-muted-foreground">
                Redirects to acme.example/spring-launch
              </span>
            </div>
          </div>
          <Separator className="my-3" />
          <div className="text-muted-foreground flex items-center gap-2">
            <ScanLineIcon className="size-4" />
            1,284 scans · created 2 March 2024
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

export function CampaignPreview() {
  return (
    <div className="flex justify-start p-4">
      <HoverCard defaultOpen>
        <HoverCardTrigger render={<Button variant="link" className="px-0" />}>
          Spring 2024
        </HoverCardTrigger>
        <HoverCardContent side="right" align="start">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium">Spring 2024</span>
            <Badge variant="secondary">Active</Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            7 dynamic codes across flyers, badges and table tents. Targets can
            be re-pointed at any time.
          </p>
          <Separator className="my-3" />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Scans since 1 March</span>
            <span className="font-medium">4,912</span>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
