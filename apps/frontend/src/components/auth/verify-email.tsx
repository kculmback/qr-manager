import { useEffect, useState } from "react";
import { useAuth, useSendVerificationEmail } from "@better-auth-ui/react";

import { Button } from "@qr-manager/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@qr-manager/ui/components/card";
import { FieldDescription } from "@qr-manager/ui/components/field";
import { Spinner } from "@qr-manager/ui/components/spinner";
import { toast } from "@qr-manager/ui/components/toast";
import { cn } from "@qr-manager/ui/lib/utils";

import { OpenEmailButton } from "./open-email-button";
import { useIsHydrated } from "./use-is-hydrated";

export interface VerifyEmailProps {
  className?: string;
}

/** Seconds the resend button stays disabled to prevent spamming the endpoint. */
const RESEND_COOLDOWN_SECONDS = 60;

/**
 * Render a card prompting the user to verify their email, with a resend button
 * that is rate-limited by a cooldown timer.
 *
 * The target email is read from `sessionStorage` (set when sign-up or sign-in
 * redirects here); the OpenEmail/Resend controls are only shown when an email
 * is stored. The resend button is disabled while a cooldown is active and shows
 * the remaining seconds.
 *
 * @param className - Additional CSS classes applied to the card
 * @returns The verify-email card React element
 */
export function VerifyEmail({ className }: VerifyEmailProps) {
  const {
    authClient,
    basePaths,
    baseURL,
    localization,
    redirectTo,
    viewPaths,
    Link,
  } = useAuth();

  const isHydrated = useIsHydrated();
  // Derived rather than latched into state: `useIsHydrated` only flips to true
  // after hydration, and `sessionStorage` does not exist during SSR - so the
  // read has to happen on the render that follows, not in the initialiser.
  const email = isHydrated
    ? (sessionStorage.getItem("better-auth-ui.verify-email") ?? "")
    : "";
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (cooldown <= 0 || !email) return;

    const interval = setInterval(() => {
      setCooldown((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown, email]);

  const { mutate: sendVerificationEmail, isPending } = useSendVerificationEmail(
    authClient,
    {
      onSuccess: () => {
        toast.add({
          type: "success",
          title: localization.auth.verificationEmailSent,
        });
        setCooldown(RESEND_COOLDOWN_SECONDS);
      },
    },
  );

  const isCoolingDown = cooldown > 0;

  return (
    <Card className={cn("w-full max-w-sm", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {localization.auth.verifyEmail}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4">
          <FieldDescription>
            {localization.auth.checkYourEmail}
          </FieldDescription>

          {email && (
            <div className="flex flex-col gap-3">
              <OpenEmailButton email={email} />

              <Button
                type="button"
                variant="outline"
                disabled={!email || isCoolingDown || isPending}
                onClick={() =>
                  sendVerificationEmail({
                    email,
                    callbackURL: `${baseURL}${redirectTo}`,
                  })
                }
              >
                {isPending && <Spinner />}

                {isCoolingDown
                  ? localization.auth.resendIn.replace(
                      "{{seconds}}",
                      String(cooldown),
                    )
                  : localization.auth.resend}
              </Button>
            </div>
          )}
        </div>

        <div className="mt-4 flex w-full flex-col items-center gap-3">
          <FieldDescription className="text-center">
            {localization.auth.alreadyVerifiedYourEmail}{" "}
            <Link
              href={`${basePaths.auth}/${viewPaths.auth.signIn}`}
              className="underline underline-offset-4"
            >
              {localization.auth.signIn}
            </Link>
          </FieldDescription>
        </div>
      </CardContent>
    </Card>
  );
}
