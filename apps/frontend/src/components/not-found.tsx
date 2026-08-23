import { Link } from "@tanstack/react-router";
import { QrCode } from "lucide-react";

import { Button } from "@qr-manager/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@qr-manager/ui/components/empty";

/**
 * The router's fallback for a path that matches nothing.
 *
 * Reachable by scan, not just by mistyping: a static code carries a URL that
 * can never be corrected once printed, so a link into this app that later moves
 * or is removed keeps sending people here forever. That makes this a page
 * strangers see, so it renders outside the `_app` shell and assumes no session.
 *
 * Short links (`/r/:slug`) never reach this component -- the proxy sends them
 * to the backend, which serves its own self-contained page.
 */
export function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 md:p-6">
      <Empty className="max-w-md flex-none">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <QrCode />
          </EmptyMedia>
          <EmptyTitle>This page doesn&rsquo;t exist</EmptyTitle>
          <EmptyDescription>
            The address you followed leads nowhere. If you scanned a code, it
            may point somewhere that has since moved or been removed.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          {/* Neutral wording and the app root, because this page has two very
              different visitors: the owner who mistyped a URL, and a stranger
              who scanned something. */}
          <Button nativeButton={false} render={<Link to="/" />}>
            Open QR Manager
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
