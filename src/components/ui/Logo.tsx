import { cx } from "@/lib/cx";

/**
 * Adtech brand mark: an "A" formed by two converging strokes, with a red
 * node at the apex — echoing the connected-systems motif of the hero.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className ?? "size-8"}>
      <rect x="0.5" y="0.5" width="31" height="31" rx="8" fill="#101F39" stroke="rgb(148 163 184 / 0.28)" />
      <path d="M9 24 15.2 9.5M23 24 16.8 9.5" stroke="#F8FAFC" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M11.6 19h8.8" stroke="#315EAA" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="16" cy="8.6" r="2.6" fill="#F04452" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="text-[1.0625rem] font-semibold tracking-[-0.02em] text-fg">
        Adtech<span className="text-red-500">.</span>
      </span>
    </span>
  );
}
