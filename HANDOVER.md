> Historical handover: deployment and approval statements below describe the original preview. README.md now defines the Workers Static Assets/SSG workflow. On 13 October 2026 the owner confirmed copy, fees and animation licence. Current production-readiness work remains unreleased until approved.

# The Web Guys — Jeanie Calder handover

## Status

Design preview only. No production publication, GitHub repository creation, domain connection, payments or email sending has been performed. Preview is noindex/nofollow with robots crawling disabled; review and remove these restrictions only when production launch is approved.

## GitHub → Cloudflare Pages (when approved)

1. In Lovable, connect GitHub (owner EthanSharpNZ) and create a **private** repository — client code and licensed media.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → **Connect to Git**; grant the Cloudflare GitHub app access to that one repository only. Do not use Direct Upload.
3. Settings: Framework preset **None** · Production branch **main** · Build command **npm run build** · Output directory **dist** · Root directory **blank (repo root)** · Environment variable **NODE_VERSION=22** (also pinned in `.nvmrc`).
4. No secrets, environment variables, Functions or Worker are needed. Install uses `package-lock.json` with `.npmrc` (`legacy-peer-deps=true`).
5. Review the `*.pages.dev` preview. It stays noindex (meta, robots.txt, `_headers` X-Robots-Tag) — noindex is not access control; add Cloudflare Access if the preview must be private.

The development preview uses TanStack Start; the portable deployment bypasses it and renders the same shared page through standard React/Vite. Never deploy the editor server output instead of `dist`.

## Media and rights

The genuine publisher print cover was supplied by the client, rendered at 3× resolution, and cropped to the front only (approximately x 52.8–98.7%, y 1.8–98.2%). Original artwork and typography are preserved. Only this cropped WebP is included in deployment. No source PDF, print marks, spine or back cover is exposed. No stock photos, fake portraits or generated book artwork are used.

Fontsource fonts: Cormorant Garamond and DM Sans, SIL Open Font License. The three static fee symbols use **Morpho menelaus**, Gregory Phillips, transparent version Lycaon, **CC BY-SA 3.0**, optimised as transparent WebP. Their adaptation remains share-alike; this does not licence the hero animation, site or book cover and implies no photographer endorsement. Preserve **ASSET_CREDITS.md** and the accessible image-credit dialog.

The hero uses the client's actual transparent MOV-derived sequence: six WebP atlases plus poster (1,207,806 image bytes), all 384 source frames retained with crop/timing metadata in `src/assets/butterfly-sequence/manifest.json`. A three-second arrival lands on a cover-relative anchor at 94% across/6% down, aligning source feet [638,371] on the upper-right front face. Idle uses genuine frames 185–195 forward/back over 3.6 seconds, avoiding the prolonged edge-on end poses. Arrival occurs once, then the butterfly remains perched across down/up scrolling; there is no departure or terminal scroll state. Offscreen, hidden-tab and footer-paused playback cancels its drawing loop while preserving the pose. Early offscreen arrival settles quietly; initial section links wait for the book's first visibility. The single text-only footer toggle shares page pause state and does not remount media. A viewport canvas (DPR capped at two) sits below dialogs; listeners/frames are cleaned up, and reduced-motion/save-data/decode failures use the transparent poster or nothing. The cover source is unchanged, and the three fee symbols stay static.

The header is transparent and in normal document flow, with 24px anchor scroll spacing; do not restore sticky positioning or an opaque fill. Typography roles use Cormorant Garamond 400 only for author names/editorial headings, and DM Sans 400/500 for supporting text, prices, controls and portal content. Shared CSS role tokens keep body/input at 16px, controls at 14px, helpers at 13px and fees at 24px desktop/22px mobile. No synthetic body italics are used.

All nine approved images are repository-owned files in `src/assets`, byte-identical to the approved uploads; atlases/poster keep alpha and the sprite manifest is unchanged. No runtime ZIP, original MOV, stock-source URL or Wikimedia hotlink is used. SHA-256 (relative to `src/assets`):

```text
e44a1537425bb49a2fb0c0b7cb311d25b2f72004784d63f795d3ede99a360c3c  jeanie-calder-front-cover.webp
946891afa1bf8ce221ebc5aeeae3937f75cb04e5e5570f79acd005bfb7a0d156  morpho-menelaus.webp
105e2d198fc5c06d1a511438d718726dbb7ee8b44a9a88f650e371ba55c51288  butterfly-sequence/butterfly-atlas-0.webp
bd77f54be5e358c171f2b184b8c1f309f44d59b79fdac386f5782e9883b6fd1b  butterfly-sequence/butterfly-atlas-1.webp
2e37abf791099280b51ff1d4b8064d93fe7967c4168df39071b3af19b5ebd517  butterfly-sequence/butterfly-atlas-2.webp
2afb02977e74943d4ffb5a4e4500aa8975a3282812c35099281d652a02cf2eee  butterfly-sequence/butterfly-atlas-3.webp
dacc35d8f4396e10cd2373dfd16a1f044a149ef6a6013c41906e6add28e3103e  butterfly-sequence/butterfly-atlas-4.webp
2b808587438a57982020f380974a5b11ebd105d676805f235c3f0510761a2eb4  butterfly-sequence/butterfly-atlas-5.webp
eed6ba4712950d878a466654b84f8613df2ecafdb47dc548c76c84d353283f4c  butterfly-sequence/butterfly-poster.webp
```

### Private production handover checklist — not website copy
- [ ] Obtain and retain the client's stock licence certificate and confirm permitted use before publication. It was not supplied with this upload; do not claim licensing has been verified or apply the fee image's CC licence to this animation.

