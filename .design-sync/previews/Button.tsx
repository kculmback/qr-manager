import { ArrowRightIcon, PlusIcon, TrashIcon } from "lucide-react";

import { Button } from "@qr-manager/ui";

export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Create QR code</Button>
      <Button variant="secondary">Duplicate</Button>
      <Button variant="outline">Edit target</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="destructive">Delete code</Button>
      <Button variant="link">View scan history</Button>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}

export function WithIcons() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <PlusIcon data-icon="inline-start" />
        New code
      </Button>
      <Button variant="outline">
        Open dashboard
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
      <Button variant="destructive">
        <TrashIcon data-icon="inline-start" />
        Delete
      </Button>
      <Button size="icon" variant="outline" aria-label="Add">
        <PlusIcon />
      </Button>
      <Button size="icon-sm" variant="ghost" aria-label="Delete">
        <TrashIcon />
      </Button>
    </div>
  );
}

export function Disabled() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled>Create QR code</Button>
      <Button variant="outline" disabled>
        Edit target
      </Button>
      <Button variant="destructive" disabled>
        Delete code
      </Button>
    </div>
  );
}
