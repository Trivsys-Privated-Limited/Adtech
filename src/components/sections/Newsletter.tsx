import { NewsletterForm } from "@/components/sections/NewsletterForm";
import { newsletterSignupsEnabled } from "@/config/site";

/** Newsletter band at the top of the footer, shown on every page. */
export function Newsletter() {
  return (
    <section id="newsletter" aria-labelledby="newsletter-title" className="border-b border-line">
      <div className="container-site grid gap-8 py-12 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16 lg:py-14">
        <div className="max-w-md">
          <p className="eyebrow">Newsletter</p>
          <h2 id="newsletter-title" className="mt-4 text-title font-semibold text-balance text-fg">
            Notes on building better software<span className="text-red-500">.</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Occasional updates on what we&apos;re building and learning, from product engineering
            to practical AI.
          </p>
        </div>
        <NewsletterForm signupsEnabled={newsletterSignupsEnabled} />
      </div>
    </section>
  );
}
