import { QrCodeIcon, SettingsIcon } from "lucide-react";

import { Button, ThemeToggle } from "@qr-manager/ui";

export function Default() {
  return <ThemeToggle />;
}

// The `dark` variant IS defined in globals.css, so the moon icon resolves and
// the trigger renders with a visible glyph. `light:` and `auto:` are NOT
// defined, which is why the two cells above show an empty button — see
// ThemeToggle.prompt.md.
export function InDarkContext() {
  return (
    <div className="dark bg-background flex w-64 items-center justify-end rounded-2xl border p-3">
      <ThemeToggle />
    </div>
  );
}

export function InHeader() {
  return (
    <div className="bg-card flex w-80 items-center gap-2 rounded-2xl border px-3 py-2">
      <QrCodeIcon className="size-5" />
      <span className="font-heading text-sm font-medium">QR Manager</span>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Settings">
          <SettingsIcon />
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );
}
