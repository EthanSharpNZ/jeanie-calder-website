# Production-readiness review — 13 October 2026

Prepared on `codex/production-ssg` from GitHub main `8dadc98b0417931e51a394341885d321389b6c06`. The owner approved committing and pushing this release on 13 October 2026. Live deployment verification follows the push.

## Changes

- Generate complete HTML from the existing React page at build time and hydrate it in the browser. No framework migration or request-time server is needed.
- Include title, description, canonical, Open Graph/Twitter metadata and the original cover as a public social JPEG in the initial document; add Person/Book/WebSite JSON-LD and a one-page sitemap.
- Allow production crawling and remove the obsolete public design-preview dialog after the owner confirmed copy, fees and the animation licence. Preserve the existing fee disclaimer rather than invent currency/GST details.
- Retain semantic landmarks, the labelled custom enquiry composer, Radix controls, skip link and meaningful cover alt text. Decorative fee images retain empty alt text. Provide content/navigation/direct email access with JavaScript disabled; hide the script-dependent form to prevent accidental native form submission.
- Preserve all original media and the approved layout, typography, pastels and animation. Supply 37/54/117/212 KB responsive WebP covers instead of the 804 KB master; deliver the fee butterfly at 3.3 KB instead of 99 KB.
- Defer the animation module until after the cover loads; reduced-motion/save-data users download only its poster. Arrival, perching, scroll suspension and pause/resume remain intact.
- Following visual review, shorten perched wing cycles from 3.6 seconds to a varied 0.8–1.2 seconds using the same supplied poses. The three-second arrival is unchanged; targeted motion tests and browser lifecycle verification pass.
- Reduce CSS from 85.8 KB to 38.8 KB; use module scripts, font preloads and immutable caching for hashed assets.
- Add Workers Static Assets configuration, proper 404 handling, reproducible browser tests and a Node 22 verification workflow. Keep the existing domain.

## Verification

| Local Lighthouse result | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 95 | 100 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| First Contentful Paint | 1.7 s | 0.4 s |
| Largest Contentful Paint | 2.3 s | 0.5 s |
| Cumulative Layout Shift | 0 | 0 |

These are single local lab runs with Lighthouse 13.5.0, standard mobile/desktop presets, Chrome, and the production build served by Vite preview. They are not field measurements or a fresh RateMySite grade. Production network, Cloudflare settings and third-party scoring can differ. Local reports are `artifacts/lighthouse-mobile.report.html` and `artifacts/lighthouse-desktop.report.html` (ignored by Git).

- Production build succeeds under Node 22 and Node 24.
- TypeScript check and all 19 unit tests pass.
- All six Playwright tests pass, including desktop 1440 px, mobile 390/320 px, initial response content/assets, no-JavaScript fallback, hydration, keyboard focus, enquiry preselection, clipboard fallback, axe scans and animation lifecycle.
- No axe violations, hydration errors or horizontal overflow in the tested viewports. Desktop/mobile screenshots inspected with the butterfly perched.
- Wrangler deploy dry run succeeds without uploading.
- Cloudflare local emulator returns HTTP 200 for the full page, HTTP 404 for a nonexistent route, `nosniff`, no blocking robots header, and one-year immutable cache headers for hashed assets.
- Original cover SHA-256 remains `e44a1537425bb49a2fb0c0b7cb311d25b2f72004784d63f795d3ede99a360c3c`.

## Release and remaining verification

The owner approved this update for commit and push. Synchronize with GitHub main and release through the existing Cloudflare Git deployment. Verify its build/deploy commands against README.md. Do not create a new domain or hosting project.

After deployment, confirm the live source contains the page content and metadata, indexing headers and sitemap are correct, the social image resolves, and unknown paths return 404. Then rerun RateMySite and mobile/desktop Lighthouse. The local scores support aiming for A, but do not guarantee it. Safari/Firefox and real-device/field performance have not been verified in this pass. The email composer remains a draft/copy workflow, not a backend submission service.
