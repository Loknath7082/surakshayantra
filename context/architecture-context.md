# Architecture Context

## Stack

| Layer           | Technology                     | Role                                                    |
| --------------- | ------------------------------ | ------------------------------------------------------- |
| Framework       | Next.js 16 (App Router)        | Routing, server components, API routes, SSR/ISR         |
| UI Runtime      | React 19                       | Component rendering and client interactivity            |
| Language        | TypeScript (strict)            | Type safety across the codebase                         |
| Styling         | Tailwind CSS                   | Utility-first styling                                   |
| UI Components   | shadcn/ui (New York)           | Base component library (vendored in repo)               |
| Icons           | lucide-react                   | Stroke-based icon system                                |
| Authentication  | Clerk                          | Sign up, sign in, session management, route protection  |
| Middleware      | `proxy.ts` (Next.js 16)        | Clerk session handling and route protection only; no DB role checks |
| ORM             | Prisma                         | Schema, migrations, type-safe database queries          |
| Database        | PostgreSQL (Prisma Postgres)   | Persistent storage for metadata, ownership, relationships |
| Blob Storage    | Vercel Blob                    | Blog/Case Study content JSON + CMS images               |
| Validation      | Zod                            | Server-side and form validation                         |
| Forms           | React Hook Form + Zod          | Forms with meaningful validation logic                  |
| Logging         | Pino (shared wrapper)          | Structured logging                                      |
| Testing         | Vitest + Playwright            | Unit/integration and E2E tests                          |
| Deployment      | Vercel                         | Hosting, CI/CD, preview and production environments     |

**Reserved for Phase 2 — do not install or reference in Phase 1 code:**
- Trigger.dev — background tasks (long-running jobs)

## System Boundaries

- `app/(marketing)/` — Public marketing pages only; no auth required; read-only; no mutations
- `app/(portal)/` — Client portal pages; Clerk-protected; client-scoped data only
- `app/(admin)/` — Clerk-protected via `proxy.ts`; role-gated to `ADMIN` or `EMPLOYEE` in Server Components/route handlers
- `app/api/` — All mutation endpoints; every route enforces server-side auth and role checks
- `app/api/admin/media/` — CMS image upload/delete; ADMIN-only
- `app/sign-in/`, `app/sign-up/` — Clerk authentication pages
- `app/not-found.tsx`, `app/error.tsx` — Branded 404 and 500 system pages
- `components/ui/` — Vendored shadcn/ui primitives; not edited without explicit instruction
- `components/marketing/`, `components/portal/`, `components/admin/` — Feature-scoped UI
- `components/shared/` — Cross-cutting UI (navbar, footer, empty states, loaders)
- `lib/` — Shared helpers only (`prisma.ts`, `env.ts`, `auth.ts`, `blob.ts`, plural-named data-access modules, `utils.ts`)
- `lib/validations/` — Centralized Zod schemas (not colocated with routes or components)
- `prisma/` — Schema and model files; migrations
- `context/` — Six-file context system; agent reads this first every session
- `context/feature-specs/` — One feature spec file per build unit
- `proxy.ts` — Clerk middleware entry point (Next.js 16 requires this filename); session/redirect only, no DB role authorization

## Storage Model

- **PostgreSQL**:
  - Users (id, clerkId, email, role, timestamps) — role enum: `CLIENT` | `EMPLOYEE` | `ADMIN`
  - Security Requests (id, clientId, form fields, status, timestamps) — status enum: `PENDING` | `REVIEWING` | `APPROVED` | `REJECTED` | `IN_PROGRESS` | `COMPLETED` | `CANCELLED`
  - Contact Submissions (id, name, email, message, timestamp)
  - Blog Posts (id, title, slug, contentPath, status, authorId, publishedAt) — status: `DRAFT` | `PUBLISHED`
  - Case Studies (id, title, slug, contentPath, status, authorId, publishedAt) — status: `DRAFT` | `PUBLISHED`
