"use client";

import type { PasskeyAuthClient } from "@better-auth-ui/core/plugins/passkey";
import { Fragment, useState } from "react";
import { useAuth, useAuthPlugin } from "@better-auth-ui/react";
import { useListPasskeys } from "@better-auth-ui/react/plugins/passkey";

import { Button } from "@qr-manager/ui/components/button";
import { Card, CardContent } from "@qr-manager/ui/components/card";
import { ItemGroup, ItemSeparator } from "@qr-manager/ui/components/item";
import { cn } from "@qr-manager/ui/lib/utils";

import { passkeyPlugin } from "~/lib/auth/passkey-plugin";
import { AddPasskeyDialog } from "./add-passkey-dialog";
import { Passkey } from "./passkey";
import { PasskeySkeleton } from "./passkey-skeleton";
import { PasskeysEmpty } from "./passkeys-empty";

export interface PasskeysProps {
  className?: string;
}

export function Passkeys({ className }: PasskeysProps) {
  const { authClient } = useAuth<PasskeyAuthClient>();
  const { localization: passkeyLocalization } = useAuthPlugin(passkeyPlugin);

  const { data: passkeys, isPending } = useListPasskeys(authClient);

  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-end justify-between gap-3">
        <h2 className="truncate text-sm font-semibold">
          {passkeyLocalization.passkeys}
        </h2>

        <Button
          className="shrink-0"
          size="sm"
          disabled={isPending}
          onClick={() => setAddOpen(true)}
        >
          {passkeyLocalization.addPasskey}
        </Button>
      </div>

      <Card className="p-0">
        <CardContent className="p-0">
          {isPending ? (
            <PasskeySkeleton />
          ) : !passkeys?.length ? (
            <PasskeysEmpty onAddPress={() => setAddOpen(true)} />
          ) : (
            <ItemGroup className="gap-0">
              {passkeys.map((passkey, index) => (
                <Fragment key={passkey.id}>
                  {index > 0 && <ItemSeparator />}
                  <Passkey passkey={passkey} />
                </Fragment>
              ))}
            </ItemGroup>
          )}
        </CardContent>
      </Card>

      <AddPasskeyDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
