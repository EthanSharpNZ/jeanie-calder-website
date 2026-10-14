# Handover to The Web Guys

Prepared 15 October 2026. Hosting platform and replacement domain have not been confirmed. The existing production domain is unchanged.

## What you are receiving

1. A standalone React/TypeScript/Vite source project with npm lockfile, tests and build instructions.
2. A complete static website in `dist`, including initial HTML content, metadata, local fonts, artwork, favicon and a 404 page.
3. No editor-platform service, account connection, telemetry hook, backend or runtime secret is needed. The old editor scaffold has been removed from the current source. Historical commits remain intact.

The source and generated website are separate handover packages. Source is for maintenance; upload only the website package to hosting. Archives must be extracted, not uploaded as a single ZIP.

## Build and validate

```sh
npm ci
npm run check
npx playwright install chrome
npm run test:e2e
npm run handover
```

Use Node 22 LTS (at least 22.22.2) or 24 LTS (at least 24.15). Production hosting does not require Node. The build is a static generation step; `dist-ssr` is a temporary build artifact and must never be served. Installing dependencies requires registry access; the site itself loads scripts, fonts and images locally.

## Static hosting setup

- Build command: `npm ci && npm run build`.
- Publish/output directory: `dist`.
- Entry: `index.html` at the domain root; root hosting is expected, not a subdirectory.
- Serve missing paths with HTTP **404** and `404.html`. Do not redirect every unknown URL to index.html (this is not an SPA route-based app).
- Serve `.js` as JavaScript, `.css` as CSS, `.svg` as SVG, `.webp` as WebP and `.woff2` as WOFF2.
- Enable HTTPS and gzip/Brotli where supported.
- Apply `public/_headers` on platforms that support it. On Apache/Nginx/cPanel or other hosts, configure the equivalent headers yourself; `_headers` is not universally interpreted.
- Fingerprinted `/assets/` files may use `Cache-Control: public, max-age=31536000, immutable`.
- Revalidate HTML, robots, sitemap and unversioned icons on deployment. Do not apply long immutable caching globally.
- Security headers: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
- HSTS and a content security policy are host-specific decisions. The HTML uses inline JSON-LD and a no-JavaScript stylesheet; a blanket inline-blocking policy needs testing or hashes.

### Existing Cloudflare setup

`wrangler.jsonc` retains Worker `jeanie-calder-website`, static assets `dist`, and `404-page` handling. Current deployment is connected to GitHub main. If moving accounts or hosting elsewhere, The Web Guys must arrange their own Git integration, hosting permissions, billing and DNS access. No account tokens are included. Do not deploy to the old Worker accidentally when setting up a new host.

### Approved domain migration

Set the build environment variable `SITE_URL` to the new HTTPS origin, without a path. Example only: `https://author.example`.

PowerShell:

```powershell
$env:SITE_URL = 'https://author.example'
npm run build
```

POSIX shell:

```sh
SITE_URL=https://author.example npm run build
```

The build updates canonical, social, structured-data, robots and sitemap URLs in the generated output. Setting this variable does not change DNS. Once a migration is approved, configure TLS, redirects from the old address where controllable, and submit the new sitemap. Do not leave two indexable production copies without a canonical/redirect plan. Preview hosts should use noindex; the supplied production build allows indexing.

## Form behaviour and external links

The custom enquiry composer opens a `mailto:` draft to **calderjeanie@gmail.com** or copies the composed text. The visitor must send it in their email service. Nothing is submitted, stored or emailed by this website. Without JavaScript, the direct email address remains available. This is an approved limitation, not a working server submission form. Any direct-send integration is separate work requiring service ownership, spam controls, failure states and appropriate privacy information.

The hero links to Olympia Publishers for pre-ordering. Checkout, stock, price, shipping and customer accounts are handled by the publisher, not this website. Recheck the pre-order label when availability changes.

## Content and ownership items for the agency

- Copy, programme fees and supplied animation licence were confirmed by the owner on 13 October. Obtain and retain the client's licence/asset records privately; repository notes are not licence certificates.
- Book cover and animation are client-supplied. Do not redistribute them as stock assets or apply an open-source licence to the whole project.
- Confirm currency/GST, delivery format, dates, inclusions and enrolment terms with the client. The current site explicitly directs visitors to enquire; do not invent these details.
- A portrait, fuller credentials and consented testimonials remain optional client content improvements. None have been fabricated.
- No analytics, advertising pixels, cookie-consent service, CMS, payments or mailing-list integration are configured. Hosting logs remain the host's responsibility.
- Transfer repository and hosting access via normal owner-controlled invitations; do not email passwords or commit credentials.

## Acceptance checks before hosting cutover

1. Open the home page on desktop and phone. Confirm Hero, About, Programmes, Contact order, sticky navigation, mobile menu and no overflow.
2. Verify the pre-order link, all programme enquiry pre-selections, email validation, copy fallback and direct email link. No real test email is sent by automated checks.
3. Confirm the butterfly appears below the header, settles, and stays still for reduced-motion users.
4. View raw HTML with JavaScript disabled: title, description, page text and meaningful links must be present.
5. Check canonical, social image, sitemap and robots against the approved domain.
6. Check a nonsense URL returns 404, assets return correct MIME types, and TLS/security/cache headers are configured.
7. Record release commit and package checksum; keep the previous static release for rollback. Deploy atomically or retain old hashed assets during a rolling upload.

## Rollback and support boundary

Restore the previous complete static release, or revert the release commit and rebuild. Do not rewrite published Git history. Automated tests cover Chromium desktop/mobile layouts and keyboard/accessibility checks; they do not replace real-device Safari/Firefox checks, email-client delivery checks, host migration checks or a legal/accessibility certification.
