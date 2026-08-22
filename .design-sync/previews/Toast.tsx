import * as React from "react";

import { createToastManager, Toaster } from "@qr-manager/ui";

function Stage({
  toast,
}: {
  toast: { title: string; description?: string; type?: string };
}) {
  const manager = React.useMemo(() => createToastManager(), []);
  React.useEffect(() => {
    manager.add({ timeout: 0, ...toast });
  }, [manager, toast]);
  return (
    <div className="relative h-40 w-[420px]">
      <Toaster toastManager={manager} />
    </div>
  );
}

export function Info() {
  return (
    <Stage
      toast={{
        type: "info",
        title: "Scan report queued",
        description: "We'll email you when it's ready.",
      }}
    />
  );
}

export function Success() {
  return (
    <Stage
      toast={{
        type: "success",
        title: "Code duplicated",
        description: "“Spring launch flyer (copy)” is ready to edit.",
      }}
    />
  );
}

export function ErrorToast() {
  return (
    <Stage
      toast={{
        type: "error",
        title: "Couldn't reach the webhook",
        description: "Home Assistant returned 502 Bad Gateway.",
      }}
    />
  );
}
