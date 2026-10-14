# Jeanie Calder author website

A standalone React and TypeScript website, built with Vite. The production page is rendered to complete HTML at build time and enhanced in the browser. Hosting requires only static files, not Node.js, a database or an application server.

## Quick start

Use Node 22 LTS (22.22.2 or newer) or Node 24 LTS (24.15 or newer) and npm. Node 22 is selected in `.nvmrc` and CI.

```sh
npm ci
npm run dev
```

For a production preview:

```sh
npm run check
npm run preview
```

`npm run check` runs TypeScript, ESLint, unit tests and the production build. To run browser accessibility and responsive checks, install Chrome with `npx playwright install chrome`, then run `npm run test:e2e`. `npm run format:check` verifies formatting.

## Hosting

Upload the **contents of `dist/`** to the web root. Do not upload the source, `node_modules`, `dist-ssr`, test reports or credentials. See [HANDOVER.md](HANDOVER.md) for static hosting, metadata, cache, 404 and migration instructions.

The default public origin remains https://jeanie-calder-website.studionz.workers.dev. `SITE_URL` can be set at build time to an approved replacement HTTPS origin. It updates canonical URLs, Open Graph URLs, structured data, robots and sitemap together. It does not change DNS or deploy the site.

No environment variables or secrets are required for the existing site. No analytics, third-party tracking scripts or remote fonts are used. The enquiry form prepares an email draft or copies text; **it does not submit or store messages**.

## Source map

- `index.html` — metadata and HTML build template.
- `src/components/author-website.tsx` — page sections, navigation and enquiry composer.
- `src/lib/author-content.ts` — programme copy, fees, recipient, publisher link and email encoding.
- `src/styles.css` — visual design and responsive styles.
- `src/components/ui/` — the three UI primitives actually used (button, dialog, select).
- `src/components/hero-butterfly.tsx` — client-supplied animation with reduced-motion support and a permanent perch after under five seconds of movement.
- `src/components/photo-butterfly.tsx` — original decorative SVG fee symbol; filename retained for compatibility.
- `src/assets/` — local book artwork, animation and generated cover derivatives.
- `scripts/build.mjs` — optimized images, Vite build and build-time HTML rendering.
- `src/ssg-entry.tsx` and `src/static-entry.tsx` — rendering and hydration entries.
- `public/` — favicon, robots, sitemap, headers and 404 page.
- `tests/` and `src/test/` — browser and unit checks.

## Release and handover

GitHub main is the source of truth. Preserve the approved design and assets, test changes, and release approved updates only. Existing Cloudflare Workers deployment configuration is retained in `wrangler.jsonc`; it is optional for a different static host. Never change production DNS or domain configuration without owner approval.

`npm run handover` builds and creates dated source and static-hosting folders under ignored `artifacts/handover/`, with SHA-256 inventories. See [AUDIT.md](AUDIT.md) for audit findings and [ASSET_CREDITS.md](ASSET_CREDITS.md) for asset ownership notes.
