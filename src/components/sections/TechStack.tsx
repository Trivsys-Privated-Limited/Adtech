import type { CSSProperties } from "react";
import { SectionHeading, type SectionProps } from "@/components/ui/SectionHeading";
import { techCategories } from "@/content/technologies";

export function TechStack({ index, titleAs }: SectionProps) {
  return (
    <section id="solutions" aria-labelledby="solutions-title" className="section-y">
      <div className="container-site">
        <SectionHeading
          id="solutions-title"
          index={index}
          as={titleAs}
          eyebrow="Solutions & stack"
          title="Solutions across the full stack."
          description="We choose proven, well-supported technology that fits your product and your team — not whatever is trending this quarter."
        />

        <dl className="mt-14 border-t border-line lg:mt-16">
          {techCategories.map((category, index) => (
            <div
              key={category.name}
              data-reveal
              suppressHydrationWarning
              style={{ "--reveal-delay": index % 3 } as CSSProperties}
              className="grid gap-4 border-b border-line py-7 md:grid-cols-[16rem_1fr] md:items-center md:gap-10"
            >
              <dt>
                <span className="block text-lg font-semibold tracking-tight text-fg">{category.name}</span>
                <span className="mt-1 block text-sm text-subtle">{category.description}</span>
              </dt>
              <dd>
                <ul className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-sm border border-line bg-white/[0.025] px-3 py-1.5 font-mono text-[0.8125rem] text-fg/85 transition-colors duration-200 hover:border-blue-300/40 hover:text-fg"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
