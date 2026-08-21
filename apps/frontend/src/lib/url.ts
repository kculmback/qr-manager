import { env } from "~/env";

export function getBackendUrl() {
  if (typeof window !== "undefined") {
    return env.VITE_BACKEND_URL;
  }
  return env.BACKEND_URL;
}
