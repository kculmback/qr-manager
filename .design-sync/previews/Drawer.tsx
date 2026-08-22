import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerSwipeHandle,
  DrawerTitle,
  Field,
  FieldLabel,
  Input,
} from "@qr-manager/ui";

export function Basic() {
  return (
    <Drawer defaultOpen modal={false}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Download QR code</DrawerTitle>
          <DrawerDescription>
            Pick a format for “Spring launch flyer”.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-2 px-4">
          <Button variant="outline">PNG — 1024 px</Button>
          <Button variant="outline">SVG — vector</Button>
          <Button variant="outline">PDF — print ready</Button>
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button variant="ghost" />}>Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function WithSwipeHandle() {
  return (
    <Drawer defaultOpen modal={false} showSwipeHandle>
      <DrawerContent>
        <DrawerSwipeHandle />
        <DrawerHeader>
          <DrawerTitle>Rename code</DrawerTitle>
          <DrawerDescription>Only visible to your team.</DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <Field>
            <FieldLabel htmlFor="drawer-name">Name</FieldLabel>
            <Input id="drawer-name" defaultValue="Spring launch flyer" />
          </Field>
        </div>
        <DrawerFooter>
          <Button>Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
