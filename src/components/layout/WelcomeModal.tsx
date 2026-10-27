"use client";

import { ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { welcomeModalConfig } from "@/config/site";

const DAY_MS = 24 * 60 * 60 * 1000;

function isExcluded(pathname: string) {
  return welcomeModalConfig.excludedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

/**
 * First-visit welcome message, built on the native <dialog> element: showModal()
 * provides dialog semantics, contains focus, makes the page inert, closes on
 * Escape and restores focus afterwards.
 *
 * It is decided once, when the site first loads (not on route changes), and
 * stays closed if storage is unavailable, so it can never block the page or
 * reappear on every visit. See `welcomeModalConfig` for the frequency policy.
 */
export function WelcomeModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!welcomeModalConfig.enabled || !dialog || typeof dialog.showModal !== "function") return;
    if (isExcluded(window.location.pathname)) return;

    const { storageKey, cooldownDays, delayMs } = welcomeModalConfig;
    try {
      const lastSeen = Number(window.localStorage.getItem(storageKey) ?? 0);
      if (Date.now() - lastSeen < cooldownDays * DAY_MS) return;
    } catch {
      return;
    }

    const timer = window.setTimeout(() => {
      // The visitor may have navigated to an excluded route in the meantime.
      if (isExcluded(window.location.pathname)) return;
      // Never interrupt someone typing into a form, or another open overlay
      // (the mobile menu locks body scroll while open).
      const active = document.activeElement;
      if (active instanceof HTMLElement && active.matches("input, textarea, select, [contenteditable='true']")) return;
      if (document.body.style.overflow === "hidden") return;

      try {
        window.localStorage.setItem(storageKey, String(Date.now()));
      } catch {
        return;
      }
      dialog.showModal();
    }, delayMs);
    return () => window.clearTimeout(timer);
  }, []);

  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="welcome-title"
      aria-describedby="welcome-description"
      // A click on the backdrop lands on the <dialog> itself, outside the panel.
      onClick={(event) => event.target === event.currentTarget && close()}
      className="welcome-dialog m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-visible bg-transparent p-0 text-fg backdrop:bg-ink-950/75 backdrop:backdrop-blur-sm"
    >
      <div className="relative isolate overflow-hidden rounded-lg border border-line-strong bg-ink-900 p-6 shadow-card sm:p-9">
        <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 size-64 rounded-full bg-red-500/15 blur-[90px]" />
        <div aria-hidden="true" className="absolute -bottom-28 -left-20 -z-10 size-72 rounded-full bg-blue-500/20 blur-[100px]" />
        <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_100%_0%,black,transparent)]" />

        <button
          type="button"
          onClick={close}
          aria-label="Close welcome message"
          className="absolute right-3 top-3 grid size-10 place-items-center rounded-md text-muted transition-colors hover:bg-white/[0.06] hover:text-fg"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <p className="eyebrow flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-8 bg-red-500" />
          Welcome to Adtech
        </p>
        <h2 id="welcome-title" className="mt-5 pr-8 text-heading font-semibold text-balance text-fg">
          Software engineered for what&apos;s next<span className="text-red-500">.</span>
        </h2>
        <p id="welcome-description" className="mt-4 leading-relaxed text-pretty text-muted">
          We design and build web platforms, mobile apps, AI-powered automation and cloud
          infrastructure for ambitious businesses. See how we can help.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/services" onClick={close} className={buttonClasses("primary", "lg", "w-full sm:w-auto")}>
            Explore our services
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <button type="button" onClick={close} className={buttonClasses("ghost", "lg", "w-full sm:w-auto")}>
            Maybe later
          </button>
        </div>
      </div>
    </dialog>
  );
}
