import {
  Field,
  FieldLabel,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@qr-manager/ui";

const payloadTypes = {
  url: "URL",
  wifi: "Wi-Fi network",
  vcard: "Contact card",
  sms: "SMS",
};

const scanActions = {
  ha: "Home Assistant",
  custom: "Custom URL",
  email: "Email me",
  push: "Push notification",
};

const ranges = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

export function Open() {
  return (
    <div className="w-72">
      <Field>
        <FieldLabel>Payload type</FieldLabel>
        <Select items={payloadTypes} defaultValue="wifi" defaultOpen>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} align="start">
            <SelectGroup>
              <SelectItem value="url">URL</SelectItem>
              <SelectItem value="wifi">Wi-Fi network</SelectItem>
              <SelectItem value="vcard">Contact card</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}

export function Grouped() {
  return (
    <div className="w-72">
      <Select items={scanActions} defaultValue="ha" defaultOpen>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false} align="start">
          <SelectGroup>
            <SelectLabel>Webhooks</SelectLabel>
            <SelectItem value="ha">Home Assistant</SelectItem>
            <SelectItem value="custom">Custom URL</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Notify</SelectLabel>
            <SelectItem value="email">Email me</SelectItem>
            <SelectItem value="push" disabled>
              Push notification
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export function Triggers() {
  return (
    <div className="flex w-72 flex-col items-start gap-3">
      <Select items={ranges} defaultValue="30d">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
        </SelectContent>
      </Select>
      <Select items={ranges} defaultValue="30d">
        <SelectTrigger size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a campaign…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="spring">Spring launch</SelectItem>
        </SelectContent>
      </Select>
      <Select items={{ spring: "Spring launch" }} defaultValue="spring">
        <SelectTrigger className="w-full" disabled>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="spring">Spring launch</SelectItem>
        </SelectContent>
      </Select>
      <Select items={{ spring: "Spring launch" }} defaultValue="spring">
        <SelectTrigger className="w-full" aria-invalid>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="spring">Spring launch</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
