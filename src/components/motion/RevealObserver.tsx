"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Adds `is-revealed` to `[data-reveal]` elements as they enter the viewport.
 * The hidden state only applies once `html.js` is set (see globals.css), so
 * content is visible without JavaScript and under reduced motion.
 *
 * This can run before a streamed page segment has hydrated, so an element may
 * gain `is-revealed` while React still expects the server className. Every
 * `[data-reveal]` element therefore sets `suppressHydrationWarning`: the extra
 * class is intentional and React leaves it in place.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");

    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
