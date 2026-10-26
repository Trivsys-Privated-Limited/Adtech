"use client";

import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { HeroFallback } from "@/components/hero/HeroFallback";
import { cx } from "@/lib/cx";

// Three.js only runs in the browser and is kept out of the initial bundle.
const HeroScene = dynamic(() => import("@/components/hero/HeroScene"), { ssr: false });

let webglSupport: boolean | undefined;
function detectWebGL(): boolean {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

const noopSubscribe = () => () => {};

function subscribeFinePointer(callback: () => void) {
  const query = window.matchMedia("(hover: hover) and (pointer: fine)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const reducedMotion = useReducedMotion() ?? false;
  const webgl = useSyncExternalStore(noopSubscribe, detectWebGL, () => false);
  const finePointer = useSyncExternalStore(
    subscribeFinePointer,
    () => window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    () => false,
  );

  // Pause rendering while the hero is scrolled out of view.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} aria-hidden="true" className="relative size-full">
      {/* Restrained brand glows behind the object */}
      <div className="pointer-events-none absolute inset-[12%] rounded-full bg-blue-500/25 blur-[80px]" />
      <div className="pointer-events-none absolute right-[14%] top-[18%] size-[38%] rounded-full bg-red-500/15 blur-[70px]" />

      <HeroFallback
        className={cx(
          "absolute inset-0 p-[6%] transition-opacity duration-700",
          ready ? "opacity-0" : "opacity-100",
        )}
      />

      {webgl ? (
        <div
          className={cx(
            "absolute inset-0 transition-opacity duration-1000 ease-out",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          <HeroScene
            active={inView}
            reducedMotion={reducedMotion}
            interactive={finePointer}
            onReady={() => setReady(true)}
          />
        </div>
      ) : null}
    </div>
  );
}
