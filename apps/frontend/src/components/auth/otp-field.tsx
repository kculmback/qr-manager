"use client";

import { useId } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import { Field, FieldError, FieldLabel } from "@qr-manager/ui/components/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@qr-manager/ui/components/input-otp";
import { cn } from "@qr-manager/ui/lib/utils";

export interface OtpFieldProps {
  /** Visible label rendered above the slots. */
  label: string;
  /** Number of slots — keep in sync with the server's code length. */
  length: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  autoFocus?: boolean;
  className?: string;
  errorMessage?: string;
  disabled?: boolean;
  name?: string;
}

/** Strip everything the numeric slots can't hold — pasted codes often carry spaces or dashes. */
function normalizeCode(value: string) {
  return value.replace(/\D/g, "");
}

/**
 * Labelled one-time-code input.
 *
 * Shared by every code-based flow (email OTP, two-factor challenge,
 * two-factor enrollment) so slot sizing, pasting, and error wiring behave the
 * same everywhere.
 *
 * @param label - Visible label, also used as the accessible name.
 * @param length - Number of code characters.
 * @param errorMessage - Rendered below the slots when set.
 */
export function OtpField({
  autoFocus,
  className,
  disabled,
  errorMessage,
  label,
  length,
  name,
  onChange,
  onComplete,
  value,
}: OtpFieldProps) {
  const inputId = useId();

  return (
    <Field className={cn(className)} data-invalid={!!errorMessage}>
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>

      <InputOTP
        aria-invalid={!!errorMessage}
        aria-label={label}
        autoComplete="one-time-code"
        autoFocus={autoFocus}
        containerClassName="w-full justify-center"
        disabled={disabled}
        id={inputId}
        inputMode="numeric"
        maxLength={length}
        name={name}
        pasteTransformer={normalizeCode}
        pattern={REGEXP_ONLY_DIGITS}
        value={value}
        onChange={(next) => onChange(normalizeCode(next))}
        // `input-otp` types this callback as `(...args: any[]) => unknown`,
        // so the code has to be named as a string to stay type-safe here.
        onComplete={(completedCode: string) =>
          onComplete?.(normalizeCode(completedCode))
        }
      >
        <InputOTPGroup>
          {Array.from({ length }, (_, slotIndex) => (
            <InputOTPSlot
              index={slotIndex}
              key={`otp-slot-${String(slotIndex + 1)}`}
            />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <FieldError>{errorMessage}</FieldError>
    </Field>
  );
}
