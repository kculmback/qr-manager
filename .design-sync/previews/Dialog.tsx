import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
  NativeSelect,
  NativeSelectOption,
  Textarea,
} from "@qr-manager/ui";

export function EditDestination() {
  return (
    <Dialog defaultOpen>
      <DialogTrigger render={<Button variant="outline" />}>
        Edit target
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit destination</DialogTitle>
          <DialogDescription>
            Scans of qr.sh/spring-25 start redirecting here immediately — the
            printed code does not change.
          </DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor="dialog-target">Destination URL</FieldLabel>
          <Input
            id="dialog-target"
            defaultValue="https://acme.example/spring-launch"
          />
          <FieldDescription>
            All 2,000 printed flyers keep working.
          </FieldDescription>
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CreateCode() {
  return (
    <Dialog defaultOpen>
      <DialogTrigger render={<Button />}>New code</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New QR code</DialogTitle>
          <DialogDescription>
            Dynamic codes encode a short link back to this server, so the target
            stays editable after printing.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="dialog-name">Code name</FieldLabel>
            <Input id="dialog-name" defaultValue="Conference badge" />
          </Field>
          <Field>
            <FieldLabel htmlFor="dialog-type">Payload type</FieldLabel>
            <NativeSelect
              id="dialog-type"
              className="w-full"
              defaultValue="url"
            >
              <NativeSelectOption value="url">URL</NativeSelectOption>
              <NativeSelectOption value="vcard">
                Contact card (vCard)
              </NativeSelectOption>
              <NativeSelectOption value="wifi">
                Wi-Fi credentials
              </NativeSelectOption>
            </NativeSelect>
            <FieldDescription>
              Wi-Fi codes are always static — scanners join offline.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="dialog-notes">Notes</FieldLabel>
            <Textarea
              id="dialog-notes"
              rows={2}
              defaultValue="Back of the lanyard, 500 badges."
            />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button>Create code</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function Informational() {
  return (
    <Dialog defaultOpen>
      <DialogTrigger render={<Button variant="ghost" />}>
        Why did this scan fail?
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Redirect blocked</DialogTitle>
          <DialogDescription>
            The scan action for this code pointed at 192.168.1.14, a private
            address. Outbound webhooks are restricted to public hosts.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
