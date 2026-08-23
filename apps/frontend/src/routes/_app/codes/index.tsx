import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { Badge } from "@qr-manager/ui/components/badge";
import { Button } from "@qr-manager/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@qr-manager/ui/components/empty";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@qr-manager/ui/components/item";
import { Skeleton } from "@qr-manager/ui/components/skeleton";
import { CODE_TYPES } from "@qr-manager/validators";

import { CodeTaxonomy } from "~/components/codes/code-taxonomy";
import { useTRPC } from "~/lib/trpc";

export const Route = createFileRoute("/_app/codes/")({
  loader: ({ context: { queryClient, trpc } }) =>
    queryClient.ensureQueryData(trpc.code.all.queryOptions()),
  component: CodesPage,
});

function CodesPage() {
  const trpc = useTRPC();
  const { data: codes, isPending } = useQuery(trpc.code.all.queryOptions());

  return (
    <div className="mx-auto w-full max-w-5xl p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-4 pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Codes</h1>
          <p className="text-muted-foreground text-sm text-pretty">
            Everything you have created, newest first.
          </p>
        </div>

        <Button nativeButton={false} render={<Link to="/codes/new" />}>
          <Plus />
          New code
        </Button>
      </header>

      {isPending && (
        <ItemGroup className="gap-3">
          {[0, 1, 2].map((key) => (
            <Skeleton key={key} className="h-24 w-full rounded-3xl" />
          ))}
        </ItemGroup>
      )}

      {codes?.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <QrCode />
            </EmptyMedia>
            <EmptyTitle>No codes yet</EmptyTitle>
            <EmptyDescription>
              Create one and you will get a QR code you can print, plus a short
              link you can point somewhere else later.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button nativeButton={false} render={<Link to="/codes/new" />}>
              <Plus />
              New code
            </Button>
          </EmptyContent>
        </Empty>
      )}

      {codes && codes.length > 0 && (
        <ItemGroup className="gap-3">
          {codes.map((code) => (
            <Item
              key={code.id}
              variant="outline"
              render={<Link to="/codes/$codeId" params={{ codeId: code.id }} />}
            >
              <ItemMedia>
                {/* The bare SVG rather than `QrPreview`: the preview also
                    mounts an offscreen 1024px export canvas, which is wasted
                    work once per row. */}
                <div className="rounded-xl bg-white p-1.5">
                  <QRCodeSVG
                    value={code.encodedValue}
                    size={56}
                    marginSize={2}
                    level="M"
                    title={`QR code for ${code.name}`}
                  />
                </div>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{code.name}</ItemTitle>
                <ItemDescription>
                  {code.mode === "dynamic" ? code.shortUrl : "Static code"}
                </ItemDescription>
                <CodeTaxonomy
                  category={code.category}
                  tags={code.tags}
                  className="pt-1"
                />
              </ItemContent>
              <Badge variant="outline">{CODE_TYPES[code.type].label}</Badge>
              {code.mode === "dynamic" && <Badge>Dynamic</Badge>}
            </Item>
          ))}
        </ItemGroup>
      )}
    </div>
  );
}
