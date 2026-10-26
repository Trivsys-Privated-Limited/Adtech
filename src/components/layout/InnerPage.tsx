import type { ReactNode } from "react";

/**
 * Wrapper for inner pages. Each page opens with a section whose own top
 * padding (`section-y`) mostly clears the 4.5rem fixed header; this adds the
 * remaining offset on smaller screens, where that padding is at its minimum.
 */
export function InnerPage({ children }: { children: ReactNode }) {
  return <div className="pt-8 lg:pt-0">{children}</div>;
}
