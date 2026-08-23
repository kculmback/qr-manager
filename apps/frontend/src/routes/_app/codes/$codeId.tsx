import { useCallback, useState } from "react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Copy, Trash2 } from "lucide-react";

import { Badge } from "@qr-manager/ui/components/badge";
import { Button } from "@qr-manager/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qr-manager/ui/components/card";
import { CODE_TYPES } from "@qr-manager/validators";

import type { CodeFormValues } from "~/components/codes/code-form";
import { CodeForm } from "~/components/codes/code-form";
import { DeleteCodeDialog } from "~/components/codes/delete-code-dialog";
import { QrPreview } from "~/components/codes/qr-preview";
import { useTRPC } from "~/lib/trpc";

export const Route = createFileRoute("/_app/codes/$codeId")({
  loader: ({ context: { queryClient, trpc }, params }) =>
    queryClient.ensureQueryData(
      trpc.code.byId.queryOptions({ id: params.codeId }),
    ),
  component: CodeDetailPage,
});

function ShortLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    void navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [url]);

  return (
    <div className="flex items-center gap-2">
      <code className="bg-muted min-w-0 flex-1 truncate rounded-2xl px-3 py-2 text-xs">
        {url}
      </code>
      <Button
        variant="outline"
        size="icon"
        onClick={copy}
        aria-label="Copy short link"
      >
        {copied ? <Check /> : <Copy />}
      </Button>
    </div>
  );
}

function CodeDetailPage() {
  const { codeId } = Route.useParams();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();
  const [error, setError] = useState<string | null>(null);

  const { data: code } = useSuspenseQuery(
    trpc.code.byId.queryOptions({ id: codeId }),
  );

  const invalidate = useCallback(
    () => queryClient.invalidateQueries(trpc.code.pathFilter()),
    [queryClient, trpc],
  );

  const { mutate: updateCode, isPending: isSaving } = useMutation(
    trpc.code.update.mutationOptions({
      onSuccess: invalidate,
      onError: (mutationError) => setError(mutationError.message),
    }),
  );

  const { mutate: deleteCode, isPending: isDeleting } = useMutation(
    trpc.code.delete.mutationOptions({
      onSuccess: async () => {
        await invalidate();
        await navigate({ to: "/codes" });
      },
      onError: (mutationError) => setError(mutationError.message),
    }),
  );

  const handleSubmit = useCallback(
    (values: CodeFormValues) => {
      setError(null);
      updateCode({ id: codeId, ...values });
    },
    [codeId, updateCode],
  );

  return (
    <div className="mx-auto w-full max-w-5xl p-4 md:p-6">
      <header className="flex flex-col gap-2 pb-6">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit"
          nativeButton={false}
          render={<Link to="/codes" />}
        >
          <ArrowLeft />
          Codes
        </Button>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {code.name}
            </h1>
            <Badge variant="outline">{CODE_TYPES[code.type].label}</Badge>
            <Badge variant={code.mode === "dynamic" ? "default" : "secondary"}>
              {code.mode === "dynamic" ? "Dynamic" : "Static"}
            </Badge>
          </div>

          <DeleteCodeDialog
            name={code.name}
            mode={code.mode}
            isPending={isDeleting}
            onConfirm={() => deleteCode({ id: codeId })}
            trigger={
              <Button variant="outline" size="sm">
                <Trash2 />
                Delete
              </Button>
            }
          />
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>QR code</CardTitle>
            <CardDescription className="text-pretty">
              {code.mode === "dynamic"
                ? "Encodes the short link below, so you can change the destination without reprinting."
                : "Encodes the content directly. Reprinting is the only way to change it."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <QrPreview value={code.encodedValue} name={code.name} />
            {code.mode === "dynamic" && <ShortLink url={code.shortUrl} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeForm
              initial={{
                name: code.name,
                mode: code.mode,
                slug: code.slug,
                content: code.content,
              }}
              submitLabel="Save changes"
              isPending={isSaving}
              submitError={error}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