- **Vercel Blob**:
  - Blog content JSON at `content/blog/{postId}.json` (overwritten on edit)
  - Case Study content JSON at `content/case-studies/{caseStudyId}.json` (overwritten on edit)
  - CMS images at `media/blog/{postId}/{random}.{ext}` or `media/case-studies/{caseStudyId}/{random}.{ext}`
  - `contentPath` in PostgreSQL references the JSON blob; CMS image URLs are stored inline inside the content JSON as TipTap `image.attrs.src`
  - `contentPath` is nullable; blob upload happens before the DB write that sets it
  - Deleting a Blog Post or Case Study requires cascading blob cleanup (content JSON + associated images)
  - Editing content that removes an image leaves an orphaned blob; orphan cleanup strategy is defined in the CMS blob feature spec
- **Blob access rule**: All blob operations (upload, fetch, delete) go through `lib/blob.ts`. No direct `@vercel/blob` calls outside this helper. The Vercel Blob read/write token is exposed as `BLOB_READ_WRITE_TOKEN` and validated in `lib/env.ts`.
- **Clerk (managed)**: Sessions, auth tokens, OAuth identities — never stored in our database
- **User sync**: Clerk `user.created` webhook at `app/api/webhooks/clerk/route.ts` creates the PostgreSQL User row with `role = CLIENT`; no other write path creates users
- **Not used in Phase 1**: File storage for request-flow attachments (NDA, network diagrams), caching layer, background job state, queue tables

## Auth and Access Model

- Every user signs in via Clerk using email/password, Google OAuth, or GitHub OAuth
- Disposable email blocking is enforced by Clerk's dashboard email restrictions.
  - **Hosted sign-up pages:** no extra code; Clerk blocks the email automatically.
  - **Custom sign-up form:** call `signUp.create` and handle Clerk's error for blocked emails. If a pre-check is required for UX, implement `app/api/auth/validate-signup/route.ts` and keep its blocklist in sync with Clerk's dashboard.
- MFA is disabled in Phase 1
- All `(portal)` and `(admin)` routes are session-protected by Clerk via `proxy.ts`; DB role authorization is enforced in Server Components/route handlers
- Unauthenticated access to a protected route redirects to sign-in with a `returnTo` parameter and returns the user to the original path after login
- Every authenticated user has a `role` field in the database: `CLIENT` (default) | `EMPLOYEE` | `ADMIN`
- Role is always read from the database on the server via `lib/auth.ts` (`getCurrentUser()` / `requireRole()`); never trusted from the client. All server-side role checks use these helpers.
- Clients can create requests and can only read or mutate their own requests and own profile
- Employees can read and update all customer requests; they cannot manage users, CMS content, or contact submissions
- Admins have full access to users, all requests, contact submissions, and CMS content
- CMS content JSON and images are written only by `ADMIN` via authenticated routes in `app/api/admin/`; all blob writes go through `lib/blob.ts`
- Public read operations (Blog, Case Studies) filter by `status = PUBLISHED` and require no auth

## Invariants

1. No client-side-only authorization — every role and permission check is enforced server-side in Server Components, route handlers, or both.
2. Every protected mutation is authorized server-side before any data is written; no route trusts a role, user ID, or ownership claim from the client.
3. Client-owned data is always scoped at the query level by the authenticated user's ID; a Client can never read or mutate another user's data.
4. Employees cannot manage users, CMS content, or system settings — their role grants request visibility and status updates only.
5. Only the `ADMIN` role can manage users, view contact submissions, and publish CMS content.
6. Prisma queries select only the fields the UI needs; full user records, internal notes, and unrelated rows are never sent to the browser.
7. All database writes go through route handlers in `app/api/`; no client component writes directly to the database.
8. `components/ui/` is treated as vendored — shadcn/ui primitives are extended via wrappers, not edited, unless a spec explicitly says so.
9. Next.js 16 requires `proxy.ts`; do not create `middleware.ts`. `proxy.ts` handles Clerk session/redirect only and must not perform DB role authorization.
10. Phase 1 scope is strict — no new feature, package, integration, or architectural layer may be introduced unless it is listed as in-scope in `context/project-overview.md`.
11. Blog/Case Study content JSON and CMS images live in Vercel Blob; PostgreSQL stores only metadata and `contentPath`. All blob operations go through `lib/blob.ts`. CMS media uploads and deletes are ADMIN-only, validated server-side (MIME + size), and cascade-delete the associated blobs when a post or case study is removed.