# Jeanie Calder — Author Website

A single-page author website **design preview**, prepared for The Web Guys. No database, login, payments, analytics or enquiry storage. The contact form composes an email draft or copies a message; it does not send enquiries itself.

## Repository handover

This private repository contains the complete approved website source, real book cover, fee butterfly photograph, six transparent butterfly animation atlases and poster. The latest transparent header, consistent typography and persistent perched butterfly behaviour are included. GitHub is a **separate source copy**, not an automatic Lovable sync. Make subsequent handover/hosting changes here.

The source was imported from Lovable commit `50a5da0664286ca206ee5f2e56652c948999ba3f`. All 107 source files and the nine WebP assets were verified before import. A clean GitHub runner exposed a missing explicit `@testing-library/dom` development dependency; that dependency and the npm lockfile were corrected without changing the website design or content. See **SOURCE_IMPORT.md** for the import manifest and correction.

Verification on the GitHub runner: clean `npm ci`, **19 tests passed**, and `npm run build` passed with `dist/index.html`, security headers and all local assets. [Successful import/build run](https://github.com/EthanSharpNZ/jeanie-calder-website/actions/runs/38241057497). A live Cloudflare deployment has not yet been verified.

## Local development and testing

Use **Node.js 22** and npm. Keep `.npmrc` and `package-lock.json`; `legacy-peer-deps=true` is required for this dependency tree.

```sh
npm ci
npm test
npm run dev
```

The development environment retains TanStack Start. The shared page is `src/components/author-website.tsx`; its interactions need no server functions.

## Portable static build

```sh
npm ci
npm run build
npm run preview
```

The build uses ordinary Vite/React through `vite.static.config.ts`, `static.html` and `src/static-entry.tsx`. Output is **dist**, including **dist/index.html**. The static output excludes the TanStack server and editor error reporting. It needs no runtime secrets or backend services. `npm run build:lovable` is the separate editor build and is **not** the Cloudflare build command.

## Cloudflare Pages — final settings

These settings supersede the earlier Lovable-to-GitHub connection instructions and automatic-install suggestion in the historical handover notes.

Cloudflare dashboard → **Workers & Pages → Create application → Pages → Connect to Git**. Select **EthanSharpNZ/jeanie-calder-website**. Grant Cloudflare access to this repository only.

| Setting | Value |
| --- | --- |
| Suggested project name | `jeanie-calder-preview` |
| Framework preset | **None** |
| Production branch | `main` |
| Root directory | Leave blank (repository root) |
| Build command | `npm ci && npm run build` |
| Build output directory | `dist` |
| Environment variable | `NODE_VERSION=22` |
| Environment variable | `SKIP_DEPENDENCY_INSTALL=1` |

Set both build variables for production and preview environments. These are configuration values, not secrets. Explicit installation uses the tested npm lockfile rather than relying on package-manager auto-detection; the original `bun.lock` is retained for source completeness, not for this deployment.

Select **Save and Deploy**, review the generated `pages.dev` address, and leave the client domain unconnected until approvals are complete. No Worker, Function, API key, or separate form service is required.

Official references: [Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/) and [Node version / skipping automatic installation](https://developers.cloudflare.com/pages/configuration/build-image/).

## Media and preview safeguards

All nine approved images are ordinary repository-owned WebP files under `src/assets`. They are bundled locally; neither builds nor site visitors need the authenticated Lovable preview for media. Fonts are installed through Fontsource packages (Cormorant Garamond and DM Sans, SIL Open Font License); no standalone font binaries are included in this repository. No original stock MOV, publisher PDF, account credentials or chat history is included.

Retain **ASSET_CREDITS.md**. The fee photograph and the uploaded hero animation have separate licensing terms; only the fee-image adaptation is CC BY-SA. The hero animation's licence certificate must be retained privately before launch and has not been supplied in this handover.

The preview stays noindex through page metadata, `public/robots.txt` and `public/_headers`. Headers also set `nosniff` and Referrer-Policy. **Noindex is not password protection.** Client approval of copy, fees, publication/purchase details and contact terms is still required. See **HANDOVER.md** for those outstanding approvals. The site has not yet been verified in Safari/Firefox or on Cloudflare's live hosting.
