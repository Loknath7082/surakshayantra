# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Project initialization (complete) → Unit 02 implementation (complete)

## Current Goal

- Complete Unit 02 — System States and prepare for PR review.

## Completed

- `context/project-overview.md` — complete
- `context/architecture-context.md` — complete
- `context/code-standards.md` — complete
- `context/ai-workflow-rules.md` — complete
- `context/ui-context.md` — complete
- Unit 01 — Design System + Tokens + System States — complete
- Unit 02 — System States — complete

## In Progress

- None.

## Next Up

- PR review for Unit 02 — System States
- Merge to `development` when CodeRabbit approval is received
- Pull `development` locally after merge

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