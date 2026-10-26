import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { SectionHeading, type SectionProps } from "@/components/ui/SectionHeading";
import { services, type Service } from "@/content/services";
import { cx } from "@/lib/cx";

/** Zig-zag bento: wide, narrow / narrow, wide / narrow, wide on large screens. */
const WIDE = new Set([0, 3, 5]);

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon;
  const wide = WIDE.has(index);

  return (
    <article
      id={`service-${service.id}`}
      data-reveal
      style={{ "--reveal-delay": index % 3 } as CSSProperties}
      className={cx(
        "group relative flex flex-col overflow-hidden rounded-lg border border-line bg-ink-800/70 p-6 shadow-card sm:p-8",
        "transition-[border-color,background-color] duration-300 hover:border-line-strong hover:bg-ink-800",
        wide && "lg:col-span-2",
      )}
    >
      {/* Accent line that draws in on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-red-500 via-red-500/60 to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100"
      />

      {/* Oversized icon gives the wide cards a quiet focal point */}
      {wide ? (
        <Icon
          aria-hidden="true"
          strokeWidth={0.75}
          className="pointer-events-none absolute -bottom-10 right-6 hidden size-56 text-blue-300/[0.06] transition-colors duration-500 group-hover:text-red-500/[0.08] lg:block"
        />
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex size-12 items-center justify-center rounded-md border border-line bg-ink-950/60 text-blue-300 transition-colors duration-300 group-hover:border-red-500/40 group-hover:text-red-400">
          <Icon className="size-[1.375rem]" strokeWidth={1.6} aria-hidden="true" />
        </span>
        <span className="font-mono text-xs text-subtle">{String(index + 1).padStart(2, "0")}</span>
      </div>

      <div className={cx("mt-8 flex flex-1 flex-col", wide && "lg:grid lg:grid-cols-[1.2fr_1fr] lg:gap-10")}>
        <div>
          <h3 className="text-title font-semibold text-fg">{service.title}</h3>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{service.summary}</p>
        </div>

        <ul className={cx("mt-6 space-y-2.5", wide && "lg:mt-1")}>
          {service.highlights.map((highlight) => (
            <li key={highlight} className="flex items-center gap-3 text-sm text-fg/85">
              <span aria-hidden="true" className="h-px w-4 bg-red-500/70" />
              {highlight}
            </li>
          ))}
        </ul>
      </div>

      <Link
        href="/contact"
        className="mt-8 inline-flex items-center gap-2 self-start text-sm font-medium text-fg transition-colors hover:text-red-400"
      >
        Discuss your project
        <span className="sr-only"> about {service.title}</span>
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    </article>
  );
}

export function Services({ index, titleAs }: SectionProps) {
  return (
    <section id="services" aria-labelledby="services-title" className="section-y">
      <div className="container-site">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="services-title"
            index={index}
            as={titleAs}
            eyebrow="Services"
            title="End-to-end engineering for products that matter."
          />
          <p data-reveal className="max-w-md text-pretty text-muted lg:pb-2">
            From the first prototype to platforms serving at scale, we bring strategy, design and
            engineering together in one accountable team.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-5">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
