import { ChevronDownIcon, SettingsIcon } from "lucide-react";

import {
  Badge,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
  Switch,
} from "@qr-manager/ui";

export function Open() {
  return (
    <Collapsible defaultOpen className="w-80 space-y-2">
      <CollapsibleTrigger
        render={<Button variant="outline" className="w-full justify-between" />}
      >
        <span className="flex items-center gap-2">
          <SettingsIcon />
          Advanced redirect options
        </span>
        <ChevronDownIcon className="rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 pt-1">
        <Field>
          <FieldLabel htmlFor="utm">UTM campaign</FieldLabel>
          <Input id="utm" defaultValue="spring-launch-2026" />
          <FieldDescription>Appended to every redirect.</FieldDescription>
        </Field>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="cache">Cache the redirect</FieldLabel>
          <Switch id="cache" />
        </Field>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function Closed() {
  return (
    <Collapsible className="w-80 space-y-2">
      <CollapsibleTrigger
        render={<Button variant="outline" className="w-full justify-between" />}
      >
        <span className="flex items-center gap-2">
          <SettingsIcon />
          Advanced redirect options
        </span>
        <ChevronDownIcon />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 pt-1">
        <Field>
          <FieldLabel htmlFor="utm-closed">UTM campaign</FieldLabel>
          <Input id="utm-closed" defaultValue="spring-launch-2026" />
        </Field>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function ScanDetail() {
  return (
    <Collapsible defaultOpen className="w-80">
      <CollapsibleTrigger
        render={<Button variant="ghost" className="w-full justify-between" />}
      >
        <span className="tabular-nums">14:02 · Dublin, IE</span>
        <Badge variant="secondary">iOS</Badge>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 py-2 text-sm">
        <div className="flex items-center justify-between py-1">
          <span className="text-muted-foreground">Referrer</span>
          <span>Direct scan</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-muted-foreground">User agent</span>
          <span>Safari 18.2</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-muted-foreground">Action</span>
          <span>Home Assistant · 200</span>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
