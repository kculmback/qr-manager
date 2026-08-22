import { InfoIcon, LockIcon, TriangleAlertIcon } from "lucide-react";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
  Button,
} from "@qr-manager/ui";

export function Variants() {
  return (
    <div className="flex w-80 flex-col gap-3">
      <Alert>
        <AlertTitle>Destination updated</AlertTitle>
        <AlertDescription>
          Scans of this code now resolve to the new landing page.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Redirect target unreachable</AlertTitle>
        <AlertDescription>
          The last 14 scans returned a 502 from your webhook host.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export function WithIcon() {
  return (
    <div className="flex w-80 flex-col gap-3">
      <Alert>
        <LockIcon />
        <AlertTitle>This code is static and cannot be re-pointed</AlertTitle>
        <AlertDescription>
          Wi-Fi credentials are encoded into the image itself so scanners can
          join the network offline.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <TriangleAlertIcon />
        <AlertTitle>Action blocked</AlertTitle>
        <AlertDescription>
          The webhook URL resolves to a private address on your local network.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export function TitleOnly() {
  return (
    <div className="flex w-80 flex-col gap-3">
      <Alert>
        <InfoIcon />
        <AlertTitle>Analytics are collected for dynamic codes only.</AlertTitle>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Short link qr.sh/spring is already taken.</AlertTitle>
      </Alert>
    </div>
  );
}

export function WithAction() {
  return (
    <Alert className="w-80">
      <InfoIcon />
      <AlertTitle>2,000 flyers already printed</AlertTitle>
      <AlertDescription>
        Changing the destination takes effect on the next scan.
      </AlertDescription>
      <AlertAction>
        <Button size="xs" variant="outline">
          Undo
        </Button>
      </AlertAction>
    </Alert>
  );
}
