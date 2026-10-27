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

  /** Production origin. NEXT_PUBLIC_SITE_URL overrides it, e.g. for a staging domain. */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || ("https://adtechcorp.co" as string | null),

  contact: {
    email: "myadtech@gmail.com",
    /** Optional. Rendered only when set. */
    phone: "571-589-7200" as string | null,
    /** Optional. Rendered only when set. Do not add a location that isn't real. */
    location: "8205 Aspen Glen CT, Alexandria, VA 22309, United States" as string | null,
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
 * Whether the contact and newsletter forms can deliver messages. They post to
 * the PHP scripts in public/api, which email the inbox above and only run on a
 * PHP host such as Hostinger. Set these to false to show the "Preview" notices
 * when deploying somewhere PHP doesn't run.
 */
export const contactSubmissionsEnabled = true;
export const newsletterSignupsEnabled = true;

/**
 * First-visit welcome message. It appears at most once per browser within the
 * cooldown, never on the excluded routes, and never when browser storage is
 * unavailable (so it can't reappear on every page load).
 */
export const welcomeModalConfig = {
  enabled: true,
  /** Days before the same browser may see the message again. */
  cooldownDays: 30,
  /** Wait before showing, so it never interrupts the first paint. */
  delayMs: 1200,
  /** Routes where the message never appears: forms and legal pages. */
  excludedPaths: ["/contact", "/privacy-policy", "/terms"],
  storageKey: "adtech:welcome-seen-at",
};

/** Absolute base URL for metadata; falls back to localhost during development. */
export const metadataBaseUrl = new URL(siteConfig.url ?? "http://localhost:3000");
