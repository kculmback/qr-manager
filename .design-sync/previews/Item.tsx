import {
  ChevronRightIcon,
  ContactIcon,
  LinkIcon,
  QrCodeIcon,
  TriangleAlertIcon,
  WifiIcon,
} from "lucide-react";

import {
  Badge,
  Button,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@qr-manager/ui";

const qrTile =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" shape-rendering="crispEdges"><rect width="40" height="40" fill="#fff"/><g fill="#0f172a"><rect x="4" y="4" width="10" height="10"/><rect x="26" y="4" width="10" height="10"/><rect x="4" y="26" width="10" height="10"/><rect x="18" y="4" width="4" height="4"/><rect x="18" y="12" width="4" height="4"/><rect x="18" y="20" width="4" height="4"/><rect x="26" y="18" width="4" height="4"/><rect x="34" y="18" width="2" height="4"/><rect x="18" y="28" width="4" height="4"/><rect x="26" y="26" width="4" height="4"/><rect x="32" y="32" width="4" height="4"/><rect x="24" y="34" width="4" height="2"/></g></svg>`,
  );

export function Basic() {
  return (
    <Item variant="outline" className="w-80">
      <ItemMedia variant="icon">
        <LinkIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Spring launch flyer</ItemTitle>
        <ItemDescription>qr.acme.co/s/9fK2 → acme.co/spring</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Badge variant="secondary">Dynamic</Badge>
      </ItemActions>
    </Item>
  );
}

export function CodeList() {
  return (
    <ItemGroup className="w-80">
      <Item variant="outline">
        <ItemMedia variant="image">
          <img src={qrTile} alt="" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Spring launch flyer</ItemTitle>
          <ItemDescription>1,284 scans · last 2 minutes ago</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="icon-sm" variant="ghost" aria-label="Open code">
            <ChevronRightIcon />
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <WifiIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Reception Wi-Fi</ItemTitle>
          <ItemDescription>
            Static code — ACME-Guest, WPA2. Cannot be re-pointed once printed.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="icon-sm" variant="ghost" aria-label="Open code">
            <ChevronRightIcon />
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <ContactIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Trade show badge</ItemTitle>
          <ItemDescription>96 scans · vCard for Rosa Marín</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="icon-sm" variant="ghost" aria-label="Open code">
            <ChevronRightIcon />
          </Button>
        </ItemActions>
      </Item>
    </ItemGroup>
  );
}

export function Variants() {
  return (
    <div className="flex w-80 flex-col gap-3">
      <Item>
        <ItemMedia variant="icon">
          <QrCodeIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>default — no border</ItemTitle>
          <ItemDescription>Rows inside an already-bordered list.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <QrCodeIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>outline — standalone card row</ItemTitle>
          <ItemDescription>The default choice for a list of codes.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemMedia variant="icon">
          <TriangleAlertIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>muted — inline notice</ItemTitle>
          <ItemDescription>2 codes have a failing webhook action.</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex w-80 flex-col gap-3">
      <Item variant="outline" size="default">
        <ItemMedia variant="icon">
          <LinkIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Warehouse door</ItemTitle>
          <ItemDescription>3,047 scans</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline" size="sm">
        <ItemMedia variant="icon">
          <LinkIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Warehouse door</ItemTitle>
          <ItemDescription>3,047 scans</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline" size="xs">
        <ItemMedia variant="icon">
          <LinkIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Warehouse door</ItemTitle>
        </ItemContent>
      </Item>
    </div>
  );
}

export function HeaderAndFooter() {
  return (
    <Item variant="outline" className="w-80">
      <ItemHeader>
        <span className="text-muted-foreground text-xs">Scan actions</span>
        <Badge variant="destructive">1 failing</Badge>
      </ItemHeader>
      <ItemMedia variant="icon">
        <QrCodeIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Warehouse door</ItemTitle>
        <ItemDescription>
          Posts to ha.local/webhook/door on every scan.
        </ItemDescription>
      </ItemContent>
      <ItemSeparator />
      <ItemFooter>
        <span className="text-muted-foreground text-xs">
          Last fired 4 minutes ago
        </span>
        <Button size="xs" variant="outline">
          View log
        </Button>
      </ItemFooter>
    </Item>
  );
}
