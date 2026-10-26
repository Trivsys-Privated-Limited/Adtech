import { ArrowDownRight, ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { HeroVisual } from "@/components/hero/HeroVisual";
import { ButtonLink } from "@/components/ui/Button";

const delay = (n: number) => ({ "--enter-delay": n }) as CSSProperties;

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-[4.5rem]">
      {/* Engineering grid, faded toward the edges */}
      <div
        aria-hidden="true"
        className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_60%_40%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-ink-950"
      />

      <div className="container-site grid items-center gap-y-6 pb-16 pt-12 sm:pt-16 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-[1.08fr_0.92fr] lg:gap-x-10 lg:pb-24 lg:pt-8">
        <div className="relative z-10">
          <p className="hero-enter eyebrow inline-flex items-center gap-2.5" style={delay(0)}>
            <span aria-hidden="true" className="size-1.5 rounded-full bg-red-500" />
            Software development &amp; technology solutions
          </p>

          <h1
            id="hero-title"
            className="hero-enter mt-6 max-w-[20ch] text-display font-semibold text-balance text-fg"
            style={delay(1)}
          >
            Engineering Digital Experiences That Move Business Forward
            <span className="text-red-500">.</span>
          </h1>

          <p className="hero-enter mt-6 max-w-xl text-lead text-pretty text-muted" style={delay(2)}>
            Adtech builds intelligent software, modern digital platforms, and scalable technology
            solutions that help ambitious businesses innovate and grow.
          </p>

          <div
            className="hero-enter mt-9 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap"
            style={delay(3)}
          >
            <ButtonLink href="/#contact" size="lg" icon={<ArrowRight className="size-4" />}>
              Let&apos;s Build Something
            </ButtonLink>
            <ButtonLink
              href="/#work"
              size="lg"
              variant="secondary"
              icon={<ArrowDownRight className="size-4" />}
            >
              Explore Our Work
            </ButtonLink>
          </div>
        </div>

        <div
          className="hero-enter relative mx-auto aspect-square w-full max-w-[22rem] sm:max-w-[30rem] lg:max-w-none"
          style={delay(2)}
        >
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
