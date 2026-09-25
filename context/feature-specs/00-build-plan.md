# Surakshayantra — Final Build Plan (27 Units)

> Only change from previous 26-unit version: Unit 09 split into two units (Disposable Email Pre-check + User Sync Webhook). All other units shifted by +1 number. Disposable email spec now carries explicit public-route note.

---

## Dependency Graph

```
[01: Design System]
       │
       ├──► [02: System States]
       ├──► [03: Database + Domain Models]
       │
       └──► [04: Global Layout Shell + Theme Toggle]
                     │
                     ├──► [05: Homepage]
                     ├──► [06: Services + Service Detail]
                     └──► [07: Static Content Pages]

[03] + [04] ──► [08: Clerk Auth Foundation + Shared Helpers]
                     │
                     ├──► [09: Disposable Email Pre-check]
                     │
                     └──► [10: User Sync Webhook]
                              │
                              └──► [11: Auth Pages]      (also 09)
                                       │
                                       └──► [12: Logged-in Navbar Variant]

[03] + [07] + [08] ──► [13: Contact Submission Pipeline]

[08] + [09] ──► [14: Assessment Request Intake]
                     │
                     └──► [15: Client Portal Shell + Dashboard]
                              │
                              ├──► [16: My Requests List + Detail]
                              └──► [17: Client Profile Management]

[08] ──► [18: Admin Core Shell + Role Gate + Dashboard]
             │
             ├──► [19: Admin Request Processing Queue]   (also 14)
             ├──► [20: Admin User Administration]
             ├──► [21: Admin Contact Inbox]              (also 13)
             └──► [22: Vercel Blob Foundation + CMS Media Upload]
                      │
                      ├──► [23: CMS Blog]
                      │        │
                      │        └──► [25: Public Content Engine]
                      │
                      └──► [24: CMS Case Study]
                               │
                               └──► [25]

[01..25] ──► [26: System Polish] ──► [27: Deployment + CI/CD]
```

---

## Unit Specifications

### Unit 01 — Design System
**Builds:** Next.js 16 (App Router), TypeScript strict, Tailwind v4, shadcn/ui (New York), lucide-react, `lib/utils.ts` (`cn()`), all tokens from `ui-context.md` → `globals.css` (`@theme inline`, Light `:root` + Dark `.dark`), shadcn default vars mapped to project tokens, radius scale, Geist + JetBrains Mono, `<html className="dark">` hardcoded.
**Depends on:** None.

---

### Unit 02 — System States
**Builds:** `app/not-found.tsx` (404), `app/error.tsx` (500), shared skeleton + spinner + empty-state components in `components/shared/`.
**Depends on:** 01.

---

### Unit 03 — Database + Domain Models
**Builds:** Prisma + PostgreSQL, `lib/prisma.ts`, `lib/env.ts` (Zod, `DATABASE_URL`), models: `User` (role enum), `SecurityRequest` (7-value status enum), `ContactSubmission`, `BlogPost` (`contentPath?`, `status`, `authorId`, `publishedAt`), `CaseStudy` (same shape), initial migration.
**Depends on:** 01.
**Notes:** `contentPath` nullable. Content JSON lives in Vercel Blob — DB stores metadata + path only.

---

### Unit 04 — Global Layout Shell + Theme Toggle
**Builds:** Root layout shell, logged-out navbar (Logo · marketing links · theme toggle · Sign In · Get Started), global footer (Services / Legal / Contact + static uptime dot), Container (max 1280px), cookie-based theme persistence (`theme` cookie, dark default, no FOUC), `ThemeToggle` client component wired into navbar.
**Depends on:** 01, 02.

---

### Unit 05 — Homepage
**Builds:** Hero (headline, subheadline, primary "Request Assessment" CTA, secondary CTA), services overview grid, methodology preview, trust indicators, closing conversion section.
**Depends on:** 04.

---

### Unit 06 — Services + Service Detail
**Builds:** `/services` listing, `/services/[slug]` dynamic template (overview, scope, methodology, deliverables), service data source, CTA wiring.
**Depends on:** 04.

---

