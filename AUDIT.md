# Handover audit

Audit date: 15 October 2026. Scope: current source, dependencies, static production build, browser behaviour and hosting portability. This is an engineering audit, not a legal or accessibility certification.

## Findings and remediation

| Finding                                                                                              | Action                                                                          |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Legacy editor configuration, runtime error-reporting hooks and project identifier remained in source | Removed from the current project                                                |
| Unused server/router framework and large starter UI library                                          | Removed; retained React/Vite, the actual page, and three used UI primitives     |
| Mixed npm/Bun setup and peer-dependency workaround                                                   | Standardised on npm and one lockfile; removed the workaround                    |
| Obsolete handover described an editor-linked Pages deployment                                        | Replaced with static-host instructions and the existing Workers configuration   |
| Domain metadata tied to current host                                                                 | Added validated build-time SITE_URL override; existing default preserved        |
| Build output needs licence notices for bundled software/fonts                                        | Generate THIRD_PARTY_NOTICES.txt from runtime dependency licence files          |
| Contact form could be mistaken for direct submission                                                 | Existing draft/copy behaviour preserved and clearly documented                  |
| Old route-only test no longer described deployed website                                             | Removed with the unused router; retained meaningful browser/static-output tests |

## Validation record

Completed checks for this handover:

- Clean installation from the source package, TypeScript, ESLint, formatting and production build passed.
- All 17 unit tests and 8 Chromium browser tests passed, including layouts at 1440/1024/768/390/320 pixels. Automated accessibility scans found no violations in the tested states.
- npm dependency audit reported zero known vulnerabilities. There are 11 direct runtime dependencies.
- Builds were verified on Node 24.18 and Node 22. An isolated alternate-domain build correctly replaced the canonical, robots and sitemap origin; an invalid origin was rejected.
- Source, dependency lockfile and generated website were checked for legacy editor/runtime integration references. No Lovable or TanStack integration remains in these files.
- Read-only live checks confirmed initial HTML content, metadata, security headers, a real 404 for unknown paths and a responding publisher link. The live deployment was not changed.

The final local mobile Lighthouse run scored **96 performance, 100 accessibility, 100 best practices and 100 SEO**. First Contentful Paint was **1.8 seconds**, Largest Contentful Paint **2.6 seconds**, cumulative layout shift **0**, and total blocking time **90 milliseconds**. LCP remains slightly above the requested 2.5-second target in this run. These are simulated local lab results, not field measurements or a guarantee on the future host. Recheck after deployment with compression and caching configured.

Unused butterfly departure atlases are no longer downloaded, and animation loading is deferred until after the cover has loaded. Original artwork and animation source assets remain available for maintenance.

Browser checks cover full initial HTML, metadata, local assets, no-JavaScript content, hydration, keyboard navigation, programme selection, clipboard failure fallback, accessibility scanning, horizontal overflow, sticky-header butterfly clearance, settling and reduced motion. Automated mail sending is intentionally not performed.

## Remaining handover decisions

- Hosting platform, hosting account and any replacement domain are not confirmed. No production DNS or domain has been changed.
- The Web Guys must configure TLS, actual HTTP 404 responses and appropriate cache/security headers on their selected host. The portable preview is not evidence of those future host settings.
- Programme currency/GST, inclusions, schedules, delivery and terms remain client content questions. Approved fees and copy are retained.
- Original asset permission was confirmed by the owner; private licence certificates must be passed to the agency separately.
- Direct form submission, analytics, CMS and payments are not part of the delivered implementation.
- Safari and Firefox are not covered by the Chromium browser suite. Real-device checks and email-client testing remain recommended at hosting acceptance.
- Do not interpret a successful automated audit as a guaranteed external rating or field Core Web Vitals result. Old lab scores from a prior release are not asserted for this build.

## Release status

The owner approved publishing this cleanup and the handover documents to GitHub main on 15 October 2026. The existing Cloudflare Git integration may deploy that update. Moving hosting or changing the production domain remains a separate approval. Earlier approved website releases remain in Git history.
