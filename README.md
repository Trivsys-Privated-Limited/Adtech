# Adtech — Company Website

Marketing website for Adtech, a software development and technology solutions company.

Built with Next.js 16 (App Router, Cache Components), React 19, TypeScript (strict),
Tailwind CSS v4, React Three Fiber, and Motion.

## Getting started

```bash
npm install
npm run dev                  # http://localhost:3000
```

| Script               | Purpose                                                  |
| -------------------- | -------------------------------------------------------- |
| `npm run dev`        | Development server                                       |
| `npm run build`      | Static export to `out/` (includes type checking)         |
| `npm run lint`       | ESLint                                                   |
| `npm run typecheck`  | TypeScript, no emit                                      |
| `npm run test:e2e`   | Playwright end-to-end tests (build first)                |

End-to-end tests need a browser. Either run `npx playwright install chromium` once,
or use an installed browser: `PW_CHANNEL=msedge npm run test:e2e` (or `chrome`).

## Deploying to Hostinger

The site is a static export (`output: "export"` in `next.config.ts`) for Hostinger
shared hosting at **https://adtechcorp.co**. There is no Node.js server.

1. `npm run build`. The whole site is written to `out/`.
2. In hPanel, open **File Manager → public_html**, delete the old site files, and upload
   the **contents** of `out/` (not the folder itself). Uploading a zip of `out/` and
   choosing **Extract** is quickest. Include the hidden `.htaccess` file.
3. In hPanel, make sure **SSL** is active for the domain. `.htaccess` redirects every
   request to HTTPS.

`public/.htaccess` (copied into `out/`) serves the 404 page, forces HTTPS, sets
security and cache headers, and serves the extension-less `opengraph-image` as PNG.

`npm run start` does not work with a static export. Preview a build by uploading it, or
with any static file server pointed at `out/` (forms need PHP, see below).

## Configuration

| Setting                 | Where                 | Purpose                                                              |
| ----------------------- | --------------------- | -------------------------------------------------------------------- |
| Site URL                | `src/config/site.ts`  | `https://adtechcorp.co`. Used for canonical, sitemap, robots and Open Graph URLs. `NEXT_PUBLIC_SITE_URL` overrides it at build time. |
| Email, phone, address   | `src/config/site.ts`  | Shown in the footer, contact section and legal pages.                |
| Form inbox              | `public/api/_mail.php`| `RECIPIENT`: where contact and newsletter emails are sent.           |

The contact email (`myadtech@gmail.com`), phone (`571-589-7200`) and address are set in
`src/config/site.ts`. If the email is ever set to a reserved `.example` address, every
place it appears is labelled "Placeholder" automatically.

### Contact form and newsletter

Both forms post JSON to small PHP scripts in `public/api/`, which Hostinger runs:

- `contact.php` validates the enquiry with the same rules as the client
  (`src/lib/contact.ts`; the project-type list comes from `out/api/project-types.json`,
  generated at build time from `src/content/services.ts`), drops honeypot spam, and
  emails it to `RECIPIENT` with the visitor's address as Reply-To.
- `newsletter.php` validates the address (`src/lib/newsletter.ts`) and emails the
  sign-up to the same inbox. Add sign-ups to your email platform by hand, or forward
  these emails into it.

Mail is sent with PHP `mail()` from `noreply@<your domain>`. For reliable delivery,
create that mailbox (or any address on the domain) in **hPanel → Emails** so SPF/DKIM
cover it, and check the spam folder for the first test message. Success is shown only
when `mail()` reports the message was accepted.

The scripts don't run under `npm run dev`, so the forms show a "something went wrong"
error with the email fallback locally. If the site is ever moved to a host without PHP,
set `contactSubmissionsEnabled` / `newsletterSignupsEnabled` to `false` in
`src/config/site.ts` to show the "Preview" notices instead.

There is no rate limiting. If the forms attract abuse, turn on Hostinger's bot
protection or add a CAPTCHA.

### Welcome message

`src/components/layout/WelcomeModal.tsx` shows a short welcome dialog with a link to
`/services` on a visitor's first page load. Settings are in `welcomeModalConfig` in
`src/config/site.ts`:

- `enabled`: turn it off entirely
- `cooldownDays` (default 30): how long before the same browser can see it again. The time
  it was shown is stored in `localStorage` (`adtech:welcome-seen-at`)
- `delayMs` (default 1200): wait before showing
- `excludedPaths`: routes where it never appears (contact form and legal pages)

It is decided once per page load, never on client-side navigation. It is skipped if the
visitor is already typing in a form field or the mobile menu is open, and it stays closed
when storage is unavailable, so it can't reappear on every page. It uses the native
`<dialog>` element: focus stays inside, Escape and the backdrop close it, and the page
behind is inert. The entrance animation is disabled under `prefers-reduced-motion`.

### Legal pages

`/privacy-policy` and `/terms` copy is in `src/content/legal.ts`. All business details
are filled in. Any detail written as `{{TODO: …}}` shows on the page as a visible "To
confirm" badge, and a "Draft pending legal review" notice appears at the top while any
remain. Have both pages reviewed by a lawyer.

The privacy policy describes how the site currently works: no analytics, no cookies of
its own, one `localStorage` item for the welcome message. Update it if you add analytics,
tracking or other tools.

## Editing content

All copy lives in `src/content` and `src/config`, separate from presentation:

- `src/config/site.ts`: company name, description, contact email and phone, optional location, social URLs (render only when set)
- `src/content/services.ts`: the six services and contact-form project types
- `src/content/work.ts`: case studies. **The current entries are labelled concept projects.** Replace them with real work and set `isConcept: false`
- `src/content/company.ts`: capabilities strip, principles, process steps, About copy
- `src/content/technologies.ts`: technology stack (keep to what the team really uses)
- `src/content/navigation.ts`: header, footer and legal links
- `src/content/legal.ts`: Privacy Policy and Terms & Conditions (drafts with TODO markers)

## Project structure

```
src/
  app/                 routes, metadata, robots, sitemap, OG image, icon, api/project-types.json
    services/ solutions/ work/ about/ contact/
                       inner pages, composed from the same section components as Home
    work/[slug]/       case study pages (statically generated)
    privacy-policy/ terms/
                       legal pages, rendered from src/content/legal.ts
    api/newsletter/    newsletter sign-up boundary
  components/
    hero/              Hero, HeroVisual (client loader), HeroScene (R3F), HeroFallback (SVG)
    layout/            SiteHeader, SiteFooter, CurrentYear, WelcomeModal
    legal/             LegalDocument (shared legal page layout)
    sections/          one component per home page section (+ client islands)
    ui/                Button, SectionHeading, Logo
    work/              ProjectPreview (code-drawn interface previews)
    motion/            RevealObserver (scroll reveal)
  config/  content/  lib/
tests/e2e/             Playwright suite
```

## Notes

- **3D hero**: procedural geometry only (no model downloads). Loaded client-side with
  `next/dynamic` (`ssr: false`), shown over a matching static SVG. The SVG stays visible
  when WebGL is unavailable. The scene pauses off-screen, renders a single still frame
  under `prefers-reduced-motion`, and only follows the pointer on fine-pointer devices.
- **Motion**: the hero entrance and scroll reveals are CSS, so content is never hidden
  without JavaScript or under reduced motion. Motion powers the mobile menu, process
  panel and form transitions.
- **Brand red on buttons** uses `#D92D41` at rest (white text passes WCAG AA) and
  `#C22639` on hover. `#F04452` is used for accents, highlights and focus rings.
