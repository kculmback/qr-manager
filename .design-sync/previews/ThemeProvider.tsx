import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ThemeProvider,
  ThemeToggle,
  useTheme,
} from "@qr-manager/ui";

function ThemeReadout() {
  const { themeMode, resolvedTheme } = useTheme();

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-muted-foreground">themeMode</span>
      <Badge variant="secondary">{themeMode}</Badge>
      <span className="text-muted-foreground">resolvedTheme</span>
      <Badge variant="secondary">{resolvedTheme}</Badge>
    </div>
  );
}

export function ThemedSurfaces() {
  return (
    <ThemeProvider>
      <div className="bg-background text-foreground flex w-80 flex-col gap-3 rounded-2xl border p-4">
        <div className="flex items-center justify-between">
          <span className="font-heading text-sm font-medium">Appearance</span>
          <ThemeToggle />
        </div>
        <Card size="sm">
          <CardHeader>
            <CardTitle>Spring launch</CardTitle>
            <CardDescription>1,284 scans this week</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button size="sm">Open</Button>
            <Button size="sm" variant="outline">
              Edit target
            </Button>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
}

export function ReadingTheTheme() {
  return (
    <ThemeProvider>
      <div className="bg-card text-card-foreground flex w-80 flex-col gap-3 rounded-2xl border p-4">
        <span className="font-heading text-sm font-medium">
          useTheme() inside the provider
        </span>
        <ThemeReadout />
        <p className="text-muted-foreground text-sm">
          Every descendant reads the same context; the provider writes the
          resolved class onto the document root.
        </p>
      </div>
    </ThemeProvider>
  );
}

export function TokenSwatches() {
  return (
    <ThemeProvider>
      <div className="grid w-80 grid-cols-2 gap-2 text-xs">
        <div className="bg-background text-foreground rounded-xl border p-3">
          bg-background
        </div>
        <div className="bg-card text-card-foreground rounded-xl border p-3">
          bg-card
        </div>
        <div className="bg-muted text-muted-foreground rounded-xl p-3">
          bg-muted
        </div>
        <div className="bg-primary text-primary-foreground rounded-xl p-3">
          bg-primary
        </div>
      </div>
    </ThemeProvider>
  );
}
