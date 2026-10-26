"use client";

import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useRef, useState, type KeyboardEvent } from "react";
import type { ProcessStep } from "@/content/company";
import { cx } from "@/lib/cx";

/**
 * Accessible tabs (WAI-ARIA tabs pattern with automatic activation:
 * arrow keys move focus and select) presenting the delivery process.
 */
export function ProcessExplorer({ steps }: { steps: ProcessStep[] }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduceMotion = useReducedMotion();
  const step = steps[active];
  const progress = steps.length > 1 ? active / (steps.length - 1) : 1;

  const select = (index: number) => {
    const next = (index + steps.length) % steps.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => select(active + 1),
      ArrowDown: () => select(active + 1),
      ArrowLeft: () => select(active - 1),
      ArrowUp: () => select(active - 1),
      Home: () => select(0),
      End: () => select(steps.length - 1),
    };
    const action = keys[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
      <div className="relative lg:self-start">
        {/* Progress rail */}
        <div aria-hidden="true" className="absolute bottom-6 left-[1.1875rem] top-6 w-px bg-line">
          <div
            className="w-full origin-top bg-red-500 transition-transform duration-500 ease-out"
            style={{ height: "100%", transform: `scaleY(${progress})` }}
          />
        </div>

        <div role="tablist" aria-label="Delivery process" aria-orientation="vertical" className="relative flex flex-col">
          {steps.map((item, index) => {
            const selected = index === active;
            const done = index < active;
            return (
              <button
                key={item.title}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                id={`process-tab-${index}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls="process-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={onKeyDown}
                className={cx(
                  "group flex items-center gap-5 rounded-md py-3 pr-4 text-left transition-colors duration-200",
                  selected ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                <span
                  className={cx(
                    "relative z-10 grid size-10 shrink-0 place-items-center rounded-full border font-mono text-xs transition-colors duration-300",
                    selected && "border-red-500 bg-red-600 text-white",
                    done && "border-red-500/50 bg-ink-900 text-red-400",
                    !selected && !done && "border-line-strong bg-ink-900 text-subtle group-hover:border-blue-300/60",
                  )}
                >
                  {done ? <Check className="size-4" aria-hidden="true" /> : String(index + 1).padStart(2, "0")}
                  {done ? <span className="sr-only">Step {index + 1}</span> : null}
                </span>
                <span className="text-lg font-medium tracking-tight sm:text-xl">{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        id="process-panel"
        role="tabpanel"
        aria-labelledby={`process-tab-${active}`}
        tabIndex={0}
        className="relative min-h-[22rem] overflow-hidden rounded-lg border border-line bg-ink-800/70 p-6 shadow-card sm:p-10"
      >
        {/* Content swaps instantly; only the entrance animates, so fast key presses never lag. */}
        <motion.div
          key={active}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow">
            Step {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
          </p>
          <h3 className="mt-4 text-heading font-semibold text-fg">{step.title}</h3>
          <p className="mt-5 text-lead text-pretty text-muted">{step.summary}</p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {step.activities.map((activity) => (
              <li key={activity} className="rounded-md border border-line bg-ink-950/50 px-4 py-3 text-sm text-fg/90">
                {activity}
              </li>
            ))}
          </ul>

          <p className="mt-8 flex items-start gap-3 border-t border-line pt-6 text-[0.9375rem] text-fg">
            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rotate-45 bg-red-500" />
            <span>
              <span className="text-muted">Outcome: </span>
              {step.outcome}
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
