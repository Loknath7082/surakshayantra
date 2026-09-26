# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Unit 05 implementation (in progress)

## Current Goal

- Implement Unit 05 — Homepage.

## Completed

- `context/project-overview.md` — complete
- `context/architecture-context.md` — complete
- `context/code-standards.md` — complete
- `context/ai-workflow-rules.md` — complete
- `context/ui-context.md` — complete
- Unit 01 — Design System + Tokens + System States — complete
- Unit 02 — System States — complete
- Unit 03 — Database + Domain Models — complete
	- Added `prisma/schema.prisma`, `lib/env.ts`, `lib/prisma.ts`, and the `init-domain-models` migration.
	- Added `prisma@6.19.3`, `@prisma/client@6.19.3`, and `zod@4.6.5`.
	- Added the required PostgreSQL datasource, domain enums, models, explicit relations, unique constraints, and restricted foreign keys.
	- Verification passed: `npx tsc --noEmit`, `npm run lint`, `npm run build`, and `npx prisma migrate status`.
- Unit 04 — Global Layout Shell — complete
	- Modified `app/layout.tsx` to async with cookie-based theme reading via `parseTheme`.
	- Created `app/(marketing)/layout.tsx` with Navbar, main (pt-16), and Footer.
	- Moved `app/page.tsx` to `app/(marketing)/page.tsx`; deleted root page.
	- Created `app/(marketing)/contact/page.tsx` stub.
	- Created `components/shared/container.tsx`, `navbar.tsx`, `footer.tsx`, `nav-mobile-menu.tsx`, `theme-toggle.tsx`, `uptime-indicator.tsx`.
	- Created `lib/theme.ts` (Theme type, parseTheme, constants) and `lib/nav-links.ts` (8 marketing links).
	- Added shadcn `sheet` component. Fixed sheet.tsx imports for project paths.
	- Theme toggle uses `useSyncExternalStore` + MutationObserver (no setState-in-effect).
	- Verification passed: `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Unit 05 — Homepage — complete
	- Created `components/marketing/hero.tsx` with single h1, subtitle, glow overlay, and dual CTAs.
	- Created `components/marketing/services-overview.tsx` with 5 service cards (VAPT, Web App, Mobile, API, Network) using Lucide icons.
	- Created `components/marketing/methodology-preview.tsx` with 5 steps, continuous connecting lines on desktop (`hidden lg:flex`) and vertical timeline on mobile (`lg:hidden`).
	- Created `components/marketing/trust-indicators.tsx` with 4 OWASP/industry alignment statements and success checkmarks.
	- Created `components/marketing/closing-cta.tsx` with assessment CTA.
	- Updated `app/(marketing)/page.tsx` to compose all five sections in order as Server Components.
	- Verification passed: `npx tsc --noEmit`, `npm run lint`, `npm run build`.

## In Progress

- Awaiting CodeRabbit review for Unit 05 PR on `feat/05-homepage`.

## Next Up

- Verify Unit 05, commit and push the feature branch, create a PR targeting `development`, then wait for CodeRabbit review.

> **Note:** `context/feature-specs/01-*.md` does not exist yet. Do not start, plan, or implement Unit 01 until that spec file is authored. If the spec is missing at start time, stop and ask — do not invent scope.

## Open Questions

- None

## Architecture Decisions

- **Stack locked:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui (New York), Clerk (email/password + Google + GitHub), Prisma + PostgreSQL, Vercel deployment.
- **CMS content storage:** Blog/Case Study content JSON and CMS images stored in Vercel Blob; PostgreSQL stores only metadata and `contentPath`. `lib/blob.ts` is the single access point for all blob operations. CMS uploads/deletes are ADMIN-only.
- **Phase 2 reserved:** Trigger.dev (background tasks) and request-flow file uploads (NDA, network diagrams) — not installed in Phase 1.
- **Roles:** `CLIENT`, `EMPLOYEE`, `ADMIN` (uppercase DB enum, string literal union in TS).
- **Request status enum:** defined in `architecture-context.md` → Storage Model. That file is the single source of truth; do not redefine status values here.
- **Middleware filename:** `proxy.ts` (Next.js 16 requirement — not `middleware.ts`).
- **Server Actions:** not used. All mutations via route handlers in `app/api/`.
- **Client-owned data** scoped at the query level by authenticated user ID.
- **No client-side-only authorization** — all role and permission checks enforced server-side.
- **Theme:** Dark + Light with toggle; Dark is the visual flagship.
- **Entry point file:** `AGENTS.md` at project root (referenced in every feature spec).

## Session Notes

- Unit 03 implementation is on `feat/03-database-domain-models`; migration `init-domain-models` applied successfully. TypeScript, lint, and production build pass.
- Unit 02 PR review: documented all six new system-state functions for docstring coverage.
- Context files are being authored before any code is written — strictly following the Six-File Context System.
- `context/feature-specs/` folder will hold numbered spec files (`01-*.md`, `02-*.md`, etc.). No spec files exist yet.
- Every unit follows the standard flow: read spec → mark IN PROGRESS → implement → verify → commit → push feature branch → PR → CodeRabbit → merge to `development` → release to `main`.
- CodeRabbit configured — auto-review on development PRs enabled via `.coderabbit.yaml`.
- Branch protection: development requires PR + CodeRabbit review.
- Git is not yet initialized; will be set up during project initialization. `development` branch will be created from `main` at that time.
- No invariants from `architecture-context.md` may be violated at any point.
- Human-approved Phase 1 scope change: Vercel Blob moved from Phase 2 reserved to Phase 1 in-scope for Blog/Case Study content JSON and CMS images. Request-flow file uploads (NDA, network diagrams) remain Phase 2.
- Spec to author next (after Unit 01): CMS blob storage feature spec. Filename/number TBD — do not lock the number in context files.

## Future Enhancements / Backlog

- Automatic PDF security reports (Phase 2)
- Online payment gateway (Phase 2)
- Vercel Blob file uploads — NDA, network diagrams (Phase 2)
- AI-generated security reports (Phase 2)
- Trigger.dev background task infrastructure (Phase 2)
- In-app messaging / comments between client and admin (Phase 2)
- Team management under company accounts (Phase 2)
- Trust Center + Live Compliance Dashboard (Phase 2)
- MFA (Phase 2)
- Webinars (Phase 2)
- Newsletter signup (Phase 2)
- SLAs page or section (Phase 2)
- Admin-managed job listings on Careers page (Phase 2)
- Internal roles: Pentester, Marketing, Super Admin (Phase 2)
- Client Admin / Client Viewer split (Phase 2)
- Request assignment to specific employee (Phase 2)
- External status page integration (Phase 2)
- "Download Sample Report" email gate + gated PDF assets (Phase 2)

---