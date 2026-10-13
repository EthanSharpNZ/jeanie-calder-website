# Repository workflow

GitHub is the source of truth. Do not use Lovable or rewrite published Git history. Deploy only approved updates through the existing Cloudflare Worker; do not change the production domain.

## Architecture rules
- Keep the author experience in a shared browser-safe React component, consumed by both the existing TanStack preview route and the independent static entry, so hosting never needs the preview server.
- Use a separate standard Vite configuration for `npm run build` and output `dist/index.html`, because the team's Cloudflare Workers Static Assets deployment must contain no server runtime.
- Keep approved media as repository-owned files in src/assets imported as ordinary Vite assets, so external builds and visitors never depend on editor asset infrastructure.
- Keep programme information and pure enquiry encoding in one shared module with concrete rule tests, so displayed fees and contact selections stay consistent.
- Use Radix dialogs for mobile navigation, footer review notes and image credits, because focus trapping, Escape handling and focus return must be accessible.
- Keep supplied hero sprite playback in a browser-safe canvas module with a cover-relative DOM anchor and body portal below dialogs; one arrival persists as a perch across scrolling, with no departure, and CC fee-symbol imagery remains separate.
- Keep butterfly phase/timing/visibility decisions in a pure tested module and footer pause in shared page state, so offscreen/hidden/paused playback suspends without restarting arrival or rendering React at frame rate.
- Keep the transparent header in normal document flow and define typography through shared heading/supporting role tokens, so navigation never overlaps scrolled copy and portal controls share the page typography.
- Keep form data only in transient page/form state and launch drafts or user-requested clipboard writes, because this preview does not receive or store submissions.
- Keep programme selection in a reusable controlled Radix Select component using the shared Interest values, so keyboard access, portal positioning and enquiry preselection stay consistent.
