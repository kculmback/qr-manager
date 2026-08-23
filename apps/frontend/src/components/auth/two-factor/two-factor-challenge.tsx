"use client";

import type { TwoFactorAuthClient } from "@better-auth-ui/core/plugins/two-factor";
import type { SyntheticEvent } from "react";
import { useMemo, useState } from "react";
import { authQueryKeys } from "@better-auth-ui/core";
import { useAuth, useAuthPlugin, useSession } from "@better-auth-ui/react";
import {
  useSendTwoFactorOtp,
  useVerifyBackupCode,
  useVerifyTotp,
  useVerifyTwoFactorOtp,
} from "@better-auth-ui/react/plugins/two-factor";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@qr-manager/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qr-manager/ui/components/card";
import { Checkbox } from "@qr-manager/ui/components/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@qr-manager/ui/components/field";
import { Input } from "@qr-manager/ui/components/input";
import { Spinner } from "@qr-manager/ui/components/spinner";
import { cn } from "@qr-manager/ui/lib/utils";

import type { TwoFactorMethod } from "~/lib/auth/two-factor-methods";
import {
  clearTwoFactorMethods,
  readTwoFactorMethods,
} from "~/lib/auth/two-factor-methods";
import { twoFactorPlugin } from "~/lib/auth/two-factor-plugin";
import {
  RESEND_COOLDOWN_SECONDS,
  useResendCooldown,
} from "~/lib/auth/use-resend-cooldown";
import { OtpField } from "../otp-field";
import { useIsHydrated } from "../use-is-hydrated";

/** Challenge surfaces the view can render, in the order they are offered. */
type ChallengeMethod = TwoFactorMethod | "backup";

export interface TwoFactorChallengeProps {
  className?: string;
}

/**
 * Second-factor challenge that finishes a pending sign-in.
 *
 * Better Auth answers a password sign-in with `twoFactorRedirect` instead of
 * a session, and the shared sign-in continuation sends the browser here with
 * the enabled methods in session storage. Verifying is what creates the
 * session, after which the original `redirectTo` is resumed.
 *
 * @param className - Additional CSS classes applied to the card.
 */
