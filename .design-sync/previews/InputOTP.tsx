import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@qr-manager/ui";

export function Basic() {
  return (
    <InputOTP maxLength={6} defaultValue="482913">
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}

export function Grouped() {
  return (
    <div className="w-80">
      <Field>
        <FieldLabel htmlFor="otp-2fa">Verification code</FieldLabel>
        <InputOTP id="otp-2fa" maxLength={6} defaultValue="482913">
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <FieldDescription>
          From your authenticator app — expires in 30 seconds.
        </FieldDescription>
      </Field>
    </div>
  );
}

export function Partial() {
  return (
    <InputOTP maxLength={6} defaultValue="482">
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}

export function Invalid() {
  return (
    <div className="w-80">
      <Field data-invalid>
        <FieldLabel htmlFor="otp-invalid">Verification code</FieldLabel>
        <InputOTP
          id="otp-invalid"
          maxLength={6}
          defaultValue="112233"
          aria-invalid
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} aria-invalid />
            <InputOTPSlot index={1} aria-invalid />
            <InputOTPSlot index={2} aria-invalid />
            <InputOTPSlot index={3} aria-invalid />
            <InputOTPSlot index={4} aria-invalid />
            <InputOTPSlot index={5} aria-invalid />
          </InputOTPGroup>
        </InputOTP>
        <FieldError>That code has expired — request a new one.</FieldError>
      </Field>
    </div>
  );
}

export function Disabled() {
  return (
    <InputOTP maxLength={6} defaultValue="482913" disabled>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}