## Contact behaviour

Public email: **calderjeanie@gmail.com**. The validated composer creates a URL-encoded `mailto:` draft. Visitors must review and send using their own email app. Copy message uses the clipboard only on explicit request; if unavailable, a selectable message appears. Nothing is stored, transmitted to a form service or marked sent. No medical intake, résumé uploads, trackers or analytics. Résumés can be emailed directly.

## Client approval checklist

- [ ] Domain and website name
- [ ] Title discrepancy in the brief — only **How to Lose Weight and Keep It Off** is used on this site; confirm it
- [ ] Book publication status and official buy link (none invented)
- [ ] Author photo and approved biography (current quote panel avoids a fake portrait)
- [ ] $1,000 / $10,000 / $100,000 fees, currency and GST/tax treatment
- [ ] Course/programme inclusions, format and entry requirements; no automatic ten-week duration for training programmes
- [ ] Public contact email, contact behaviour/policy and sensitive-information warning
- [ ] All client copy, including the single supplied attributed quote
- [ ] Production indexing decision, metadata and final launch approval

## Principal source files

- `src/components/author-website.tsx`: page, navigation, review dialog and composer
- `src/lib/author-content.ts`: programme information, interests and encoded draft logic
- `src/styles.css`: semantic palette, fonts, editorial layout and reduced-motion animation
- `src/components/ui/button.tsx`, `dialog.tsx`: design variants and accessible dialog
- `src/routes/index.tsx`, `__root.tsx`: editor preview and metadata
- `vite.static.config.ts`, `static.html`, `src/static-entry.tsx`: portable static build
- `src/test/author-content.test.ts`: fee and email-composer rule tests
- `public/robots.txt`: preview crawl restrictions
- `src/components/hero-butterfly.tsx`, `src/lib/butterfly-flight.ts`: supplied sprite animation and tested phase/trigger rules
- `src/components/photo-butterfly.tsx`, `ASSET_CREDITS.md`: static CC fee symbols and scoped attribution

All documentation is repository-only, not linked or served as page content.

## Preview QA

Earlier preview checks in Chromium at 1440px desktop and 390px/320px mobile covered genuine cover loading, no overflow, navigation, menu Escape/focus return, review dialog, all four interest-preselection actions, validation, clipboard/fallback, email draft, reduced motion and preview metadata. These historical checks predate the persistent-perch update below; the header now scrolls away rather than sticking.

Static build QA (12 October, Node 22.22 / npm 10.9): on a clean copy of the source, `npm ci` from registry.npmjs.org and `npm run build` passed, writing `dist/index.html`, `_headers`, `robots.txt` and hashed assets; `dist` contains no `lovable.app` or editor-asset references. Served by a plain static server with every non-localhost request blocked: cover, three fee symbols, transparent sprite canvas, all three fonts, scroll down/up perch, dropdown and Book enquiry preselection worked at 1440 and 390px with no errors, failed or external requests and no overflow. 19 Vitest tests passed. Not yet tested: a real Cloudflare Pages build, Safari/Firefox.

### Client handover checklist
- [ ] Private GitHub repo created via Lovable; Cloudflare Pages connected with the settings above
- [ ] Pages preview reviewed by client
- [ ] Hero stock licence certificate retained privately (not yet supplied)
- [ ] Client approvals above completed before removing noindex or adding a domain

## Approved author clean-up QA

### Persistent hero interaction QA (12 October)
The former scroll-departure behavior is superseded: no take-off threshold, exit frames or permanent hash suppression remain. 19 Vitest tests passed across five files. Chromium checks at 1440×900 and 390/360/320px verified one arrival, the same cover-relative perch after repeated scroll round trips, offscreen canvas clearing/RAF suspension, early-scroll settling, direct-contact delayed entry, footer pause continuity, reduced-motion/save-data and forced-atlas-failure stills, transparent non-sticky header, consistent computed font roles and all four enquiry selections with real clipboard text. Hidden-tab behavior was checked by visibility-event simulation. Hero, different idle poses, return, programme rows, dropdown and mobile menu screenshots were inspected. No page runtime errors or horizontal overflow were observed. Production export and Safari/Firefox playback remain unverified; no production build is claimed.

Computed typography after `document.fonts.ready`: H1 Cormorant Garamond 400 at 64px desktop, 42px at 390/360px and 38px at 320px; H2 42/32px and H3 32/28px, both the same display family/400. Fees DM Sans 500 at 24/22px; descriptions DM Sans 400 at 16px/27.2px line height; CTA, label, options and mobile navigation DM Sans 500 at 14px/21px; select trigger DM Sans 400 at 16px; byline DM Sans 400 at 13px. All three required font requests (display 400, sans 400/500) returned HTTP 200, with no failed requests. Resize/orientation preserved idle; required validation, denied-clipboard fallback clearing and both footer dialogs' Escape/focus return were also verified.

The page now has the exact book-title H1, a single introduction, compact unnumbered programme rows, concise about/contact sections and footer review/credit controls. No book orbit or large quote placeholder remains. Chromium checks at 1440px, 390px and 320px verified no overflow, loaded original cover and textured photographic butterfly, section anchors, all four enquiry preselection links, dropdown keyboard/click selection, form validation, actual clipboard copying, denied-clipboard fallback, draft launch, both footer dialogs’ focus trapping/Escape/return and mobile navigation. Separate wing transforms change over time, pause offscreen and switch to a still composite with reduced motion. Desktop/mobile first-screen and whole-page screenshots were inspected. No page runtime errors were observed. All 13 tests passed across four files, including four clean-up enquiry-action regressions. No production build, publication or service connection was performed.