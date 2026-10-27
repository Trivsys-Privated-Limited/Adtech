import { Mail, Phone } from "lucide-react";
import type { CSSProperties } from "react";
import { ContactForm } from "@/components/sections/ContactForm";
import { ContactEmail } from "@/components/ui/ContactEmail";
import { Eyebrow, type SectionProps } from "@/components/ui/SectionHeading";
import { contactSubmissionsEnabled, siteConfig } from "@/config/site";

const nextSteps = [
  { title: "We review your brief", text: "Someone from our engineering team reads every enquiry personally." },
  { title: "Discovery conversation", text: "A focused call to understand your goals, constraints and timeline." },
  { title: "A clear proposal", text: "Recommended approach, scope and next steps — no obligation." },
];

export function Contact({ index, titleAs: Title = "h2" }: SectionProps) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="section-y relative isolate overflow-hidden border-t border-line">
      <div
        aria-hidden="true"
        className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_70%_at_20%_30%,black,transparent)]"
      />
      <div aria-hidden="true" className="absolute -left-40 top-20 -z-10 size-[32rem] rounded-full bg-blue-500/15 blur-[120px]" />
      <div aria-hidden="true" className="absolute -right-20 bottom-0 -z-10 size-[24rem] rounded-full bg-red-500/10 blur-[120px]" />

      <div className="container-site grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div data-reveal>
          <Eyebrow index={index}>Start a project</Eyebrow>
          <Title id="contact-title" className="mt-5 text-heading font-semibold text-balance text-fg">
            Have an Idea? Let&apos;s Engineer What&apos;s Next<span className="text-red-500">.</span>
          </Title>
          <p className="mt-5 max-w-lg text-lead text-pretty text-muted">
            Tell us about the product you want to build or the problem you need solved. We&apos;ll
            help you find the fastest responsible path forward.
          </p>

          <ol className="mt-10 space-y-6">
            {nextSteps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line-strong font-mono text-xs text-muted">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-fg">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="mt-10 flex w-fit items-center gap-3 break-all rounded-md text-fg transition-colors hover:text-red-400"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-md border border-line bg-ink-800 text-red-500">
              <Mail className="size-4" aria-hidden="true" />
            </span>
            <span>
              <ContactEmail />
            </span>
          </a>
          {siteConfig.contact.phone ? (
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="mt-4 flex w-fit items-center gap-3 rounded-md text-fg transition-colors hover:text-red-400"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-md border border-line bg-ink-800 text-red-500">
                <Phone className="size-4" aria-hidden="true" />
              </span>
              {siteConfig.contact.phone}
            </a>
          ) : null}
        </div>

        <div data-reveal style={{ "--reveal-delay": 1 } as CSSProperties}>
          <ContactForm
            submissionsEnabled={contactSubmissionsEnabled}
            emailLink={
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="font-medium underline underline-offset-4 hover:text-red-400"
              >
                <ContactEmail />
              </a>
            }
          />
        </div>
      </div>
    </section>
  );
}
