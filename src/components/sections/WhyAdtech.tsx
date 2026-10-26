import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading, type SectionProps } from "@/components/ui/SectionHeading";
import { principles } from "@/content/company";

/** Rendered alongside <Process /> wherever it appears, so "#process" stays on-page. */
export function WhyAdtech({ index }: Pick<SectionProps, "index">) {
  return (
    <section id="why-adtech" aria-labelledby="why-title" className="section-y">
      <div className="container-site grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* Editorial layout: sticky statement on the left, principles as a ruled list */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="why-title"
            index={index}
            eyebrow="Why Adtech"
            title="Built to last, not just to launch."
            description="Great software is the result of many small, disciplined decisions. These are the principles behind ours."
          />
          <div data-reveal className="mt-9">
            <ButtonLink href="#process" variant="secondary" icon={<ArrowRight className="size-4" />}>
              See how we work
            </ButtonLink>
          </div>
        </div>

        <ol className="border-t border-line">
          {principles.map((principle, index) => (
            <li
              key={principle.title}
              data-reveal
              style={{ "--reveal-delay": index % 2 } as CSSProperties}
              className="group grid grid-cols-[3rem_1fr] gap-x-4 border-b border-line py-7 sm:grid-cols-[4.5rem_1fr] sm:py-8"
            >
              <span className="font-mono text-sm text-subtle transition-colors duration-300 group-hover:text-red-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-title font-semibold text-fg">{principle.title}</h3>
                <p className="mt-2.5 max-w-xl leading-relaxed text-muted">{principle.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
