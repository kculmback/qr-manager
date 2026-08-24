import { useCallback, useId, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import type { CodeStyle } from "@qr-manager/validators";
import { Button } from "@qr-manager/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@qr-manager/ui/components/field";
import { Input } from "@qr-manager/ui/components/input";
import { Slider } from "@qr-manager/ui/components/slider";
import {
  describeContrastProblem,
  MAX_LOGO_SCALE,
  MIN_LOGO_SCALE,
} from "@qr-manager/validators";

import type { FieldErrors } from "~/lib/use-field-errors";
import { readLogoFile } from "./logo-file";
import { qrArtProps } from "./qr-art";

/** The artwork half of the form, as one value the parent owns. */
export interface Appearance {
  style: CodeStyle;
  logo: string | null;
}

/**
 * What the file picker offers.
 *
 * Wider than what gets stored -- SVG is a perfectly ordinary way to have a logo
 * on hand, and `readLogoFile` rasterises everything anyway, so the format that
 * reaches the row is a PNG either way. The picker is a convenience, not the
 * check: `codeLogoSchema` is what the server enforces.
 */
const ACCEPTED_FILES = "image/png,image/jpeg,image/webp,image/svg+xml";

const HEX = /^#[0-9a-f]{6}$/i;

/** Sample the preview encodes -- long enough to be a realistic module count. */
const PREVIEW_VALUE = "https://example.com/r/abcd1234";

const SCALE_STEP = 0.01;

/**
 * A colour, picked either from the OS colour wheel or typed as hex.
 *
 * Two controls over one value because neither alone is enough: the swatch
 * cannot be typed into and cannot be pasted a brand colour, and a bare text
 * field makes people guess at hex. The text input holds its own draft so a
 * half-typed `#1f2` does not get pushed up as an invalid value.
 */
function ColorField({
  label,
  value,
  onChange,
  disabled,
  invalid,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  /** Set when the *pair* will not scan; the message lives below both fields. */
  invalid?: boolean;
}) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);

  const commit = useCallback(
    (next: string) => {
      setDraft(next);
      if (HEX.test(next.trim())) onChange(next.trim().toLowerCase());
    },
    [onChange],
  );

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} colour picker`}
          className="size-9 shrink-0 cursor-pointer rounded-3xl border border-transparent bg-transparent p-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          value={value}
          onChange={(event) => {
            setDraft(null);
            onChange(event.currentTarget.value.toLowerCase());
          }}
          disabled={disabled}
        />
        <Input
          id={id}
          className="font-mono uppercase"
          value={draft ?? value}
          onChange={(event) => commit(event.currentTarget.value)}
          onBlur={() => setDraft(null)}
          spellCheck={false}
          maxLength={7}
          aria-invalid={invalid}
          disabled={disabled}
        />
      </div>
    </Field>
  );
}

export function AppearanceFields({
  value,
  onChange,
  disabled,
  errors,
}: {
  value: Appearance;
  onChange: (next: Appearance) => void;
  disabled?: boolean;
  errors: FieldErrors;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const { style, logo } = value;

  const setStyle = useCallback(
    (patch: Partial<CodeStyle>) =>
      onChange({ ...value, style: { ...value.style, ...patch } }),
    [onChange, value],
  );

  const pickLogo = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      setLogoError(null);

      try {
        onChange({ ...value, logo: await readLogoFile(file) });
      } catch (error) {
        setLogoError(
          error instanceof Error
            ? error.message
            : "That image could not be read.",
        );
      }
    },
    [onChange, value],
  );

  // Live rather than only on submit: colours are chosen by looking at them, and
  // finding out they are unscannable after pressing Save is too late to be
  // useful. Same function the schema runs, so this cannot drift from it.
  const contrastProblem = describeContrastProblem(style);

  return (
    <>
      <div className="flex flex-wrap items-start gap-6">
        <div
          className="rounded-2xl p-2"
          style={{ backgroundColor: style.background }}
        >
          <QRCodeSVG
            value={PREVIEW_VALUE}
            size={96}
            title="Preview of the code's colours and logo"
            {...qrArtProps({ style, logo, size: 96 })}
          />
        </div>

        <div className="grid min-w-56 flex-1 gap-4 sm:grid-cols-2">
          <ColorField
            label="Code"
            value={style.foreground}
            onChange={(foreground) => setStyle({ foreground })}
            disabled={disabled}
            invalid={!!contrastProblem}
          />
          <ColorField
            label="Background"
            value={style.background}
            onChange={(background) => setStyle({ background })}
            disabled={disabled}
            invalid={!!contrastProblem}
          />
        </div>
      </div>

      {contrastProblem ? (
        <FieldError>{contrastProblem}</FieldError>
      ) : (
        <FieldDescription>
          A dark code on a light background scans most reliably. The preview is
          a sample &mdash; your code&rsquo;s own pattern will differ.
        </FieldDescription>
      )}

      <Field>
        <FieldLabel htmlFor="logo">Logo</FieldLabel>
        <div className="flex items-center gap-3">
          {logo && (
            <img
              src={logo}
              alt="The logo drawn in the middle of the code"
              className="bg-muted size-12 shrink-0 rounded-2xl object-contain p-1"
            />
          )}

          <input
            ref={fileInput}
            id="logo"
            type="file"
            accept={ACCEPTED_FILES}
            className="sr-only"
            disabled={disabled}
            onChange={(event) => {
              void pickLogo(event.currentTarget.files?.[0]);
              // Cleared so picking the same file twice still fires a change.
              event.currentTarget.value = "";
            }}
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => fileInput.current?.click()}
          >
            <ImagePlus />
            {logo ? "Replace" : "Add a logo"}
          </Button>

          {logo && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={() => {
                setLogoError(null);
                onChange({ ...value, logo: null });
              }}
            >
              <X />
              Remove
            </Button>
          )}
        </div>
        <FieldDescription>
          A logo replaces the modules underneath it, so the code is encoded with
          stronger error correction to make up for what it covers. Images are
          resized and re-saved as a square PNG.
        </FieldDescription>
        <FieldError>{logoError}</FieldError>
      </Field>

      {logo && (
        <Field>
          {/* No `htmlFor`: Base UI's slider is a composite, not one labelable
              control, so a `for` here would point at nothing. */}
          <FieldLabel>
            Logo size &mdash; {Math.round(style.logoScale * 100)}%
          </FieldLabel>
          <Slider
            className="py-2"
            aria-label="Logo size"
            min={MIN_LOGO_SCALE}
            max={MAX_LOGO_SCALE}
            step={SCALE_STEP}
            // An array even though there is one thumb: the wrapper counts its
            // thumbs off this prop and reads a bare number as "no thumbs given".
            value={[style.logoScale]}
            // `typeof` rather than `Array.isArray`, which widens a readonly
            // array to `any[]` and takes the element type with it.
            onValueChange={(next: number | readonly number[]) =>
              setStyle({
                logoScale:
                  typeof next === "number"
                    ? next
                    : (next[0] ?? style.logoScale),
              })
            }
            disabled={disabled}
          />
          <FieldDescription>
            Share of the code's width. Bigger covers more of the grid, and every
            scanner has a point past which it gives up &mdash; test a print
            before ordering a thousand of them.
          </FieldDescription>
          <FieldError>{errors.errors.logoScale}</FieldError>
        </Field>
      )}
    </>
  );
}
