import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@qr-manager/ui";

export function WithLabel() {
  return (
    <Progress className="w-80" value={68}>
      <ProgressLabel>Generating batch</ProgressLabel>
      <ProgressValue />
    </Progress>
  );
}

export function BarOnly() {
  return <Progress className="w-80" value={42} aria-label="Export progress" />;
}

export function Values() {
  return (
    <div className="flex w-80 flex-col gap-5">
      <Progress value={8}>
        <ProgressLabel>Uploading vCard photos</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={54}>
        <ProgressLabel>Rendering PNGs</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={100}>
        <ProgressLabel>Writing scan index</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  );
}

export function InCard() {
  return (
    <Card className="w-80" size="sm">
      <CardHeader>
        <CardTitle>Spring campaign quota</CardTitle>
        <CardDescription>3,420 of 5,000 scans used this month</CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={68}>
          <ProgressValue />
        </Progress>
      </CardContent>
    </Card>
  );
}
