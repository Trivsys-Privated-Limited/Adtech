import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { ProjectPreview } from "@/components/work/ProjectPreview";
import { siteConfig } from "@/config/site";
import { caseStudies, getCaseStudy } from "@/content/work";

// Case studies are fully static: only the slugs below are exported, and any
// other slug falls through to the 404 page.
export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const title = study.isConcept ? `${study.title} (concept)` : study.title;
  return {
    title,
    description: study.overview,
    alternates: siteConfig.url ? { canonical: `/work/${study.slug}` } : undefined,
    openGraph: { title, description: study.overview, url: `/work/${study.slug}` },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const index = caseStudies.indexOf(study);
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <article className="pt-[4.5rem]">
      <header className="container-site pt-12 sm:pt-16">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 rounded-md text-sm text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          All work
        </Link>

        <p className="eyebrow mt-10">{study.category}</p>
        <h1 className="mt-4 max-w-4xl text-display font-semibold text-balance text-fg">
          {study.title}
          <span className="text-red-500">.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lead text-pretty text-muted">{study.overview}</p>

        {study.isConcept ? (
          <p className="mt-8 flex max-w-2xl items-start gap-3 rounded-md border border-line-strong bg-ink-800/70 p-4 text-sm leading-relaxed text-muted">
            <Info className="mt-0.5 size-4 shrink-0 text-blue-300" aria-hidden="true" />
            <span>
              <strong className="font-medium text-fg">Concept project.</strong> This is an
              illustrative demonstration of our approach, not a client engagement. It contains no
              client data or reported results.
            </span>
          </p>
        ) : null}

        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Technologies">
          {study.tags.map((tag) => (
            <li key={tag} className="rounded-sm border border-line px-2.5 py-1 font-mono text-xs text-muted">
              {tag}
            </li>
          ))}
        </ul>
      </header>

      <div className="container-site mt-12">
        <ProjectPreview variant={study.preview} className="aspect-[16/9] rounded-lg sm:aspect-[21/9]" />
      </div>

      <div className="container-site grid gap-14 py-20 lg:grid-cols-3 lg:gap-12 lg:py-28">
        <section aria-labelledby="challenge-title">
          <h2 id="challenge-title" className="eyebrow text-red-400">
            The challenge
          </h2>
          <p className="mt-5 leading-relaxed text-fg/90">{study.challenge}</p>
        </section>
        <section aria-labelledby="approach-title">
          <h2 id="approach-title" className="eyebrow text-red-400">
            Our approach
          </h2>
          <ol className="mt-5 space-y-4">
            {study.approach.map((item, i) => (
              <li key={item} className="flex gap-4 leading-relaxed text-fg/90">
                <span className="font-mono text-sm text-subtle">{String(i + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ol>
        </section>
        <section aria-labelledby="architecture-title">
          <h2 id="architecture-title" className="eyebrow text-red-400">
            Architecture
          </h2>
          <ul className="mt-5 space-y-4">
            {study.architecture.map((item) => (
              <li key={item} className="flex gap-3 leading-relaxed text-fg/90">
                <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-red-500" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <footer className="border-t border-line">
        <div className="container-site flex flex-col gap-8 py-14 sm:flex-row sm:items-center sm:justify-between">
          <Link href={`/work/${next.slug}`} className="group rounded-md">
            <span className="eyebrow">Next project</span>
            <span className="mt-2 flex items-center gap-2 text-title font-semibold text-fg transition-colors group-hover:text-red-400">
              {next.title}
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>
          <ButtonLink href="/contact" size="lg" icon={<ArrowRight className="size-4" />}>
            Start a similar project
          </ButtonLink>
        </div>
      </footer>
    </article>
  );
}
