# Jeanie Calder — Author Website

A single-page author website **design preview**. No database, login, payments, analytics or enquiry storage.

## Local development

Use Node.js 22 or newer and npm.

```sh
npm install
npm run dev
```

The editor preview retains its TanStack Start environment. The shared page is `src/components/author-website.tsx`; its interactions need no server functions.

## Portable static build

```sh
npm run build
npm run preview
```

`npm run build` uses ordinary Vite/React through `vite.static.config.ts`, `static.html` and `src/static-entry.tsx`. Output is **dist**, including **dist/index.html**. It excludes the TanStack server and editor error reporting. No runtime secrets, environment variables or backend services are needed.

Fonts are locally bundled from Fontsource (Cormorant Garamond and DM Sans, SIL Open Font License). The cover, fee photograph, six transparent sprite atlases and poster are repository-owned WebP files in `src/assets` (SHA-256 in HANDOVER.md). The build makes no network requests beyond `npm ci`. No source PDF, original MOV or transfer ZIP is included. Preserve the separately scoped rights in **ASSET_CREDITS.md**; only the fee photograph is CC BY-SA.

Install with `npm ci` (`package-lock.json`; `.npmrc` sets `legacy-peer-deps=true`, which npm needs to resolve this tree). `public/_headers` adds X-Robots-Tag noindex, nosniff and Referrer-Policy on Cloudflare Pages.

```sh
npm test
```

See **HANDOVER.md** for Cloudflare Pages Git setup and approvals. `npm run build:lovable` is the separate editor build, not the portable hosting output.
