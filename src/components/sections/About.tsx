import type { CSSProperties } from "react";
import { LogoMark } from "@/components/ui/Logo";
import { Eyebrow, type SectionProps } from "@/components/ui/SectionHeading";
import { about } from "@/content/company";

export function About({ index, titleAs: Title = "h2" }: SectionProps) {
  return (
    <section id="about" aria-labelledby="about-title" className="section-y relative overflow-hidden border-t border-line">
      {/* Oversized brand mark as a quiet backdrop */}
      <LogoMark className="pointer-events-none absolute -right-24 top-1/2 size-[28rem] -translate-y-1/2 opacity-[0.04]" />

      <div className="container-site relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div data-reveal>
          <Eyebrow index={index}>About Adtech</Eyebrow>
          <Title id="about-title" className="mt-5 text-heading font-semibold text-balance text-fg">
            {about.heading}
          </Title>
        </div>

        <div data-reveal style={{ "--reveal-delay": 1 } as CSSProperties}>
          <div className="space-y-5 text-lead text-pretty text-muted">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <dl className="mt-10 grid gap-6 sm:grid-cols-3">
            {about.pillars.map((pillar) => (
              <div key={pillar.label} className="border-t border-red-500/60 pt-4">
                <dt className="font-semibold text-fg">{pillar.label}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted">{pillar.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
