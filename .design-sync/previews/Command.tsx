import {
  BarChart3Icon,
  DownloadIcon,
  PencilIcon,
  PlusIcon,
  QrCodeIcon,
  SettingsIcon,
  WifiIcon,
} from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@qr-manager/ui";

export function Palette() {
  return (
    <Command className="w-80 rounded-2xl border shadow-md">
      <CommandInput placeholder="Search codes and actions…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem>
            <PlusIcon />
            New QR code
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <DownloadIcon />
            Export scan report
            <CommandShortcut>⌘E</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Codes">
          <CommandItem>
            <QrCodeIcon />
            Spring launch flyer
          </CommandItem>
          <CommandItem>
            <WifiIcon />
            Reception Wi-Fi
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export function Filtered() {
  return (
    <Command className="w-80 rounded-2xl border shadow-md" value="scan">
      <CommandInput placeholder="Search…" defaultValue="scan" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Matches">
          <CommandItem>
            <BarChart3Icon />
            Scan analytics
          </CommandItem>
          <CommandItem>
            <DownloadIcon />
            Export scan report
          </CommandItem>
          <CommandItem>
            <SettingsIcon />
            Scan action webhooks
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export function EmptyState() {
  return (
    <Command className="w-80 rounded-2xl border shadow-md">
      <CommandInput placeholder="Search…" defaultValue="zzzz" />
      <CommandList>
        <CommandEmpty>No codes match "zzzz".</CommandEmpty>
      </CommandList>
    </Command>
  );
}

export function Inline() {
  return (
    <Command className="w-80 rounded-2xl border">
      <CommandList>
        <CommandGroup heading="Jump to">
          <CommandItem>
            <QrCodeIcon />
            All codes
          </CommandItem>
          <CommandItem>
            <BarChart3Icon />
            Analytics
          </CommandItem>
          <CommandItem>
            <PencilIcon />
            Drafts
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
