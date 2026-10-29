import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { SectionHeading, type SectionProps } from "@/components/ui/SectionHeading";
import { ProjectPreview } from "@/components/work/ProjectPreview";
import { caseStudies, type CaseStudy } from "@/content/work";
import { cx } from "@/lib/cx";

function ConceptBadge() {
  return (
    <span className="rounded-sm border border-line-strong bg-ink-950/80 px-2 py-1 font-mono text-[0.6875rem] uppercase tracking-wider text-muted backdrop-blur">
      Concept project
    </span>
  );
}

function ProjectCard({ study, featured, index }: { study: CaseStudy; featured?: boolean; index: number }) {
  return (
    <article
      data-reveal
      suppressHydrationWarning
      style={{ "--reveal-delay": index } as CSSProperties}
      className={cx(
        "group relative rounded-lg border border-line bg-ink-800/50 p-3 transition-colors duration-300 hover:border-line-strong sm:p-4",
        featured && "lg:col-span-2 lg:grid lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-4",
      )}
    >
      <div className="relative">
        <ProjectPreview variant={study.preview} className={featured ? "aspect-[16/10]" : "aspect-[16/11]"} />
        {study.isConcept ? (
          <div className="absolute left-3 top-3">
            <ConceptBadge />
          </div>
        ) : null}
      </div>

      <div className={cx("px-2 pb-3 pt-6 sm:px-3", featured && "lg:px-8 lg:py-6")}>
        <p className="eyebrow">{study.category}</p>
        <h3 className={cx("mt-3 font-semibold tracking-tight text-fg", featured ? "text-heading" : "text-title")}>
          {/* Stretched link: the whole card is clickable, with one accessible link */}
          <Link
            href={`/work/${study.slug}`}
            className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-red-500"
          >
            {study.title}
          </Link>
        </h3>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{study.overview}</p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
          {study.tags.map((tag) => (
            <li key={tag} className="rounded-sm border border-line px-2 py-1 font-mono text-xs text-muted">
              {tag}
            </li>
          ))}
        </ul>
        <p className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-fg transition-colors group-hover:text-red-400" aria-hidden="true">
          View project details
          <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </p>
      </div>
    </article>
  );
}

export function FeaturedWork({ index, titleAs }: SectionProps) {
  const [featured, ...rest] = caseStudies;

  return (
    <section id="work" aria-labelledby="work-title" className="section-y border-t border-line bg-ink-900/40">
      <div className="container-site">
        <SectionHeading
          id="work-title"
          index={index}
          as={titleAs}
          eyebrow="Featured work"
          title="The kind of products we build."
          description="The projects below are illustrative concepts that show our approach to real-world problems. They are not client engagements, and we'll replace them with published case studies."
        />

        <div className="mt-14 grid gap-5 lg:mt-16 lg:grid-cols-2">
          <ProjectCard study={featured} featured index={0} />
          {rest.map((study, i) => (
            <ProjectCard key={study.slug} study={study} index={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
