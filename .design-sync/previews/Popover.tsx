import { InfoIcon, SlidersHorizontalIcon } from "lucide-react";

import {
  Button,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  Separator,
} from "@qr-manager/ui";

export function ScanDetails() {
  return (
    <div className="flex justify-center p-4">
      <Popover defaultOpen>
        <PopoverTrigger render={<Button variant="outline" size="sm" />}>
          <InfoIcon data-icon="inline-start" />
          Last scan
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Last scan</PopoverTitle>
            <PopoverDescription>
              14 May 2024, 09:41 — resolved in 38 ms.
            </PopoverDescription>
          </PopoverHeader>
          <Separator />
          <dl className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Location</dt>
              <dd>Lisbon, PT</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Device</dt>
              <dd>iOS 17 · Safari</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Referrer</dt>
              <dd>Direct</dd>
            </div>
          </dl>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function QuickEdit() {
  return (
    <div className="flex justify-center p-4">
      <Popover defaultOpen>
        <PopoverTrigger render={<Button variant="outline" size="sm" />}>
          <SlidersHorizontalIcon data-icon="inline-start" />
          Redirect
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <PopoverHeader>
            <PopoverTitle>Redirect target</PopoverTitle>
            <PopoverDescription>
              Applies to every scan from now on.
            </PopoverDescription>
          </PopoverHeader>
          <Field>
            <FieldLabel htmlFor="popover-target">Destination URL</FieldLabel>
            <Input
              id="popover-target"
              defaultValue="https://acme.example/spring"
            />
            <FieldDescription>Printed codes are unaffected.</FieldDescription>
          </Field>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost">
              Cancel
            </Button>
            <Button size="sm">Save</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function SidePlacement() {
  return (
    <div className="flex justify-start p-4">
      <Popover defaultOpen>
        <PopoverTrigger render={<Button variant="outline" size="sm" />}>
          Campaign
        </PopoverTrigger>
        <PopoverContent side="right" align="start" sideOffset={8}>
          <PopoverHeader>
            <PopoverTitle>Spring 2024</PopoverTitle>
            <PopoverDescription>
              7 codes · 4,912 scans since 1 March.
            </PopoverDescription>
          </PopoverHeader>
          <Button size="sm" variant="outline">
            Open campaign
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
