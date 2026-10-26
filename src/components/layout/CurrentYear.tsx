"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Renders the current year on the client. Reading the clock during
 * prerendering is disallowed with Cache Components, so the server snapshot
 * is empty and the year appears on hydration without a mismatch.
 */
export function CurrentYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => null,
  );
  return <>{year}</>;
}
