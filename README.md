# Jeanie Calder — Author Website

GitHub is the source of truth. The site is served by **Cloudflare Workers Static Assets** at https://jeanie-calder-website.studionz.workers.dev/. Do not change the production domain or use Lovable to edit or deploy this project.

## Rendering and architecture

`npm run build` runs `scripts/build.mjs`: it derives optimized delivery images from the approved masters, builds the Vite browser bundle, renders the shared `AuthorWebsite` component to HTML using React on the build machine, and writes the complete page to `dist/index.html`. The browser hydrates that same tree for navigation, the enquiry composer and animation. Cloudflare serves only `dist`; no server runtime, database, form service or runtime secrets are needed. Never publish `dist-ssr`.

- `src/components/author-website.tsx`: semantic page, accessible navigation and custom enquiry form.
- `src/lib/author-content.ts`: shared copy, programme fees and email-draft encoding.
- `src/styles.css`: approved pastel palette, typography and responsive layout.
- `src/components/deferred-butterfly.tsx`: loads the animation after the book cover and browser idle time.
- `src/components/hero-butterfly.tsx`: approved sprite animation with a brief arrival and wing movement, a permanent still perch after 4.8 seconds, and reduced-motion support. Reduced-motion/save-data users load only the poster.
- `static.html`: initial-head metadata, canonical URL, Open Graph/Twitter image and Person/Book/WebSite structured data.
- `src/ssg-entry.tsx` / `src/static-entry.tsx`: build-time rendering and browser hydration.
- `public/robots.txt`, `sitemap.xml`, `_headers`, `404.html`: crawling, security/cache headers and missing-page handling.

The original assets remain byte-for-byte intact under `src/assets`. Responsive WebP derivatives are in `src/assets/optimized`; the social JPEG is produced in `dist/images`. Preserve `ASSET_CREDITS.md`. Fee butterflies are decorative and deliberately use empty alt attributes; the meaningful book image has descriptive alt text.

The form opens an email draft or copies text on request; it never sends or stores messages. Without JavaScript, content, navigation and the direct email link remain available, while script-dependent controls are hidden.

## Development and verification

Use Node **22** and npm. `.npmrc` retains `legacy-peer-deps=true` for the inherited dependency tree.

```sh
npm ci
npm run build
npm run preview
npm run typecheck
npm test
npm run test:e2e
```

`npm run dev` uses the standalone Vite configuration at `/static.html`. Prefer the production preview for rendering and SEO checks. Browser tests use Chrome; install it with `npx playwright install chrome` if unavailable. GitHub Actions repeats typechecking, unit tests, build and browser checks on Node 22. Existing TanStack files remain as historical compatibility code and are excluded from the deployed entry point.

Browser checks verify actual response HTML, metadata/assets, no-JavaScript use, hydration errors, desktop/mobile layout, Radix keyboard controls, enquiry preselection and clipboard fallback, axe accessibility and butterfly behaviour. Screenshots/traces are local ignored artifacts. Lighthouse reports are lab measurements, not proof of field Core Web Vitals or a particular third-party grade.

## Existing Cloudflare Worker

`wrangler.jsonc` targets the existing `jeanie-calder-website` Worker and the generated `dist` directory with real 404 handling. It does not specify or change custom-domain routes.

- Production branch: `main`
- Node version: `22`
- Build: `npm ci && npm run build`
- Deploy: `npx wrangler deploy`
- Validate without publishing: `npx wrangler deploy --dry-run`

Retain the existing Workers Git connection and domain configuration. Cloudflare dashboard build settings are external to this repository and must be checked when deploying. Do not follow the historical Pages setup instructions in old handover notes.

Production output allows crawling and uses the existing workers.dev origin for canonical, sitemap and social URLs. If publishing an unapproved preview branch, apply noindex to that preview environment; never point a preview canonical at a new production domain automatically.

## Editing and release workflow

Start from current GitHub `main`, work on a `codex/` branch, preserve the approved visual design and masters, test and show the concrete change. Commit/push and release only approved updates. After release, verify the live response contains the full HTML and head tags, assets load, missing URLs return 404, headers allow indexing, and run a fresh mobile/desktop audit. Revert the release commit for rollback; do not rewrite published history.

On 13 October 2026 the owner confirmed the copy, programme fees and supplied animation licence. This records that confirmation, not independent inspection of the private licence certificate. Currency/GST details and a purchase link are not invented; existing copy is preserved apart from removal of the public design-preview review dialog.
