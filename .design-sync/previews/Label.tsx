import { LockIcon } from "lucide-react";

import { Checkbox, Input, Label, Switch } from "@qr-manager/ui";

export function Basic() {
  return (
    <div className="flex w-80 flex-col gap-2">
      <Label htmlFor="label-slug">Short slug</Label>
      <Input id="label-slug" defaultValue="spring-25" />
    </div>
  );
}

export function WithControl() {
  return (
    <div className="flex w-80 flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="label-utm" defaultChecked />
        <Label htmlFor="label-utm">Append UTM parameters</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="label-webhook" defaultChecked />
        <Label htmlFor="label-webhook">Fire scan webhook</Label>
      </div>
    </div>
  );
}

export function WithIcon() {
  return (
    <div className="flex w-80 flex-col gap-2">
      <Label htmlFor="label-secret">
        <LockIcon className="size-3.5" />
        Wi-Fi password
      </Label>
      <Input id="label-secret" type="password" defaultValue="seaside-2025" />
    </div>
  );
}

export function Disabled() {
  return (
    <div className="flex w-80 flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="label-peer-disabled" disabled />
        <Label htmlFor="label-peer-disabled">
          Append UTM parameters (peer-disabled)
        </Label>
      </div>
      <div className="group flex flex-col gap-2" data-disabled="true">
        <Label htmlFor="label-group-disabled">Short slug (group disabled)</Label>
        <Input id="label-group-disabled" defaultValue="spring-25" disabled />
      </div>
    </div>
  );
}