### Unit 07 — Static Content Pages
**Builds:** About, Careers, Methodology, Responsible Disclosure, Privacy Policy, Terms of Service, PGP Key. Shared static-page layout.
**Depends on:** 04.

---

### Unit 08 — Clerk Auth Foundation + Shared Helpers
**Builds:** Clerk install + config, `ClerkProvider` in root layout, `proxy.ts` (Next.js 16 filename — session/redirect only, no DB role check), `returnTo` validation helper, `lib/env.ts` extended with Clerk vars, `ApiResponse<T>` type, `handleApiError()`, `lib/auth.ts` (`getCurrentUser()`, `requireRole()`), Pino logging wrapper.
**Depends on:** 03, 04.
**Merge rationale:** shared helpers have no standalone visible result — they exist to serve auth-gated routes.

---

### Unit 09 — Disposable Email Pre-check
**Builds:** `app/api/auth/validate-signup/route.ts` — server-side disposable email check, called before `signUp.create`. Blocklist kept in sync with Clerk dashboard restrictions. `lib/validations/` schema for the endpoint payload. Zod validation.

**Public route note:** This route is intentionally public — it runs before any session exists. It **skips** steps 1 (auth check) and 2 (role check) of the standard route handler order per `code-standards.md`. Steps 3 (Zod validation), 4 (blocklist lookup), and 5 (`ApiResponse<T>` envelope) apply.

**Depends on:** 08.

**Notes:**
- Server-side only. Client cannot bypass.
- Clerk dashboard restrictions remain active as a second layer (defense in depth).
- Blocklist source and sync mechanism with Clerk dashboard defined in this spec.
- Split from old Unit 09 — webhook and pre-check are independent concerns.

---

### Unit 10 — User Sync Webhook
**Builds:** Clerk webhook `/api/webhooks/clerk/route.ts` — signature verification, `user.created` handler creates DB `User` row with `CLIENT` role. No other write path creates users.

**Public route note:** This route is called by Clerk's infrastructure, not by an authenticated user session — it **skips** steps 1 and 2 of the standard route handler order. Authentication is enforced via Clerk webhook signature verification, not via session. Steps 3 (Zod payload parse), 4 (DB write), and 5 (`ApiResponse<T>` envelope) apply.

**Depends on:** 08.
**Split rationale:** independent of Unit 09 — one prevents bad users from being created, the other syncs valid users to DB. Different system boundaries.

---

### Unit 11 — Auth Pages
**Builds:** `/sign-in` + `/sign-up` (two-panel, Clerk Dark theme base overridden via app tokens), `validate-signup` pre-check wired into the sign-up flow, minimal and professional, no gradients, no hero sections.
**Depends on:** 08, 09, 10.

---

### Unit 12 — Logged-in Navbar Variant
**Builds:** Auth-aware navbar (Logo · role-scoped links · theme toggle · profile menu · sign out). Role read via `getCurrentUser()`.
**Depends on:** 08, 11.

---

### Unit 13 — Contact Submission Pipeline
**Builds:** `/contact` page, React Hook Form + Zod, `POST /api/contact`, DB write to `ContactSubmission`, inline success/error, support email + optional phone.
**Depends on:** 03, 07, 08.

---

### Unit 14 — Assessment Request Intake
**Builds:** Auth gate on "Request Assessment" CTAs, minimal `(portal)/layout.tsx` (Clerk-protected wrapper only), single-page form at `/portal/requests/new`, `POST /api/requests`, corporate email restriction, DB write to `SecurityRequest`, success modal + redirect to `/portal`.
**Depends on:** 08, 09, 10.

---

