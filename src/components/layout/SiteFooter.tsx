import { ArrowUpRight, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { CurrentYear } from "@/components/layout/CurrentYear";
import { Newsletter } from "@/components/sections/Newsletter";
import { ContactEmail } from "@/components/ui/ContactEmail";
import { Wordmark } from "@/components/ui/Logo";
import { siteConfig } from "@/config/site";
import { footerNav, legalNav } from "@/content/navigation";
import { services } from "@/content/services";

const linkClass = "text-sm text-muted transition-colors duration-200 hover:text-fg";

export function SiteFooter() {
  const socials = siteConfig.social.filter(
    (social): social is { label: string; href: string } => Boolean(social.href),
  );

  return (
    <footer className="relative border-t border-line bg-ink-900/60">
      <Newsletter />
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr] lg:gap-10 lg:py-20">
        <div className="max-w-sm">
          <Link href="/" aria-label="Adtech — home" className="inline-block rounded-md">
            <Wordmark />
          </Link>
          <p className="mt-5 text-sm leading-relaxed text-muted">{siteConfig.description}</p>
        </div>

        <nav aria-labelledby="footer-company">
          <h2 id="footer-company" className="eyebrow">
            Company
          </h2>
          <ul className="mt-5 space-y-3">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-services">
          <h2 id="footer-services" className="eyebrow">
            Services
          </h2>
          <ul className="mt-5 space-y-3">
            {services.map((service) => (
              <li key={service.id}>
                <Link href={`/services#service-${service.id}`} className={linkClass}>
                  {service.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow">Contact</h2>
          <ul className="mt-5 space-y-3">
            <li>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className={`${linkClass} inline-flex items-center gap-2 break-all`}
              >
                <Mail className="size-4 shrink-0 text-red-500" aria-hidden="true" />
                <span>
                  <ContactEmail />
                </span>
              </a>
            </li>
            {siteConfig.contact.phone ? (
              <li>
                <a href={`tel:${siteConfig.contact.phone}`} className={`${linkClass} inline-flex items-center gap-2`}>
                  <Phone className="size-4 shrink-0 text-red-500" aria-hidden="true" />
                  {siteConfig.contact.phone}
                </a>
              </li>
            ) : null}
            {siteConfig.contact.location ? (
              <li className="text-sm text-muted">{siteConfig.contact.location}</li>
            ) : null}
          </ul>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-fg transition-colors hover:text-red-400"
          >
            Start a project
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-site flex flex-col gap-4 py-6 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <p>
              © <CurrentYear /> Adtech. All rights reserved.
            </p>
            <nav aria-label="Legal">
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {legalNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          {socials.length > 0 ? (
            <ul className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Social media">
              {socials.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {social.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
