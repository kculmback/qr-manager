import { PlusIcon, QrCodeIcon, SearchXIcon, WifiOffIcon } from "lucide-react";

import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@qr-manager/ui";

export function NoCodesYet() {
  return (
    <Empty className="w-80 border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <QrCodeIcon />
        </EmptyMedia>
        <EmptyTitle>No QR codes yet</EmptyTitle>
        <EmptyDescription>
          Create your first code and point it anywhere — the destination stays
          editable after it is printed.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>
          <PlusIcon data-icon="inline-start" />
          Create QR code
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export function NoResults() {
  return (
    <Empty className="w-80 border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchXIcon />
        </EmptyMedia>
        <EmptyTitle>No codes match “spring”</EmptyTitle>
        <EmptyDescription>
          Try a different name, or clear the campaign filter.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center">
        <Button variant="outline" size="sm">
          Clear filters
        </Button>
        <Button variant="ghost" size="sm">
          Reset search
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export function TextOnly() {
  return (
    <Empty className="w-80 border">
      <EmptyHeader>
        <EmptyTitle>No scans recorded</EmptyTitle>
        <EmptyDescription>
          Static codes are scanned offline, so this code reports no analytics.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export function Compact() {
  return (
    <Empty className="w-80 gap-3 border p-6">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <WifiOffIcon />
        </EmptyMedia>
        <EmptyTitle>No saved networks</EmptyTitle>
        <EmptyDescription>
          Add a network to generate a Wi-Fi join code.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
