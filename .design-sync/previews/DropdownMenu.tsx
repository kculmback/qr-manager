import {
  ArrowUpDownIcon,
  CopyIcon,
  DownloadIcon,
  FilterIcon,
  MoreHorizontalIcon,
  PencilIcon,
  QrCodeIcon,
  TrashIcon,
} from "lucide-react";

import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@qr-manager/ui";

export function RowActions() {
  return (
    <div className="p-4">
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label="Code actions" />
          }
        >
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <PencilIcon />
            Edit target
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DownloadIcon />
            Download PNG
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <TrashIcon />
            Delete code
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function GroupedWithSubmenu() {
  return (
    <div className="p-4">
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
          <QrCodeIcon data-icon="inline-start" />
          Spring launch flyer
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Code</DropdownMenuLabel>
            <DropdownMenuItem>
              <PencilIcon />
              Edit target
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CopyIcon />
              Copy short link
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSub defaultOpen>
            <DropdownMenuSubTrigger>
              <DownloadIcon />
              Download as
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>PNG — 1024 px</DropdownMenuItem>
              <DropdownMenuItem>SVG — vector</DropdownMenuItem>
              <DropdownMenuItem>PDF — print ready</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function CheckboxItems() {
  return (
    <div className="p-4">
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
          <FilterIcon data-icon="inline-start" />
          Filter
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-52">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Show code types</DropdownMenuLabel>
            <DropdownMenuCheckboxItem checked>
              Dynamic URL
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>
              Wi-Fi credentials
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Contact card</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem disabled>
              Calendar event
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function RadioItems() {
  return (
    <div className="p-4">
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
          <ArrowUpDownIcon data-icon="inline-start" />
          Sort
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-52">
          <DropdownMenuRadioGroup value="scans">
            <DropdownMenuLabel>Sort codes by</DropdownMenuLabel>
            <DropdownMenuRadioItem value="scans">
              Scans, most first
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="created">
              Date created
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
