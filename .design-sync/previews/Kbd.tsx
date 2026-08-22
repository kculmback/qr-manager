import { ArrowUpIcon, CommandIcon } from "lucide-react";

import { Button, Kbd, KbdGroup } from "@qr-manager/ui";

export function Keys() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
      <Kbd>Esc</Kbd>
      <Kbd>Enter</Kbd>
      <Kbd>
        <ArrowUpIcon />
      </Kbd>
    </div>
  );
}

export function Shortcuts() {
  return (
    <div className="flex w-72 flex-col gap-2 text-sm">
      <div className="flex items-center justify-between gap-4">
        <span>Search codes</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span>New QR code</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>N</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span>Copy short link</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>C</Kbd>
        </KbdGroup>
      </div>
    </div>
  );
}

export function WithSeparator() {
  return (
    <div className="text-muted-foreground flex flex-col gap-2 text-sm">
      <KbdGroup>
        <Kbd>
          <CommandIcon />
        </Kbd>
        <Kbd>S</Kbd>
        <span>then</span>
        <Kbd>Enter</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>G</Kbd>
        <span>then</span>
        <Kbd>A</Kbd>
        <span>for analytics</span>
      </KbdGroup>
    </div>
  );
}

export function InButton() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline">
        Search codes
        <KbdGroup className="ml-2">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      <Button size="sm" variant="secondary">
        Save
        <Kbd className="bg-background ml-2">⏎</Kbd>
      </Button>
    </div>
  );
}
