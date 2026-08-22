import {
  Button,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Switch,
  Textarea,
} from "@qr-manager/ui";

export function EditPanel() {
  return (
    <Sheet defaultOpen modal={false}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit destination</SheetTitle>
          <SheetDescription>
            This code is dynamic — the printed image never changes.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4">
          <Field>
            <FieldLabel htmlFor="sheet-url">Destination URL</FieldLabel>
            <Input id="sheet-url" defaultValue="https://example.com/spring" />
            <FieldDescription>Takes effect on the next scan.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="sheet-notes">Notes</FieldLabel>
            <Textarea id="sheet-notes" rows={3} defaultValue="Printed run of 2,000." />
          </Field>
        </div>
        <SheetFooter>
          <Button>Save changes</Button>
          <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function LeftNav() {
  return (
    <Sheet defaultOpen modal={false}>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>QR Manager</SheetTitle>
          <SheetDescription>Jump to a section</SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4 text-sm">
          <a className="hover:bg-muted rounded-lg px-3 py-2" href="#">All codes</a>
          <a className="bg-muted rounded-lg px-3 py-2" href="#">Analytics</a>
          <a className="hover:bg-muted rounded-lg px-3 py-2" href="#">Scan actions</a>
          <a className="hover:bg-muted rounded-lg px-3 py-2" href="#">Settings</a>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function BottomSettings() {
  return (
    <Sheet defaultOpen modal={false}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Scan actions</SheetTitle>
          <SheetDescription>
            Fire a webhook whenever this code is scanned.
          </SheetDescription>
        </SheetHeader>
        <div className="flex items-center justify-between px-4 pb-2">
          <span className="text-sm">Call Home Assistant webhook</span>
          <Switch defaultChecked />
        </div>
        <SheetFooter>
          <Button size="sm">Done</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
