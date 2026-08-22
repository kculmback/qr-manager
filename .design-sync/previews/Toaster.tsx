import * as React from "react";

import { createToastManager, Toaster } from "@qr-manager/ui";

function Stage({
  toasts,
}: {
  toasts: { title: string; description?: string; type?: string }[];
}) {
  const manager = React.useMemo(() => createToastManager(), []);
  React.useEffect(() => {
    for (const t of toasts) manager.add({ timeout: 0, ...t });
  }, [manager, toasts]);
  return (
    <div className="relative h-56 w-[420px]">
      <Toaster toastManager={manager} />
    </div>
  );
}

export function Success() {
  return (
    <Stage
      toasts={[
        {
          type: "success",
          title: "Destination updated",
          description: "Spring launch flyer now points to /campaigns/spring.",
        },
      ]}
    />
  );
}

export function Stacked() {
  return (
    <Stage
      toasts={[
        { type: "success", title: "QR code created", description: "Warehouse door" },
        { type: "info", title: "Export ready", description: "scans-march.csv" },
        {
          type: "error",
          title: "Webhook failed",
          description: "Home Assistant returned 502.",
        },
      ]}
    />
  );
}