export function TwoFactorChallenge({ className }: TwoFactorChallengeProps) {
  const {
    authClient,
    basePaths,
    localization,
    navigate,
    redirectTo,
    viewPaths,
    Link,
  } = useAuth();
  const {
    backupCodes: backupCodesEnabled,
    codeLength,
    localization: twoFactorLocalization,
    trustDevice: trustDeviceEnabled,
  } = useAuthPlugin(twoFactorPlugin);

  const twoFactorClient = authClient as TwoFactorAuthClient;
  const session = useSession(authClient);
  const queryClient = useQueryClient();
  const isHydrated = useIsHydrated();

  // The stored methods only exist in the browser, and the first client render
  // has to match what the server produced — so this is derived from the
  // hydration flag rather than synced across in an effect.
  const methods = useMemo<TwoFactorMethod[]>(
    () => (isHydrated ? readTwoFactorMethods() : ["totp", "otp"]),
    [isHydrated],
  );

  // `null` means "whichever method the server offered first", which isn't
  // known until hydration. Switching pins an explicit choice.
  const [selectedMethod, setSelectedMethod] = useState<ChallengeMethod | null>(
    null,
  );
  const method = selectedMethod ?? methods[0] ?? "totp";

  const [code, setCode] = useState("");
  const [trustDevice, setTrustDevice] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const { cooldown, isCoolingDown, startCooldown } = useResendCooldown();

  const onVerified = async () => {
    clearTwoFactorMethods();
    await queryClient.invalidateQueries({
      queryKey: authQueryKeys.listSessions(session.data?.user.id),
    });
    // Verifying is what actually creates the session, so the cached `null`
    // left behind by whatever guard sent the user to sign in is still there.
    // See `use-sign-in-continuation` — without this the destination guard
    // reads that stale entry and bounces straight back to sign-in.
    await queryClient.refetchQueries({ queryKey: authQueryKeys.session });
    navigate({ to: redirectTo });
  };

  const { mutate: sendTwoFactorOtp, isPending: isSendingOtp } =
    useSendTwoFactorOtp(twoFactorClient, {
      onSuccess: () => {
        setOtpRequested(true);
        startCooldown(RESEND_COOLDOWN_SECONDS);
      },
    });

  const { mutate: verifyTotp, isPending: isVerifyingTotp } = useVerifyTotp(
    twoFactorClient,
    { onError: () => setCode(""), onSuccess: onVerified },
  );

  const { mutate: verifyTwoFactorOtp, isPending: isVerifyingOtp } =
    useVerifyTwoFactorOtp(twoFactorClient, {
      onError: () => setCode(""),
      onSuccess: onVerified,
    });

  const { mutate: verifyBackupCode, isPending: isVerifyingBackupCode } =
    useVerifyBackupCode(twoFactorClient, { onSuccess: onVerified });

  const isPending =
    isSendingOtp || isVerifyingTotp || isVerifyingOtp || isVerifyingBackupCode;
  const needsOtpRequest = method === "otp" && !otpRequested;

  const switchMethod = (next: ChallengeMethod) => {
    setCode("");
    setSelectedMethod(next);
  };

  const verifyCode = (completedCode: string) => {
    if (
      isPending ||
      needsOtpRequest ||
      method === "backup" ||
      completedCode.length !== codeLength
    ) {
      return;
    }

    const trust = trustDeviceEnabled ? { trustDevice } : {};

    if (method === "otp") {
      verifyTwoFactorOtp({ code: completedCode, ...trust });
      return;
    }

    verifyTotp({ code: completedCode, ...trust });
  };

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trust = trustDeviceEnabled ? { trustDevice } : {};

    if (method === "backup") {
      const formData = new FormData(e.currentTarget);
      verifyBackupCode({
        code: (formData.get("backupCode") as string).trim(),
        ...trust,
      });
      return;
    }

    verifyCode(code);
  };

  const description =
    method === "backup"
      ? twoFactorLocalization.backupCodeDescription
      : method === "otp"
        ? twoFactorLocalization.emailedCodeDescription
        : twoFactorLocalization.authenticatorCodeDescription;

  const alternatives: { key: ChallengeMethod; label: string }[] = [
    ...(method !== "totp" && methods.includes("totp")
      ? [
          {
            key: "totp" as const,
            label: twoFactorLocalization.useAuthenticator,
          },
        ]
      : []),
    ...(method !== "otp" && methods.includes("otp")
      ? [{ key: "otp" as const, label: twoFactorLocalization.useEmailedCode }]
      : []),
    ...(method !== "backup" && backupCodesEnabled
      ? [{ key: "backup" as const, label: twoFactorLocalization.useBackupCode }]
      : []),
  ];

  return (
    <Card className={cn("w-full max-w-sm", className)}>
      <CardHeader>
        <CardTitle className="text-xl">
          {twoFactorLocalization.twoFactor}
        </CardTitle>

        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            {method === "backup" ? (
              <Field>
                <FieldLabel htmlFor="backupCode">
                  {twoFactorLocalization.backupCode}
                </FieldLabel>

                <Input
                  id="backupCode"
                  name="backupCode"
                  autoComplete="one-time-code"
                  autoFocus
                  required
                  disabled={isPending}
                />
              </Field>
            ) : (
              <OtpField
                autoFocus
                disabled={isPending || needsOtpRequest}
                label={
                  method === "otp"
                    ? twoFactorLocalization.emailedCode
                    : twoFactorLocalization.authenticatorCode
                }
                length={codeLength}
                name="code"
                value={code}
                onChange={setCode}
                onComplete={verifyCode}
              />
            )}

            {trustDeviceEnabled && (
              <Field orientation="horizontal">
                <Checkbox
                  id="trustDevice"
                  name="trustDevice"
                  checked={trustDevice}
                  disabled={isPending}
                  onCheckedChange={(checked) =>
                    setTrustDevice(checked === true)
                  }
                />

                <FieldLabel htmlFor="trustDevice" className="font-normal">
                  {twoFactorLocalization.trustDevice}
                </FieldLabel>
              </Field>
            )}

            <div className="flex flex-col gap-3">
              {needsOtpRequest ? (
                <Button
                  type="button"
                  disabled={isSendingOtp}
                  onClick={() => sendTwoFactorOtp()}
                >
                  {isSendingOtp && <Spinner />}

                  {twoFactorLocalization.sendEmailCode}
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={
                    isPending ||
                    (method !== "backup" && code.length !== codeLength)
                  }
                >
                  {isPending && <Spinner />}

                  {twoFactorLocalization.verify}
                </Button>
              )}

              {method === "otp" && otpRequested && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending || isCoolingDown}
                  onClick={() => sendTwoFactorOtp()}
                >
                  {isCoolingDown
                    ? localization.auth.resendIn.replace(
                        "{{seconds}}",
                        String(cooldown),
                      )
                    : localization.auth.resend}
                </Button>
              )}

              {alternatives.map((alternative) => (
                <Button
                  type="button"
                  variant="ghost"
                  key={alternative.key}
                  disabled={isPending}
                  onClick={() => switchMethod(alternative.key)}
                >
                  {alternative.label}
                </Button>
              ))}
            </div>
          </FieldGroup>
        </form>

        <div className="mt-4 flex w-full flex-col items-center gap-3">
          <FieldDescription className="text-center">
            <Link
              href={`${basePaths.auth}/${viewPaths.auth.signIn}`}
              className="underline underline-offset-4"
            >
              {twoFactorLocalization.backToSignIn}
            </Link>
          </FieldDescription>
        </div>
      </CardContent>
    </Card>
  );
}
