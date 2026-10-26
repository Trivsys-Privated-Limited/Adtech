/**
 * Company-level configuration.
 *
 * Values marked PLACEHOLDER must be replaced with Adtech's real details
 * before launch. Optional fields left as `null` are simply not rendered.
 */
export const siteConfig = {
  name: "Adtech",
  tagline: "Software development & technology solutions",
  description:
    "Adtech builds intelligent software, modern digital platforms, and scalable technology solutions that help ambitious businesses innovate and grow.",

  /** Production origin, e.g. https://adtech.com. Set NEXT_PUBLIC_SITE_URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || null,

  contact: {
    /** PLACEHOLDER: replace with the real inbox (uses the reserved .example TLD). */
    email: "hello@adtech.example",
    /** Optional. Rendered only when set. */
    phone: null as string | null,
    /** Optional. Rendered only when set. Do not add a location that isn't real. */
    location: null as string | null,
  },

  /** Social profiles render only when a real URL is configured. */
  social: [
    { label: "LinkedIn", href: null },
    { label: "GitHub", href: null },
    { label: "X", href: null },
  ] as { label: string; href: string | null }[],
} as const;

/**
 * True while the inbox still uses the reserved `.example` domain. The UI labels
 * the address as a placeholder until a real one is configured.
 */
export const contactEmailIsPlaceholder = siteConfig.contact.email.toLowerCase().endsWith(".example");

/**
 * Whether the contact form can deliver messages. Only this boolean reaches
 * the client; the webhook URL itself stays server-side. Evaluated when the
 * page is built, so set CONTACT_WEBHOOK_URL before `npm run build`.
 */
export const contactSubmissionsEnabled = Boolean(process.env.CONTACT_WEBHOOK_URL);

/** Absolute base URL for metadata; falls back to localhost during development. */
export const metadataBaseUrl = new URL(siteConfig.url ?? "http://localhost:3000");
