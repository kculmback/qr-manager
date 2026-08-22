import { CopyIcon, DownloadIcon, PencilIcon, TrashIcon } from "lucide-react";

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@qr-manager/ui";

export function CodeActions() {
  return (
    <div className="p-4">
      <ContextMenu defaultOpen>
        <ContextMenuTrigger className="bg-muted/40 text-muted-foreground flex h-28 w-64 items-center justify-center rounded-3xl border border-dashed text-sm">
          Right-click a code tile
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <PencilIcon />
            Edit target
            <ContextMenuShortcut>⌘E</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <CopyIcon />
            Copy short link
          </ContextMenuItem>
          <ContextMenuItem>
            <DownloadIcon />
            Download PNG
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">
            <TrashIcon />
            Delete code
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}

export function WithCheckboxItems() {
  return (
    <div className="p-4">
      <ContextMenu defaultOpen>
        <ContextMenuTrigger className="bg-muted/40 text-muted-foreground flex h-28 w-64 items-center justify-center rounded-3xl border border-dashed text-sm">
          Right-click the scan chart
        </ContextMenuTrigger>
        <ContextMenuContent className="min-w-52">
          <ContextMenuGroup>
            <ContextMenuLabel>Series</ContextMenuLabel>
            <ContextMenuCheckboxItem checked>
              Total scans
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem checked>
              Unique devices
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem>Webhook failures</ContextMenuCheckboxItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <DownloadIcon />
            Export CSV
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
