import { env } from "~/env";

export function getBackendUrl() {
  if (typeof window !== "undefined") {
    // Same-origin by default: the deployment is expected to proxy `/api/*` to
    // the backend, which keeps a prebuilt bundle portable across domains.
    return env.VITE_BACKEND_URL ?? window.location.origin;
  }
  return env.BACKEND_URL;
}
