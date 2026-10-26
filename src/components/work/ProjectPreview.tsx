import type { ReactNode } from "react";
import type { PreviewVariant } from "@/content/work";
import { cx } from "@/lib/cx";

/**
 * Lightweight, code-drawn interface previews for concept projects — no
 * image downloads, crisp at any size. Replace with real screenshots
 * (via next/image) when actual case studies are available.
 */
export function ProjectPreview({ variant, className }: { variant: PreviewVariant; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        "relative overflow-hidden rounded-md border border-line bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950",
        className,
      )}
    >
      <div className="bg-grid absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
        {variant === "dashboard" ? <DashboardMock /> : null}
        {variant === "pipeline" ? <PipelineMock /> : null}
        {variant === "mobile" ? <MobileMock /> : null}
      </div>
    </div>
  );
}

function WindowFrame({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-x-[6%] bottom-0 top-[10%] rounded-t-md border border-b-0 border-line-strong bg-ink-950/90 shadow-card">
      <div className="flex h-6 items-center gap-1.5 border-b border-line px-3">
        <span className="size-1.5 rounded-full bg-red-500/80" />
        <span className="size-1.5 rounded-full bg-white/20" />
        <span className="size-1.5 rounded-full bg-white/20" />
      </div>
      <div className="absolute inset-x-0 bottom-0 top-6">{children}</div>
    </div>
  );
}

function DashboardMock() {
  return (
    <WindowFrame>
      <div className="flex h-full">
        <div className="hidden w-[16%] flex-col gap-2 border-r border-line p-3 sm:flex">
          {[60, 80, 45, 70, 55].map((w, i) => (
            <span key={i} className={cx("h-1.5 rounded-full", i === 1 ? "bg-red-500/70" : "bg-white/10")} style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {["bg-blue-500/50", "bg-red-500/60", "bg-blue-300/40"].map((bar, i) => (
              <div key={i} className="rounded-sm border border-line bg-white/[0.03] p-2">
                <span className="block h-1 w-1/2 rounded-full bg-white/15" />
                <span className={cx("mt-2 block h-2 rounded-full", bar)} style={{ width: `${55 + i * 12}%` }} />
              </div>
            ))}
          </div>
          <div className="relative flex-1 rounded-sm border border-line bg-white/[0.02]">
            <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
              <path d="M0 78 C30 70 45 40 75 46 S120 72 150 52 S205 18 235 30 S280 22 300 12" fill="none" stroke="#F04452" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <path d="M0 88 C40 84 60 70 95 72 S160 80 190 66 S250 54 300 50" fill="none" stroke="#315EAA" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

function PipelineMock() {
  const stages = ["Ingest", "Classify", "Extract", "Review", "Export"];
  return (
    <WindowFrame>
      <div className="flex h-full flex-col justify-center gap-5 px-4 sm:px-6">
        <div className="flex items-center">
          {stages.map((stage, i) => (
            <div key={stage} className="flex flex-1 items-center last:flex-none">
              <span
                className={cx(
                  "rounded-sm border px-1.5 py-1 font-mono text-[0.5rem] uppercase tracking-wider sm:px-2 sm:text-[0.5625rem]",
                  i === 3 ? "border-red-500/60 bg-red-500/10 text-red-400" : "border-line-strong bg-ink-800 text-muted",
                )}
              >
                {stage}
              </span>
              {i < stages.length - 1 ? <span className="h-px flex-1 bg-gradient-to-r from-blue-500 to-blue-500/30" /> : null}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[1fr_1.4fr] gap-3">
          <div className="space-y-1.5 rounded-sm border border-line bg-white/[0.03] p-2.5">
            {[90, 70, 80, 50, 65].map((w, i) => (
              <span key={i} className="block h-1 rounded-full bg-white/12" style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="space-y-2 rounded-sm border border-line bg-white/[0.03] p-2.5">
            {[
              ["w-1/3", "bg-blue-300/50"],
              ["w-1/2", "bg-blue-300/50"],
              ["w-2/5", "bg-red-500/60"],
            ].map(([w, color], i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="h-1 w-1/4 rounded-full bg-white/12" />
                <span className={cx("h-1.5 rounded-full", w, color)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

function MobileMock() {
  return (
    <div className="absolute inset-0 flex items-end justify-center gap-[6%]">
      {[0, 1].map((phone) => (
        <div
          key={phone}
          className={cx(
            "relative w-[30%] rounded-t-[1.1rem] border border-b-0 border-line-strong bg-ink-950/90 p-2 shadow-card",
            phone === 0 ? "h-[82%]" : "hidden h-[68%] min-[420px]:block",
          )}
        >
          <span className="mx-auto block h-1 w-1/3 rounded-full bg-white/15" />
          {phone === 0 ? (
            <>
              <div className="mx-auto mt-4 grid size-[46%] place-items-center rounded-full border-[3px] border-blue-500/50 border-t-red-500">
                <span className="h-1.5 w-1/2 rounded-full bg-white/20" />
              </div>
              <div className="mt-4 space-y-1.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-1.5 rounded-sm border border-line bg-white/[0.03] p-1.5">
                    <span className={cx("size-2 shrink-0 rounded-full", i === 0 ? "bg-red-500/80" : "bg-blue-300/50")} />
                    <span className="h-1 flex-1 rounded-full bg-white/12" />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-4 space-y-1.5">
              {[70, 90, 60, 80, 50].map((w, i) => (
                <div key={i} className="rounded-sm border border-line bg-white/[0.03] p-1.5">
                  <span className="block h-1 rounded-full bg-white/12" style={{ width: `${w}%` }} />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
