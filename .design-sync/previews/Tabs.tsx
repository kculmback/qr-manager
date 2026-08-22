import { ActivityIcon, ScanLineIcon, WebhookIcon } from "lucide-react";

import { Badge, Tabs, TabsContent, TabsList, TabsTrigger } from "@qr-manager/ui";

export function Basic() {
  return (
    <Tabs defaultValue="overview" className="w-80">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="scans">Scans</TabsTrigger>
        <TabsTrigger value="actions">Actions</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-muted-foreground pt-2">
        Dynamic code — /r/spring-25 currently redirects to the spring launch
        landing page.
      </TabsContent>
      <TabsContent value="scans" className="text-muted-foreground pt-2">
        4,812 scans in the last 30 days.
      </TabsContent>
      <TabsContent value="actions" className="text-muted-foreground pt-2">
        One webhook fires on every scan.
      </TabsContent>
    </Tabs>
  );
}

export function LineVariant() {
  return (
    <Tabs defaultValue="scans" className="w-80">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="scans">Scans</TabsTrigger>
        <TabsTrigger value="actions">Actions</TabsTrigger>
      </TabsList>
      <TabsContent value="scans" className="pt-3">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground text-xs">Last 7 days</dt>
            <dd className="text-2xl font-semibold tabular-nums">1,284</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs">Unique devices</dt>
            <dd className="text-2xl font-semibold tabular-nums">903</dd>
          </div>
        </dl>
      </TabsContent>
      <TabsContent value="overview" className="pt-3" />
      <TabsContent value="actions" className="pt-3" />
    </Tabs>
  );
}

export function WithIconsAndBadge() {
  return (
    <Tabs defaultValue="actions" className="w-80">
      <TabsList>
        <TabsTrigger value="scans">
          <ScanLineIcon data-icon="inline-start" />
          Scans
        </TabsTrigger>
        <TabsTrigger value="actions">
          <WebhookIcon data-icon="inline-start" />
          Actions
          <Badge variant="secondary">2</Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="actions" className="text-muted-foreground pt-2">
        Home Assistant webhook and a Slack notification run on each scan.
      </TabsContent>
      <TabsContent value="scans" className="pt-2" />
    </Tabs>
  );
}

export function Vertical() {
  return (
    <Tabs defaultValue="wifi" orientation="vertical" className="w-80">
      <TabsList className="w-40">
        <TabsTrigger value="url">
          <ActivityIcon data-icon="inline-start" />
          URL
        </TabsTrigger>
        <TabsTrigger value="wifi">Wi-Fi</TabsTrigger>
        <TabsTrigger value="vcard">Contact card</TabsTrigger>
      </TabsList>
      <TabsContent value="wifi" className="text-muted-foreground px-3 text-sm">
        SSID and passphrase are encoded literally, so this code is static.
      </TabsContent>
      <TabsContent value="url" className="px-3" />
      <TabsContent value="vcard" className="px-3" />
    </Tabs>
  );
}
