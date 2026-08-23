import type { SyntheticEvent } from "react";
import { useCallback, useMemo, useState } from "react";

export type FieldErrorMap = Partial<Record<string, string>>;

/** Any form control that reports native validity. */
type ValidatableElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

export interface FieldErrors {
  errors: FieldErrorMap;
  setError: (name: string, message: string) => void;
  clearError: (name: string) => void;
  replaceErrors: (next: FieldErrorMap) => void;
  reset: () => void;
  /** Wiring every control needs: identity, validity state, and error lifecycle. */
  fieldProps: (name: string) => {
    id: string;
    name: string;
    "aria-invalid": boolean;
    onChange: () => void;
    onInvalid: (event: SyntheticEvent<ValidatableElement>) => void;
  };
}

/**
 * Per-field error state for the uncontrolled forms this app uses.
 *
 * The browser does the validating -- `required`, `type="url"`, `maxLength` --
 * and `onInvalid` catches the message it produced rather than duplicating those
 * rules in JavaScript. Zod errors from the server land in the same map, so both
 * kinds of failure render identically.
 */
export function useFieldErrors(): FieldErrors {
  const [errors, setErrors] = useState<FieldErrorMap>({});

  const setError = useCallback((name: string, message: string) => {
    setErrors((previous) => ({ ...previous, [name]: message }));
  }, []);

  const clearError = useCallback((name: string) => {
    setErrors((previous) =>
      previous[name] === undefined
        ? previous
        : { ...previous, [name]: undefined },
    );
  }, []);

  const reset = useCallback(() => setErrors({}), []);

  const fieldProps = useCallback(
    (name: string) => ({
      id: name,
      name,
      "aria-invalid": !!errors[name],
      onChange: () => clearError(name),
      onInvalid: (event: SyntheticEvent<ValidatableElement>) => {
        // Suppress the browser's own bubble; the message renders in FieldError.
        event.preventDefault();
        setError(name, event.currentTarget.validationMessage);
      },
    }),
    [errors, clearError, setError],
  );

  return useMemo(
    () => ({
      errors,
      setError,
      clearError,
      replaceErrors: setErrors,
      reset,
      fieldProps,
    }),
    [errors, setError, clearError, reset, fieldProps],
  );
}
