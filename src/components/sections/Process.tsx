import { SectionHeading, type SectionProps } from "@/components/ui/SectionHeading";
import { ProcessExplorer } from "@/components/sections/ProcessExplorer";
import { processSteps } from "@/content/company";

export function Process({ index }: Pick<SectionProps, "index">) {
  return (
    <section id="process" aria-labelledby="process-title" className="section-y border-t border-line bg-ink-900/40">
      <div className="container-site">
        <SectionHeading
          id="process-title"
          index={index}
          eyebrow="Our process"
          title="A clear path from idea to impact."
          description="Six focused stages, each with a defined outcome — so you always know where your project stands and what comes next."
        />
        <div data-reveal suppressHydrationWarning className="mt-14 lg:mt-16">
          <ProcessExplorer steps={processSteps} />
        </div>
      </div>
    </section>
  );
}
