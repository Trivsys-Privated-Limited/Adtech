import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

/** Closing call to action for inner pages. */
export function CtaBand() {
  return (
    <section aria-labelledby="cta-title" className="relative isolate overflow-hidden border-t border-line">
      <div aria-hidden="true" className="absolute -left-32 top-0 -z-10 size-[26rem] rounded-full bg-blue-500/15 blur-[120px]" />
      <div aria-hidden="true" className="absolute -right-24 bottom-0 -z-10 size-[20rem] rounded-full bg-red-500/10 blur-[110px]" />
      <div
        data-reveal
        className="container-site flex flex-col gap-8 py-20 sm:py-24 md:flex-row md:items-center md:justify-between"
      >
        <div className="max-w-2xl">
          <h2 id="cta-title" className="text-heading font-semibold text-balance text-fg">
            Have an idea? Let&apos;s engineer what&apos;s next<span className="text-red-500">.</span>
          </h2>
          <p className="mt-4 text-lead text-pretty text-muted">
            Tell us what you&apos;re building and we&apos;ll help you find the right path forward.
          </p>
        </div>
        <ButtonLink href="/contact" size="lg" className="shrink-0" icon={<ArrowRight className="size-4" />}>
          Start a project
        </ButtonLink>
      </div>
    </section>
  );
}
