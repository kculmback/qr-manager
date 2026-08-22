import { QrCodeIcon, ScanLineIcon } from "lucide-react";

import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@qr-manager/ui";

export function Basic() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Launch flyer</CardTitle>
        <CardDescription>
          Dynamic code — redirects to the current campaign landing page.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        Printed on 2,000 flyers for the spring launch. The destination can be
        changed at any time without reprinting.
      </CardContent>
    </Card>
  );
}

export function WithActionAndFooter() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Reception Wi-Fi</CardTitle>
        <CardDescription>Static code — credentials are encoded literally.</CardDescription>
        <CardAction>
          <Badge variant="secondary">Static</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        Scanners join the network offline, so this code cannot be re-pointed
        after printing.
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">Download PNG</Button>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}

export function Stat() {
  return (
    <div className="flex flex-wrap gap-4">
      <Card size="sm" className="w-56">
        <CardHeader>
          <CardDescription>Scans this week</CardDescription>
          <CardTitle className="text-3xl font-semibold">1,284</CardTitle>
          <CardAction>
            <ScanLineIcon className="text-muted-foreground size-5" />
          </CardAction>
        </CardHeader>
      </Card>
      <Card size="sm" className="w-56">
        <CardHeader>
          <CardDescription>Active codes</CardDescription>
          <CardTitle className="text-3xl font-semibold">37</CardTitle>
          <CardAction>
            <QrCodeIcon className="text-muted-foreground size-5" />
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
