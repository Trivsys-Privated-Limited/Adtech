# Adtech — Company Website

Marketing website for Adtech, a software development and technology solutions company.

Built with Next.js 16 (App Router, Cache Components), React 19, TypeScript (strict),
Tailwind CSS v4, React Three Fiber, and Motion.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional, see "Configuration"
npm run dev                  # http://localhost:3000
```

| Script               | Purpose                                     |
| -------------------- | ------------------------------------------- |
| `npm run dev`        | Development server                          |
| `npm run build`      | Production build (includes type checking)   |
| `npm run start`      | Serve the production build                  |
| `npm run lint`       | ESLint                                      |
| `npm run typecheck`  | TypeScript, no emit                         |
| `npm run test:e2e`   | Playwright end-to-end tests (build first)   |

End-to-end tests need a browser. Either run `npx playwright install chromium` once,
or use an installed browser: `PW_CHANNEL=msedge npm run test:e2e` (or `chrome`).

## Configuration

| Variable                 | Scope       | Purpose                                                                                   |
| ------------------------ | ----------- | ----------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`   | public      | Production origin. Enables canonical URLs and absolute sitemap/robots/Open Graph URLs.    |
| `CONTACT_WEBHOOK_URL`    | server only | Receives contact form submissions as JSON.                                                |
| `CONTACT_WEBHOOK_SECRET` | server only | Optional. Sent as `Authorization: Bearer <secret>` to the webhook.                        |
| `NEWSLETTER_WEBHOOK_URL`    | server only | Receives newsletter sign-ups as JSON.                                                  |
| `NEWSLETTER_WEBHOOK_SECRET` | server only | Optional. Sent as `Authorization: Bearer <secret>` to the newsletter webhook.          |

### Contact form

`src/app/api/contact/route.ts` is the integration boundary. It validates every submission
with the same rules as the client (`src/lib/contact.ts`), drops honeypot spam, then
`POST`s this JSON to `CONTACT_WEBHOOK_URL`:

```json
{ "name": "", "email": "", "company": "", "projectType": "", "details": "", "source": "adtech-website", "submittedAt": "ISO-8601" }
```

Point it at a CRM, a Zapier/Make webhook, a Slack workflow, or your own email-sending
endpoint. **Until it is configured, a "Preview form" notice is shown above the form, the
API returns `503`, and the form tells visitors their message was not sent** (with a
mailto fallback). It never shows a fake success.

The notice is decided when the page is built, so set `CONTACT_WEBHOOK_URL` **before**
`npm run build` (or restart `npm run dev`). Only a true/false flag reaches the browser;
the URL itself stays on the server.

While `siteConfig.contact.email` uses the reserved `.example` domain, every place the
address appears (contact section, footer, form error) shows a "Placeholder" label. The
label disappears once a real address is set in `src/config/site.ts`.

### Newsletter

The sign-up form at the top of the footer (every page) posts to
`src/app/api/newsletter/route.ts`. No newsletter provider is wired in; the route is a
provider-agnostic boundary like the contact form. It validates the address
(`src/lib/newsletter.ts`), drops honeypot spam, rejects oversized bodies, then `POST`s
this JSON to `NEWSLETTER_WEBHOOK_URL`:

```json
{ "email": "", "source": "adtech-website", "subscribedAt": "ISO-8601" }
```

Point it at a Zapier/Make webhook that adds the contact to your email platform
(Mailchimp, Brevo, ConvertKit, Buttondown, …) or at your own endpoint. Turn on
**double opt-in** at the provider so only confirmed owners of an address join the list.
Provider API keys belong in that integration or in server-only env vars, never in
client code. **Until it is configured, the form shows a "Preview" notice, the API returns
`503`, and visitors are told they were not subscribed.** Success is shown only when the
webhook responds with a 2xx. As with the contact form, set the variable before
`npm run build`.

There is no rate limiting. If the endpoint attracts abuse, add it at the edge (your
host's firewall / bot protection) or in the receiving service.

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

### Legal pages (drafts)

`/privacy-policy` and `/terms` are **draft templates that need review by Adtech and a
lawyer before launch**. Their copy is in `src/content/legal.ts`. Every detail the business
must supply (legal entity, address, hosting and email providers, retention periods,
applicable law and jurisdiction, liability wording, publication date) is written as
`{{TODO: …}}` and shows on the page as a visible "To confirm" badge, with a "Draft pending
legal review" notice at the top. Replace each marker with real text. Once none remain,
remove the notice in `src/components/legal/LegalDocument.tsx`.

The privacy policy describes how the site currently works: no analytics, no cookies of
its own, one `localStorage` item for the welcome message. Update it if you add analytics,
tracking or other tools.

## Editing content

All copy lives in `src/content` and `src/config`, separate from presentation:

- `src/config/site.ts`: company name, description, **contact email (placeholder)**, optional phone/location, social URLs (render only when set)
- `src/content/services.ts`: the six services and contact-form project types
- `src/content/work.ts`: case studies. **The current entries are labelled concept projects.** Replace them with real work and set `isConcept: false`
- `src/content/company.ts`: capabilities strip, principles, process steps, About copy
- `src/content/technologies.ts`: technology stack (keep to what the team really uses)
- `src/content/navigation.ts`: header, footer and legal links
- `src/content/legal.ts`: Privacy Policy and Terms & Conditions (drafts with TODO markers)

## Project structure

```
src/
  app/                 routes, metadata, robots, sitemap, OG image, icon, /api/contact
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
