import { TrashIcon, WifiOffIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@qr-manager/ui";

export function DeleteCode() {
  return (
    <AlertDialog defaultOpen>
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        Delete code
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this code?</AlertDialogTitle>
          <AlertDialogDescription>
            &ldquo;Spring launch flyer&rdquo; and its 1,284 scan records are
            removed permanently. Anything already printed will stop resolving.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep code</AlertDialogCancel>
          <AlertDialogAction variant="destructive">
            Delete code
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function WithMedia() {
  return (
    <AlertDialog defaultOpen>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        Rotate Wi-Fi password
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <WifiOffIcon className="text-muted-foreground" />
          </AlertDialogMedia>
          <AlertDialogTitle>Reprint required</AlertDialogTitle>
          <AlertDialogDescription>
            Wi-Fi credentials are encoded literally, so the 12 codes in the
            lobby cannot be re-pointed. Rotating the password invalidates them.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Rotate anyway</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function Compact() {
  return (
    <AlertDialog defaultOpen>
      <AlertDialogTrigger render={<Button variant="ghost" size="sm" />}>
        Clear scan history
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <TrashIcon className="text-muted-foreground" />
          </AlertDialogMedia>
          <AlertDialogTitle>Clear scan history?</AlertDialogTitle>
          <AlertDialogDescription>
            Analytics for this code restart from zero.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Clear</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
