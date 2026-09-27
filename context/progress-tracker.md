# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Unit 11 — Auth Pages (in progress)

## Current Goal

- Implement custom `/sign-in` and `/sign-up` auth pages, OTP verification, and SSO callback per `context/feature-specs/11-auth-pages.md`.

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
- Unit 06 — Services + Service Detail — complete
	- Created `lib/services-data.ts` (pure data module defining 5 services, `ServiceIconName`, `ServiceContent`, `getServiceBySlug`, `getAllServiceSlugs`).
	- Created `lib/service-icons.ts` (maps `ServiceIconName` to Lucide icon components without React imports in data layer).
	- Created `app/(marketing)/services/page.tsx` (services listing page with centered heading and 2-column card grid).
	- Created `app/(marketing)/services/[slug]/page.tsx` (dynamic detail page composing Breadcrumb, Hero with glow, Overview, Scope, Methodology, Deliverables, and Bottom CTA; `generateStaticParams`, `generateMetadata`, and `notFound()` handling).
	- Verification passed: `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Unit 07 — Static Content Pages + Contact Shell — complete
	- Created `lib/static-pages/types.ts` defining `StaticPageHero`, `StaticPageSection`, and `LegalSection`.
	- Created 8 data files in `lib/static-pages/` (`about`, `careers`, `methodology`, `responsible-disclosure`, `privacy`, `terms`, `pgp-key`, `contact`) and re-exported via `lib/static-pages/index.ts` with zero React/Next.js imports.
	- Created reusable UI components `components/marketing/page-hero.tsx`, `sections-body.tsx`, and `legal-page-body.tsx`.
	- Implemented 7 static marketing pages (`about`, `careers`, `methodology`, `responsible-disclosure`, `privacy`, `terms`, `pgp-key`) with consistent metadata, hero sections, and typography.
	- Implemented `app/(marketing)/contact/page.tsx` with email support card and upcoming form placeholder.
	- Verification passed: `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Unit 08 — Clerk Auth Foundation + Shared Helpers — complete
	- Installed `@clerk/nextjs`, `pino`, `thread-stream`, `pino-pretty`, `vitest`, `vite`.
	- Extended `lib/env.ts` with `server-only`, Clerk env validation, relative URL rules, and fallback `LOG_LEVEL` parsing.
	- Created `lib/logger.ts` with Pino instance, single-level sensitive key redaction, and conditional dev pretty-printing.
	- Created `lib/api-response.ts` (discriminated union for API responses) and `lib/errors.ts` (6 typed HTTP error classes).
	- Created `lib/api-error.ts` with `handleApiError` mapping Zod, custom errors, JSON syntax errors, and Prisma error codes.
	- Created `lib/return-to.ts` and 15 passing Vitest test cases in `lib/__tests__/return-to.test.ts`.
	- Created `lib/auth.ts` (`AuthResult`, `AuthUser`, `getCurrentUser`, `requireRole`).
	- Updated `proxy.ts` with `clerkMiddleware`, protected route redirection, inline URL validation, and exclude matcher.
	- Wrapped root `app/layout.tsx` in `<ClerkProvider>` with props from `lib/env.ts`.
	- Configured `serverExternalPackages` in `next.config.ts` and created `.env.example`.
	- Verification passed: `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run test`.
- Unit 09 — Disposable Email Pre-check — complete
	- Created `lib/disposable-emails.ts` with 20-domain list (sorted, lowercase, unique) and `isDisposableEmail()` domain parser.
	- Created `lib/validations/auth.ts` exporting `signupEmailSchema` and `SignupEmail` type.
	- Created `app/api/auth/validate-signup/route.ts` public POST endpoint returning `{ allowed: true }` or `400 DISPOSABLE_EMAIL`.
	- Created `test/setup.ts` mocking `server-only` and setting test environment variables; updated `vitest.config.ts` with `setupFiles`.
	- Created test suites `lib/__tests__/disposable-emails.test.ts` (12 tests) and `app/api/auth/__tests__/validate-signup.test.ts` (4 tests).
	- Verification passed: `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run test` (31/31 tests passing).
- Unit 10 — User Sync Webhook — complete
	- Added `svix@^1.40.0` to `package.json`.
	- Added `CLERK_WEBHOOK_SECRET` validation to `lib/env.ts`, `.env.example`, and `test/setup.ts`.
	- Created `app/api/webhooks/clerk/route.ts` with Svix webhook signature verification, shape guard, non-`user.created` event ignoring with logger, primary email extraction, and idempotent Prisma upsert with P2002 duplicate collision fallback.
	- Created `app/api/webhooks/clerk/__tests__/route.test.ts` with 10 comprehensive unit tests covering happy path, signature errors, payload validation, missing primary email, logger verification, and P2002 race fallback.
	- Verification passed: `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run test` (41/41 tests passing across 4 suites).

- Unit 11 — Auth Pages — complete
	- Deleted stale `app/sign-in` and `app/sign-up` stubs and pinned `@clerk/nextjs` to stable legacy API (`^6.39.7`).
	- Installed `react-hook-form` and `@hookform/resolvers`.
	- Extended `lib/validations/auth.ts` with `signInSchema`, `signUpSchema`, `otpSchema`, and corresponding TypeScript types.
	- Created `components/auth/clerk-error-mapping.ts` mapping Clerk API errors to React Hook Form fields with fallback to form-level error.
	- Created `components/auth/auth-layout.tsx` two-panel responsive container with brand values, semantic tags, and mode-based headers.
	- Created `components/auth/oauth-buttons.tsx` for Google and GitHub OAuth redirects using Lucide icons.
	- Created `components/auth/otp-verify-form.tsx` for 6-digit numeric email verification with auto-submit.
	- Created `components/auth/sign-in-form.tsx` and `components/auth/sign-up-form.tsx` with credentials authentication, disposable email pre-check validation, MFA/OTP step transitions, and Clerk API error handling.
	- Created Server Component pages `app/(auth)/sign-in/[[...sign-in]]/page.tsx` and `app/(auth)/sign-up/[[...sign-up]]/page.tsx` with `searchParams` validation, self-referential redirect protection, and authenticated user redirection to `/portal`.
	- Created Client Component page `app/sso-callback/page.tsx` with `<AuthenticateWithRedirectCallback />` in Suspense boundary.
	- Created unit test suites `lib/__tests__/validations-auth.test.ts` (12 tests) and `components/auth/__tests__/clerk-error-mapping.test.ts` (6 tests).
	- Verification passed: `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run test` (61/61 tests passing across 6 suites).

## In Progress

- Awaiting CodeRabbit review for Unit 11 PR on `feat/11-auth-pages`.

## Next Up

- Merge Unit 11 PR after CodeRabbit review.

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

- Admin-editable site content (services, headings, CTA labels, trust text) — needs Prisma model + admin routes + migration of `lib/services-data.ts` to DB.
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