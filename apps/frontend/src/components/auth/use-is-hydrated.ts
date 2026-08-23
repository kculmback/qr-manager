"use client";

import { useSyncExternalStore } from "react";

/**
 * Returns `true` once the component is mounted on the client (hydrated) and
 * `false` while rendering on the server, so client-only reads (e.g.
 * `sessionStorage`) stay safe during SSR.
 *
 * @returns Whether the component has hydrated on the client.
 */
export function useIsHydrated() {
  // The store never changes, so the subscription has nothing to tear down.
  const subscribe = () => () => {
    // no-op
  };
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
