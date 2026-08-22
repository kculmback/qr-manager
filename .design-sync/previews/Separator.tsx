import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@qr-manager/ui";

export function Horizontal() {
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Spring launch flyer</CardTitle>
        <CardDescription>Dynamic code — /r/spring-25</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="text-muted-foreground text-sm">
        Redirects to promo.example.com/spring. Change the target at any time
        without reprinting.
      </CardContent>
    </Card>
  );
}

export function Vertical() {
  return (
    <div className="flex h-12 items-center gap-4 text-sm">
      <span className="tabular-nums">4,812 scans</span>
      <Separator orientation="vertical" />
      <span className="tabular-nums">903 devices</span>
      <Separator orientation="vertical" />
      <span className="text-muted-foreground">Updated 2m ago</span>
    </div>
  );
}

export function InList() {
  return (
    <div className="w-80 text-sm">
      <div className="flex items-center justify-between py-2">
        <span>Reception Wi-Fi</span>
        <span className="text-muted-foreground">Static</span>
      </div>
      <Separator />
      <div className="flex items-center justify-between py-2">
        <span>Conference badge vCard</span>
        <span className="text-muted-foreground">Static</span>
      </div>
      <Separator />
      <div className="flex items-center justify-between py-2">
        <span>Table tent menu</span>
        <span className="text-muted-foreground">Dynamic</span>
      </div>
    </div>
  );
}
