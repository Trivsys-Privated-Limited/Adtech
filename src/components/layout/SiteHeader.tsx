"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Logo";
import { isActiveRoute, mainNav } from "@/content/navigation";
import { cx } from "@/lib/cx";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Background transition once the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Mobile menu: lock scroll, close on Escape, keep focus inside, close on desktop resize.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close(true);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current || !toggleRef.current) return;
      const focusables = [toggleRef.current, ...panelRef.current.querySelectorAll<HTMLElement>("a")];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onDesktop = () => desktop.matches && close();

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open, close]);

  const isActive = (href: string) => isActiveRoute(pathname, href);

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "border-line bg-ink-950/85 backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50"
      >
        Skip to content
      </a>

      <div className="container-site flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" aria-label="Adtech — home" className="shrink-0 rounded-md">
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cx(
                    "relative rounded-md px-3.5 py-2 text-sm transition-colors duration-200",
                    isActive(item.href) ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cx(
                      "absolute inset-x-3.5 -bottom-px h-px origin-left bg-red-500 transition-transform duration-300 ease-out",
                      isActive(item.href) ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Wrapper owns visibility so it doesn't fight the button's own display class */}
          <div className="hidden sm:block">
            <ButtonLink href="/contact" icon={<ArrowRight className="size-4" />}>
              Let&apos;s Talk
            </ButtonLink>
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-11 items-center justify-center rounded-md border border-line text-fg transition-colors hover:border-line-strong hover:bg-white/5 lg:hidden"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={panelRef}
            id="mobile-menu"
            key="mobile-menu"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-line bg-ink-950 lg:hidden"
          >
            <nav aria-label="Mobile" className="container-site flex min-h-full flex-col py-6">
              <ul className="flex flex-col">
                {mainNav.map((item, i) => (
                  <li key={item.href} className="border-b border-line">
                    <Link
                      href={item.href}
                      onClick={() => close()}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className="flex items-center justify-between py-4 text-2xl font-medium tracking-tight text-fg"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="font-mono text-xs text-subtle">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {item.label}
                      </span>
                      {isActive(item.href) ? (
                        <span aria-hidden="true" className="size-2 rounded-full bg-red-500" />
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-10">
                <ButtonLink
                  href="/contact"
                  size="lg"
                  onClick={() => close()}
                  className="w-full"
                  icon={<ArrowRight className="size-4" />}
                >
                  Let&apos;s Talk
                </ButtonLink>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
