# Code Standards

## General

- Keep modules small and single-purpose; one responsibility per file and per function.
- Fix root causes, do not layer workarounds on top of existing issues.
- Do not mix unrelated concerns in one component, route, or helper.
- Security is enforced server-side, always — never trust the client for auth, role, or ownership checks.
- Use `async/await` throughout. Avoid `.then()` chains.
- Use Pino via a small shared logging wrapper for structured logs. Never scatter `console.log` in application code.
- Use conventional commit messages: `feat:`, `fix:`, `refactor:`, `chore:`.
- Tests are required for critical business logic, validation, authorization, and security-sensitive code. Use Vitest for unit/integration and Playwright for E2E. Do not use Jest.

## TypeScript

- Strict mode is enabled project-wide; never disable it per-file.
- No `any`. Use `unknown` with proper narrowing when the shape is genuinely unknown.
- Avoid unsafe type assertions (`as`); prefer runtime narrowing or Zod parsing.
- Type all function parameters and return values explicitly where inference is not sufficient.
- Prefer `type` over `interface`; use `interface` only when extension or declaration merging is actually needed.
- Use string literal unions for application-level enums, e.g. `type Role = "CLIENT" | "EMPLOYEE" | "ADMIN"`. Prisma enums remain the source of truth for database values.
- Define a `type ComponentNameProps = { ... }` block above each component that accepts props. Do not create empty props types.
- Define a reusable generic `ApiResponse<T>` type in `lib/` and use it consistently across all route handlers.
  - Shape: `{ success: boolean; data: T | null; error: { message: string; code?: string; fieldErrors?: Record<string, string[]> } | null }`
- Centralize environment variables in `lib/env.ts` and validate them with Zod at startup. Never access `process.env.X` directly elsewhere.

## Next.js

- Default to Server Components. Add `"use client"` only when the component requires browser APIs, state, effects, or event handlers.
- Server Components fetch data directly through `lib/` data-access helpers using Prisma. Never `fetch()` our own internal API routes from a Server Component.
- Use Route Handlers only (`app/api/*`). Do not use Server Actions.
- Keep each route handler focused on a single responsibility.
- All mutations flow through `app/api/` route handlers. No direct database writes from client components.
- Use ISR / `revalidate` for public Blog and Case Studies pages. Choose revalidate periods per route based on data requirements — do not force everything static or everything dynamic.
- Next.js 16 requires `proxy.ts` for Clerk middleware. Do not create `middleware.ts`.
- Do not edit `components/ui/` (vendored shadcn/ui) unless a spec explicitly says so. Extend via wrappers.
- Loading, empty, and error states must reuse shared components from `components/shared/` — no one-off inline variants.

## Styling

- Use design tokens defined in `ui-context.md` — no raw hex colors anywhere.
- No arbitrary Tailwind values (e.g. `text-[#123456]`, `p-[13px]`).
- Follow the border radius scale and typography scale defined in `ui-context.md`.
- Reference tokens through Tailwind utility names, not inline styles.
- Design tokens are defined as CSS variables in `ui-context.md` and must be mapped into the Tailwind theme (e.g., via `tailwind.config.ts` or the `@theme` directive) so they are available as Tailwind utility classes. Do not use raw CSS variables in class names; use the generated utilities.

## API Routes

- Every route handler follows the same order:
  1. Authentication check (Clerk session)
  2. Authorization / role check
  3. Zod validation / parse of body, params, and query
  4. Database operation
  5. Envelope response `{ success, data, error }` with an appropriate HTTP status code
- CMS media upload routes follow this order: authentication → role check (`ADMIN`) → Zod validation (MIME, size, metadata) → blob upload via `lib/blob.ts` → database write → envelope response.
- Intentionally public routes may skip steps 1 and 2.
- Use a shared `handleApiError()` helper for consistent error responses — do not duplicate try/catch response logic across routes.
  - Signature: `handleApiError(error: unknown): NextResponse<ApiResponse<null>>` — inspects the error and returns the full HTTP response (body + status).
  - Maps known errors to the correct HTTP status: Zod validation → 400, authentication failure → 401, forbidden → 403, not found → 404, unexpected → 500.
  - Never exposes internal, server, database, or stack details. Unexpected errors fall back to a generic 500 message.
- Return the shared `ApiResponse<T>` shape from every handler.
- Validate and sanitize all untrusted input with Zod before any database operation. Never trust client-side validation alone.
- User-facing error messages are specific and friendly (including Zod field errors), but never expose internal, server, database, or security details. Use a shared error-message map where useful.
- Never send sensitive data (full user records, internal notes, unrelated rows) to the client.

## Data and Storage

- Use Prisma with explicit `select` by default. Return full rows only when there is a deliberate reason.
- Client-owned data is always scoped at the query level by the authenticated user's ID — never filtered after fetch.
- Public read operations (Blog, Case Studies) filter by `status = PUBLISHED`.
- Validate all payloads with Zod on the server before database access.
- Migrations use `prisma migrate dev --name <kebab-case-description>` (e.g. `add-security-request-model`).
- Phase 1 stores structured application data in PostgreSQL (Prisma Postgres). Blog/Case Study content JSON and CMS images live in Vercel Blob; PostgreSQL stores only metadata and `contentPath`.
- All blob operations go through `lib/blob.ts`; no direct `@vercel/blob` imports in routes or components. `@vercel/blob` is explicitly allowed as a dependency for the CMS blob feature.
- Never store binary data (base64 images, files) in PostgreSQL or inside content JSON. Content JSON stores only blob URLs inline as TipTap `image.attrs.src`.
- Validate file type, extension, size, and MIME server-side before upload; never trust client `file.type`.
- Randomize uploaded blob pathnames; sanitize original filenames; never use raw client filenames in paths.
- Deleting a Blog Post or Case Study must cascade-delete its content JSON blob and associated CMS image blobs.
- Trigger.dev background tasks and request-flow file uploads (NDA, network diagrams) remain reserved for Phase 2 — do not install or reference them in Phase 1.
- Never render untrusted HTML directly. Sanitize user-generated content before rendering.
- Forms use React Hook Form + Zod when meaningful validation logic exists. Simple forms may use plain controlled inputs, but server-side Zod validation is still required.

## File Organization

- `app/(marketing)/` — Public marketing pages only; no auth required; read-only; no mutations
- `app/(portal)/` — Client portal pages; Clerk-protected; client-scoped data only
- `app/(admin)/` — Admin backend pages; Clerk-protected and role-gated to `ADMIN` or `EMPLOYEE`
- `app/api/` — All mutation endpoints; every route enforces server-side auth and role checks
- `app/api/admin/media/` — CMS image upload/delete; ADMIN-only
- `components/ui/` — Vendored shadcn/ui primitives; extend via wrappers, not edits
- `components/marketing/`, `components/portal/`, `components/admin/` — Feature-scoped UI
- `components/shared/` — Cross-cutting UI (navbar, footer, empty states, loaders)
- `lib/` — Shared helpers only (`prisma.ts`, `env.ts`, `auth.ts`, `blob.ts`, plural-named data-access modules, `utils.ts`)
- `lib/validations/` — Centralized Zod schemas (not colocated with routes or components); includes `media.ts` for CMS upload validation
- `prisma/` — Schema and model files; migrations
- `context/` — Six-file context system; agent reads this first every session
- `context/feature-specs/` — One feature spec file per build unit
- `proxy.ts` — Clerk middleware entry point (Next.js 16 requires this filename) 