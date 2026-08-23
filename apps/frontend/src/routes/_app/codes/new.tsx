import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Button } from "@qr-manager/ui/components/button";
import { Card, CardContent } from "@qr-manager/ui/components/card";

import type { CodeFormValues } from "~/components/codes/code-form";
import { CodeForm } from "~/components/codes/code-form";
import { useTRPC } from "~/lib/trpc";

export const Route = createFileRoute("/_app/codes/new")({
  component: NewCodePage,
});

function NewCodePage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();
  const [error, setError] = useState<string | null>(null);

  const { mutate: createCode, isPending } = useMutation(
    trpc.code.create.mutationOptions({
      onSuccess: async (code) => {
        await queryClient.invalidateQueries(trpc.code.all.queryFilter());
        await navigate({ to: "/codes/$codeId", params: { codeId: code.id } });
      },
      onError: (mutationError) => setError(mutationError.message),
    }),
  );

  const handleSubmit = useCallback(
    (values: CodeFormValues) => {
      setError(null);
      createCode(values);
    },
    [createCode],
  );

  return (
    <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
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
        <h1 className="text-2xl font-semibold tracking-tight">New code</h1>
      </header>

      <Card>
        <CardContent>
          <CodeForm
            submitLabel="Create code"
            isPending={isPending}
            submitError={error}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
