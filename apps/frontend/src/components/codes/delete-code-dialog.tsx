import type { ReactElement } from "react";
import { useState } from "react";
import { Trash2 } from "lucide-react";

import type { CodeMode } from "@qr-manager/validators";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@qr-manager/ui/components/alert-dialog";
import { Spinner } from "@qr-manager/ui/components/spinner";

export interface DeleteCodeDialogProps {
  name: string;
  /** Decides what deleting actually accomplishes -- see the copy below. */
  mode: CodeMode;
  isPending: boolean;
  onConfirm: () => void;
  /** The button that opens the dialog; Base UI renders into this element. */
  trigger: ReactElement;
}

export function DeleteCodeDialog({
  name,
  mode,
  isPending,
  onConfirm,
  trigger,
}: DeleteCodeDialogProps) {
  // `AlertDialogAction` is a plain Button rather than a Close, so the dialog
  // has to be controlled for confirming to dismiss it.
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={trigger} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{name}”?</AlertDialogTitle>
          <AlertDialogDescription>
            {mode === "dynamic" ? (
              <>
                Its short link stops resolving immediately, so every copy
                already printed or shared stops working. This cannot be undone.
              </>
            ) : (
              /* The honest answer for a static code: deleting it here changes
                 nothing in the world. The content lives in the printed image,
                 not on this server, so there is no switch to turn off. Saying
                 "stops working" would be a lie somebody discovers by scanning
                 a poster they thought they had retired. */
              <>
                This only removes it from your list.{" "}
                <strong className="text-foreground font-medium">
                  Copies already printed or shared keep working
                </strong>{" "}
                &mdash; a static code carries its content inside the image, so
                nothing here can switch it off. To retire it, collect or cover
                the printed copies. This cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={() => {
              setOpen(false);
              onConfirm();
            }}
          >
            {isPending ? <Spinner /> : <Trash2 />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
