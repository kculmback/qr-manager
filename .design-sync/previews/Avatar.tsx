import { CheckIcon, PlusIcon } from "lucide-react";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@qr-manager/ui";

function portrait(bg: string, fg: string) {
  return (
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${bg}"/><circle cx="32" cy="25" r="11" fill="${fg}"/><circle cx="32" cy="58" r="19" fill="${fg}"/></svg>`,
    )
  );
}

const rosa = portrait("#334155", "#cbd5e1");
const dev = portrait("#0f766e", "#ccfbf1");
const tam = portrait("#7c2d12", "#fed7aa");

export function Basic() {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={rosa} alt="Rosa Marín" />
        <AvatarFallback>RM</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>DK</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>TW</AvatarFallback>
      </Avatar>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex items-center gap-3">
      <Avatar size="sm">
        <AvatarFallback>RM</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>RM</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src={rosa} alt="Rosa Marín" />
        <AvatarFallback>RM</AvatarFallback>
      </Avatar>
    </div>
  );
}

export function WithBadge() {
  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback>RM</AvatarFallback>
        <AvatarBadge className="bg-success" />
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src={rosa} alt="Rosa Marín" />
        <AvatarFallback>RM</AvatarFallback>
        <AvatarBadge>
          <CheckIcon />
        </AvatarBadge>
      </Avatar>
    </div>
  );
}

export function Group() {
  return (
    <div className="flex flex-col gap-4">
      <AvatarGroup>
        <Avatar>
          <AvatarImage src={rosa} alt="Rosa Marín" />
          <AvatarFallback>RM</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src={dev} alt="Devi Kapoor" />
          <AvatarFallback>DK</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src={tam} alt="Tam Wu" />
          <AvatarFallback>TW</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+4</AvatarGroupCount>
      </AvatarGroup>
      <AvatarGroup>
        <Avatar size="sm">
          <AvatarImage src={rosa} alt="Rosa Marín" />
          <AvatarFallback>RM</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarImage src={dev} alt="Devi Kapoor" />
          <AvatarFallback>DK</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>
          <PlusIcon />
        </AvatarGroupCount>
      </AvatarGroup>
    </div>
  );
}

export function InContext() {
  return (
    <div className="flex w-72 items-center gap-3 rounded-2xl border p-3">
      <Avatar>
        <AvatarImage src={rosa} alt="Rosa Marín" />
        <AvatarFallback>RM</AvatarFallback>
        <AvatarBadge className="bg-success" />
      </Avatar>
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">Rosa Marín</div>
        <div className="text-muted-foreground truncate text-xs">
          Edited “Spring launch flyer” · 2h ago
        </div>
      </div>
    </div>
  );
}
