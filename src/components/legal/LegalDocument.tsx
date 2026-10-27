import { FileWarning, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { InnerPage } from "@/components/layout/InnerPage";
import { ContactEmail } from "@/components/ui/ContactEmail";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";
import type { LegalBlock, LegalDoc } from "@/content/legal";

const TOKEN = /(\{\{TODO:[^}]*\}\}|\[[^\]]+\]\([^)\s]+\))/g;

/** Renders the inline markup described in src/content/legal.ts. */
function Inline({ text }: { text: string }) {
  return text.split(TOKEN).map((part, i) => {
    const todo = part.match(/^\{\{TODO:\s*([^}]*)\}\}$/);
    if (todo) {
      return (
        <span
          key={i}
          data-todo
          className="mx-0.5 inline rounded-sm border border-dashed border-red-500/50 bg-red-500/10 px-1.5 py-0.5 text-[0.875em] text-fg [box-decoration-break:clone]"
        >
          <span className="font-mono text-[0.75em] uppercase tracking-wider text-red-400">To confirm:</span>{" "}
          {todo[1]}
        </span>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      return (
        <Link key={i} href={link[2]} className="text-fg underline underline-offset-4 hover:text-red-400">
          {link[1]}
        </Link>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function Block({ block }: { block: LegalBlock }): ReactNode {
  if (typeof block === "string") {
    return (
      <p>
        <Inline text={block} />
      </p>
    );
  }
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-red-500">
      {block.list.map((item) => (
        <li key={item}>
          <Inline text={item} />
        </li>
      ))}
    </ul>
  );
}

/** True while any "{{TODO: ...}}" detail in the document is still unfilled. */
function hasTodos(doc: LegalDoc) {
  const texts = [doc.lastUpdated, ...doc.sections.flatMap((s) => s.body.flatMap((b) => (typeof b === "string" ? b : b.list)))];
  return texts.some((text) => text.includes("{{TODO:"));
}

/** Shared layout for the Privacy Policy and Terms & Conditions pages. */
export function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <InnerPage>
      <section aria-labelledby="legal-title" className="section-y relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="bg-grid absolute inset-x-0 top-0 -z-10 h-[28rem] [mask-image:radial-gradient(ellipse_60%_80%_at_30%_0%,black,transparent)]"
        />
        <div className="container-site">
          <header data-reveal className="max-w-3xl">
            <Eyebrow>Legal</Eyebrow>
            <h1 id="legal-title" className="mt-5 text-heading font-semibold text-balance text-fg">
              {doc.title}
              <span className="text-red-500">.</span>
            </h1>
            <p className="mt-5 text-lead text-pretty text-muted">{doc.summary}</p>
            <p className="mt-4 text-sm text-subtle">
              Last updated: <Inline text={doc.lastUpdated} />
            </p>
            {hasTodos(doc) ? (
              <div
                role="note"
                className="mt-8 flex gap-3 rounded-md border border-blue-300/30 bg-blue-500/10 p-4 text-sm leading-relaxed text-fg"
              >
                <FileWarning className="mt-0.5 size-4 shrink-0 text-blue-300" aria-hidden="true" />
                <p>
                  <strong className="font-semibold">Draft pending legal review.</strong> This page has
                  not yet been reviewed by a lawyer. Items marked &ldquo;To confirm&rdquo; need
                  Adtech&apos;s details before it is final.
                </p>
              </div>
            ) : null}
          </header>

          <div className="mt-14 grid gap-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
            <nav aria-labelledby="legal-toc" className="lg:sticky lg:top-28 lg:self-start">
              <h2 id="legal-toc" className="eyebrow">
                On this page
              </h2>
              <ol className="mt-4 space-y-2.5 border-l border-line">
                {[...doc.sections, { id: "contact-us", title: "Contact us" }].map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="-ml-px block border-l border-transparent pl-4 text-sm text-muted transition-colors hover:border-red-500 hover:text-fg"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <article className="max-w-3xl space-y-12">
              {doc.sections.map((section) => (
                <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
                  <h2 id={`${section.id}-title`} className="text-title font-semibold text-fg">
                    {section.title}
                  </h2>
                  <div className="mt-4 space-y-4 leading-relaxed text-pretty text-muted">
                    {section.body.map((block, i) => (
                      <Block key={i} block={block} />
                    ))}
                  </div>
                </section>
              ))}

              <section
                id="contact-us"
                aria-labelledby="contact-us-title"
                className="rounded-lg border border-line bg-ink-800/80 p-6 shadow-card sm:p-8"
              >
                <h2 id="contact-us-title" className="text-title font-semibold text-fg">
                  Contact us
                </h2>
                <p className="mt-4 leading-relaxed text-muted">
                  For questions about this page, email us or use our{" "}
                  <Link href="/contact" className="text-fg underline underline-offset-4 hover:text-red-400">
                    contact page
                  </Link>
                  .
                </p>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="mt-5 flex w-fit items-center gap-3 break-all rounded-md text-fg transition-colors hover:text-red-400"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-md border border-line bg-ink-900 text-red-500">
                    <Mail className="size-4" aria-hidden="true" />
                  </span>
                  <span>
                    <ContactEmail />
                  </span>
                </a>
                {siteConfig.contact.phone ? (
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="mt-3 flex w-fit items-center gap-3 rounded-md text-fg transition-colors hover:text-red-400"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-md border border-line bg-ink-900 text-red-500">
                      <Phone className="size-4" aria-hidden="true" />
                    </span>
                    {siteConfig.contact.phone}
                  </a>
                ) : null}
                <p className="mt-3 flex w-fit items-center gap-3 text-fg">
                  <span className="grid size-10 shrink-0 place-items-center rounded-md border border-line bg-ink-900 text-red-500">
                    <MapPin className="size-4" aria-hidden="true" />
                  </span>
                  <Inline text={siteConfig.contact.location ?? "{{TODO: registered business address}}"} />
                </p>
              </section>
            </article>
          </div>
        </div>
      </section>
    </InnerPage>
  );
}