### Unit 15 — Client Portal Shell + Dashboard
**Builds:** Full `(portal)` layout (sidebar + main), Client Dashboard (summary of client's requests by status). Client-owned data scoped by authenticated user ID at query level.
**Depends on:** 14.
**Split rationale:** shell + dashboard + list + detail = four concerns — kept shell separate.

---

### Unit 16 — My Requests List + Detail
**Builds:** `/portal/my-requests` list with status badges, `/portal/my-requests/[id]` detail view. Client-scoped.
**Depends on:** 15.

---

### Unit 17 — Client Profile Management
**Builds:** `/portal/profile` view + edit, `PATCH /api/portal/profile`, Zod validation.
**Depends on:** 15.

---

### Unit 18 — Admin Core Shell + Role Gate + Dashboard
**Builds:** `(admin)` layout shell, role guard (rejects `CLIENT` with 403 in Server Component/route handler), admin sidebar, dashboard metrics (pending requests, total users, unread contacts), empty states.
**Depends on:** 08.

---

### Unit 19 — Admin Request Processing Queue
**Builds:** `/admin/requests` queue with filters, detail panel, status updates across full enum, `PATCH /api/admin/requests/[id]`.
**Depends on:** 14, 18.

---

### Unit 20 — Admin User Administration
**Builds:** `/admin/users` directory, detail inspection, role mutation controls with self-demotion protection, suspension toggle, `PATCH /api/admin/users/[id]`.
**Depends on:** 18.
**Split rationale:** Users and Contacts are unrelated domains (`User` vs `ContactSubmission`) — merging violates "one system boundary per unit".

---

### Unit 21 — Admin Contact Inbox
**Builds:** `/admin/contacts` queue, list + detail view.
**Depends on:** 13, 18.

---

### Unit 22 — Vercel Blob Foundation + CMS Media Upload
**Builds:** `lib/blob.ts` (single access point — `uploadJson`, `fetchJson`, `deleteBlob`, `uploadImage`), `lib/env.ts` extended with `BLOB_READ_WRITE_TOKEN`, `lib/validations/media.ts` (MIME + size), path helpers (`content/blog/{id}.json`, `content/case-studies/{id}.json`, `media/blog/{id}/...`, `media/case-studies/{id}/...`), `app/api/admin/media/` upload + delete (ADMIN-only, randomized pathnames, sanitized filenames).
**Depends on:** 08, 18.
**Merge rationale:** blob helper has no standalone visible result — combined with its first consumer.

---

### Unit 23 — CMS Blog
**Builds:** `/admin/cms/blog`, TipTap editor (locked extensions: headings, bold, italic, lists, link, code block, blockquote, image), CRUD for `BlogPost`, TipTap JSON → Vercel Blob via `lib/blob.ts`, `contentPath` written to DB, inline images via Unit 22, `DRAFT` → `PUBLISHED` only, cascade blob cleanup on delete.
**Depends on:** 03, 22.

---

### Unit 24 — CMS Case Study
**Builds:** `/admin/cms/case-studies` — reuses editor + CMS patterns from Unit 23, CRUD for `CaseStudy`, same blob + lifecycle + cascade rules.
**Depends on:** 22, 23.
**Split rationale:** each resource has its own CRUD + blob + cascade verification surface.

---

### Unit 25 — Public Content Engine (Blog + Case Studies)
**Builds:** `/learning/blog` index + `[slug]` detail, `/learning/case-studies` index + `[slug]` detail, TipTap JSON fetched through `lib/blob.ts`, sanitized HTML/React rendering, filter `status = PUBLISHED`, ISR with per-route `revalidate`, SEO metadata.
**Depends on:** 07, 23, 24.
**Merge rationale:** Blog and Case Study share renderer, blob fetch, sanitization, ISR rules, layout template. Only route prefix differs.

---

### Unit 26 — System Polish
**Builds:** Global empty-states review, skeleton-loading review, decorative uptime dot finalized (static only), responsive checks across all pages, cross-page consistency.
**Depends on:** 01–25.

---

### Unit 27 — Deployment + CI/CD
**Builds:** Vercel project, production env vars (Clerk prod keys, Prisma prod URL, `BLOB_READ_WRITE_TOKEN`), `development` branch from `main`, branch protection, deploy workflow, production DB migration, end-to-end smoke test.
**Depends on:** 26.

---

## Open Questions

- **Before Unit 27:** Confirm production Clerk keys, Prisma prod DB URL, and Vercel Blob prod token are ready.

---

**Save as:** `context/feature-specs/00-build-plan.md`