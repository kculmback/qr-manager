import { CopyIcon, DownloadIcon, TrashIcon } from "lucide-react";

import {
  Button,
  Kbd,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@qr-manager/ui";

export function Basic() {
  return (
    <div className="flex justify-center py-16">
      <Tooltip defaultOpen>
        <TooltipTrigger
          render={<Button variant="outline" size="icon" aria-label="Copy short link" />}
        >
          <CopyIcon />
        </TooltipTrigger>
        <TooltipContent>Copy short link</TooltipContent>
      </Tooltip>
    </div>
  );
}

export function WithShortcut() {
  return (
    <div className="flex justify-center py-16">
      <Tooltip defaultOpen>
        <TooltipTrigger render={<Button variant="outline" />}>
          <DownloadIcon data-icon="inline-start" />
          Download PNG
        </TooltipTrigger>
        <TooltipContent>
          Download PNG
          <Kbd>⌘</Kbd>
          <Kbd>S</Kbd>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export function Sides() {
  return (
    <div className="flex flex-col items-center gap-16 py-12">
      <Tooltip defaultOpen>
        <TooltipTrigger render={<Button variant="outline" size="sm" />}>
          1,284 scans
        </TooltipTrigger>
        <TooltipContent side="top">Scans in the last 7 days</TooltipContent>
      </Tooltip>
      <Tooltip defaultOpen>
        <TooltipTrigger render={<Button variant="outline" size="sm" />}>
          qr.sh/spring-25
        </TooltipTrigger>
        <TooltipContent side="right">
          Dynamic code — target is editable
        </TooltipContent>
      </Tooltip>
      <Tooltip defaultOpen>
        <TooltipTrigger
          render={
            <Button variant="outline" size="icon-sm" aria-label="Delete code" />
          }
        >
          <TrashIcon />
        </TooltipTrigger>
        <TooltipContent side="bottom">Delete code</TooltipContent>
      </Tooltip>
    </div>
  );
}
