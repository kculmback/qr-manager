/**
 * `BetterFetchError.error` is `any` upstream, so every read off it is an
 * unchecked one. This names the part of the body the UI actually renders -
 * the server's error code and its human-readable message - so the call sites
 * stay type-checked instead of silently accepting whatever came back.
 */
export interface AuthErrorBody {
  code?: string;
  message?: string;
}

/** A `BetterFetchError` narrowed to the fields read when reporting failures. */
export interface AuthFetchError extends Error {
  error?: AuthErrorBody;
}

/** Reads a fetch error under {@link AuthFetchError} without asserting shape. */
export function asAuthError(error: unknown): AuthFetchError {
  return error as AuthFetchError;
}
