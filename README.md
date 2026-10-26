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

## Editing content

All copy lives in `src/content` and `src/config`, separate from presentation:

- `src/config/site.ts`: company name, description, **contact email (placeholder)**, optional phone/location, social URLs (render only when set)
- `src/content/services.ts`: the six services and contact-form project types
- `src/content/work.ts`: case studies. **The current entries are labelled concept projects.** Replace them with real work and set `isConcept: false`
- `src/content/company.ts`: capabilities strip, principles, process steps, About copy
- `src/content/technologies.ts`: technology stack (keep to what the team really uses)
- `src/content/navigation.ts`: header and footer links

## Project structure

```
src/
  app/                 routes, metadata, robots, sitemap, OG image, icon, /api/contact
    services/ solutions/ work/ about/ contact/
                       inner pages, composed from the same section components as Home
    work/[slug]/       case study pages (statically generated)
  components/
    hero/              Hero, HeroVisual (client loader), HeroScene (R3F), HeroFallback (SVG)
    layout/            SiteHeader, SiteFooter, CurrentYear
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
