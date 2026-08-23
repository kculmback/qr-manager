"use client";

import type { PasskeyAuthClient } from "@better-auth-ui/core/plugins/passkey";
import type { FormEvent } from "react";
import { useAuth, useAuthPlugin } from "@better-auth-ui/react";
import { useUpdatePasskey } from "@better-auth-ui/react/plugins/passkey";

import { Button, buttonVariants } from "@qr-manager/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@qr-manager/ui/components/dialog";
import { Field, FieldLabel } from "@qr-manager/ui/components/field";
import { Input } from "@qr-manager/ui/components/input";
import { Spinner } from "@qr-manager/ui/components/spinner";

import type { ListedPasskey } from "./delete-passkey-dialog";
import { passkeyPlugin } from "~/lib/auth/passkey-plugin";

export function RenamePasskeyDialog({
  open,
  onOpenChange,
  passkey,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  passkey: ListedPasskey;
}) {
  const { authClient, localization } = useAuth<PasskeyAuthClient>();
  const { localization: labels } = useAuthPlugin(passkeyPlugin);
  const updatePasskey = useUpdatePasskey(authClient, {
    onSuccess: () => onOpenChange(false),
  });
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Uncontrolled, like the add dialog: the dialog unmounts its content when
    // it closes, so `defaultValue` re-seeds the field on every open.
    const formData = new FormData(event.currentTarget);
    const nameField = formData.get("name");
    const nextName = typeof nameField === "string" ? nameField.trim() : "";
    if (nextName) updatePasskey.mutate({ id: passkey.id, name: nextName });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form className="flex flex-col gap-6" onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>{labels.renamePasskey}</DialogTitle>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor={`passkey-name-${passkey.id}`}>
              {labels.name}
            </FieldLabel>
            <Input
              id={`passkey-name-${passkey.id}`}
              name="name"
              autoFocus
              defaultValue={passkey.name ?? ""}
              required
            />
          </Field>
          <DialogFooter>
            <DialogClose
              className={buttonVariants({ variant: "outline" })}
              type="button"
            >
              {localization.settings.cancel}
            </DialogClose>
            <Button disabled={updatePasskey.isPending} type="submit">
              {updatePasskey.isPending && <Spinner />}
              {localization.settings.saveChanges}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
