import type { LucideIcon } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Layers, Link2, Zap } from "lucide-react";

import { Badge } from "@qr-manager/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qr-manager/ui/components/card";

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
});

interface Capability {
  title: string;
  icon: LucideIcon;
  description: string;
}

const capabilities: Capability[] = [
  {
    title: "Many QR types",
    icon: Layers,
    description:
      "Wi-Fi credentials, contact cards, URLs, email, SMS, calendar events and geo — each with its own payload encoding rather than one generic content field.",
  },
  {
    title: "Dynamic by default",
    icon: Link2,
    description:
      "A printed code can never change, so codes encode a short URL back to this server. Retarget a code after it is in the wild; static codes stay supported for the types that need them.",
  },
  {
    title: "Scan analytics",
    icon: BarChart3,
    description:
      "Every scan of a dynamic code passes through the redirect, so scans are recorded individually — counts over time, device, referrer and coarse location.",
  },
  {
    title: "Actions on scan",
    icon: Zap,
    description:
      "Fire user-configured side effects when a code is scanned, such as calling a Home Assistant webhook, without delaying the visitor's redirect.",
  },
];

function RouteComponent() {
  return (
    <div className="mx-auto w-full max-w-5xl p-4 md:p-6">
      <section className="flex flex-col items-start gap-4 py-8 md:py-12">
        <Badge variant="outline">Self-hosted</Badge>

        <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
          Create, manage and track your{" "}
          <span className="text-primary">QR codes</span>
        </h1>

        <p className="text-muted-foreground max-w-2xl text-lg text-pretty">
          QR Manager is a full QR code manager you run yourself — not just a
          generator. The whole stack ships as Docker containers with no
          dependency on a single cloud vendor, so your codes and your scan data
          stay on infrastructure you control.
        </p>
      </section>

      <section className="grid gap-4 pb-8 sm:grid-cols-2">
        {capabilities.map(({ title, icon: Icon, description }) => (
          <Card key={title}>
            <CardHeader>
              <div className="bg-primary/10 text-primary mb-2 flex size-9 items-center justify-center rounded-lg">
                <Icon className="size-4.5" />
              </div>
              <CardTitle>{title}</CardTitle>
              <CardDescription className="text-pretty">
                {description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Early days</CardTitle>
          <CardDescription>
            The application shell is in place, but the QR code, scan and action
            features are still to be built — the sidebar entries marked
            &ldquo;Soon&rdquo; will light up as they land.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          Sign in from the account menu at the bottom of the sidebar to get set
          up ahead of time.
        </CardContent>
      </Card>
    </div>
  );
}
