# Repository workflow

GitHub is the source of truth. Preserve published history and the approved design. Deploy only approved updates; do not change the production domain without explicit approval.

## Architecture

- Use standard React, TypeScript and Vite. There is no editor platform, server framework or runtime backend.
- `npm run build` generates complete HTML and local assets into `dist`. Browser hydration provides optional interactions. Never deploy `dist-ssr` or source files.
- Keep media local and preserve approved masters. Keep programme data and enquiry encoding in `src/lib/author-content.ts`.
- Keep the custom enquiry composer as a draft/copy flow unless the owner authorizes a sending service.
- Use accessible Radix navigation and selection controls; preserve keyboard support and reduced-motion behaviour.
- Preserve sticky-header clearance and responsive behaviour. Automatic butterfly motion must settle in under five seconds without a pause control.
- Hosting is portable. Use build-time `SITE_URL` only for an approved domain migration; retain the current default origin until then.
- Run typecheck, lint, unit tests and build after structural changes; run relevant browser checks. Keep handover and audit documentation accurate.
