import { contactEmailIsPlaceholder, siteConfig } from "@/config/site";

/**
 * The contact address, with a visible "Placeholder" label while the
 * configured inbox is not real (see `contactEmailIsPlaceholder`).
 */
export function ContactEmail() {
  return (
    <>
      <span className="break-all">{siteConfig.contact.email}</span>
      {contactEmailIsPlaceholder ? (
        <span className="ml-2 inline-block rounded-sm border border-line-strong px-1.5 py-0.5 align-middle font-mono text-[0.625rem] uppercase leading-none tracking-wider text-muted">
          Placeholder
        </span>
      ) : null}
    </>
  );
}
