import { Button, Card, CardContent, Empty, EmptyHeader, EmptyMedia, EmptyTitle, Spinner } from "@qr-manager/ui";

export function Sizes() {
  return (
    <div className="flex items-center gap-6">
      <Spinner className="size-3" />
      <Spinner />
      <Spinner className="size-6" />
      <Spinner className="text-muted-foreground size-8" />
    </div>
  );
}

export function InButtons() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled>
        <Spinner data-icon="inline-start" />
        Generating…
      </Button>
      <Button variant="outline" size="sm" disabled>
        <Spinner data-icon="inline-start" />
        Exporting PNG
      </Button>
      <Button size="icon" variant="ghost" aria-label="Saving">
        <Spinner />
      </Button>
    </div>
  );
}

export function InlineStatus() {
  return (
    <Card className="w-80" size="sm">
      <CardContent className="text-muted-foreground flex items-center gap-3 text-sm">
        <Spinner />
        Resolving 42 short links…
      </CardContent>
    </Card>
  );
}

export function BlockLoading() {
  return (
    <Empty className="w-80 border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner className="size-5" />
        </EmptyMedia>
        <EmptyTitle>Loading scan history</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}
