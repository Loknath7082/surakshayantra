# Unit 08: Clerk Auth Foundation + Shared Helpers

## Goal

Install and configure Clerk, create `proxy.ts` for session-only route protection, extend `lib/env.ts` with Clerk variables, and implement shared server-side helpers: `ApiResponse<T>`, `handleApiError()`, `lib/auth.ts`, `lib/return-to.ts`, and a Pino logging wrapper.

## Design

- No visual components. Infrastructure and server-side logic only.
- `proxy.ts` uses `clerkMiddleware` and redirects unauthenticated users from `/portal/*` and `/admin/*` to the sign-in URL with a relative `returnTo` query parameter. No DB queries, no role checks — session/redirect only, per `architecture-context.md`.
- `returnTo` is a same-origin relative path. `validateReturnTo` decodes once, rejects surviving percent-encoding, control characters, backslashes, any `//`, fragments, and `.`/`..` segments; returns the original input on success.
- Root layout wraps the entire `<html>` in `<ClerkProvider>`.
- Design tokens unchanged; no new styles.

## Implementation

### package.json
Add runtime deps `@clerk/nextjs`, `pino`, `thread-stream`; dev deps `pino-pretty`, `vitest`. Add script `"test": "vitest run"`.

### vitest.config.ts
Create at root with default test config and `environment: 'node'`.

### lib/env.ts
Add `import 'server-only'`. Validate `CLERK_SECRET_KEY` (`.min(1)`), `DATABASE_URL` (`.min(1)`), `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (`.min(1)`), `NEXT_PUBLIC_CLERK_SIGN_IN_URL` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL` (`.min(1).startsWith('/')` plus a `.refine()` rejecting `//` and `/\` prefixes, with defaults `/sign-in` and `/sign-up`), and `LOG_LEVEL` (enum `fatal | error | warn | info | debug | trace`, `.default('info').catch(() => { console.warn(...); return 'info'; })`). Export a single `env` object. Add comment: `// Keep same-origin check in sync with proxy.ts inline validation.`

### lib/logger.ts
Add `import 'server-only'`; use `env.LOG_LEVEL`. Use `pino-pretty` transport only in development, guarded by `typeof require !== 'undefined'` plus `require.resolve('pino-pretty')`. Redact `password`, `passwordHash`, `token`, `accessToken`, `refreshToken`, `idToken`, `cookie`, `authorization`, plus their `*.` nested forms. Add one comment noting Pino redaction covers one nesting level only.

### lib/api-response.ts
Type-only. Export `ApiError` (`message`, `code?`, `fieldErrors?`) and `ApiResponse<T>` as a discriminated union where success and error are mutually exclusive.

### lib/errors.ts
Define `type ErrorStatus = 400 | 401 | 403 | 404 | 500`. Classes: `AuthenticationError` (401), `ForbiddenError` (403), `NotFoundError` (404), `ValidationError` (400, with `fieldErrors?`), `ProvisioningError` (403), `ProgrammerError` (500). Each extends `Error`, sets `this.name`, calls `Object.setPrototypeOf(this, new.target.prototype)`, and carries `status: ErrorStatus`.

### lib/api-error.ts
Add `import 'server-only'`. `handleApiError(error: unknown): NextResponse<ApiResponse<null>>` maps: `ZodError` → 400 with `fieldErrors` (filter `undefined`); `ValidationError` → 400; `AuthenticationError` → 401; `ForbiddenError`/`ProvisioningError` → 403; `NotFoundError` → 404; `SyntaxError` matching `/JSON/i` → 400; Prisma `error.name === 'PrismaClientKnownRequestError'` (`P2025` → 404, `P2002` → 409, `P2003` → 400); `PrismaClientValidationError` → 400; `ProgrammerError` → 500 (logged); unknown → 500 generic + `logger.error`.

### lib/return-to.ts
`validateReturnTo(value): string | null`. Reject length > 2048, malformed `decodeURIComponent`, surviving `/%[0-9a-f]{2}/i`, control characters (`\x00-\x1F`, `\x7F`), `\`, `#`, leading `//`, any `//` in decoded path, `.`/`..` segments, and anything not starting with `/`. Return original input on success.

### lib/__tests__/return-to.test.ts
Vitest cases: accept `/portal/requests`; reject `https://evil.com`, `//evil.com`, `/\evil.com`, `/foo\bar`, `/%5Cevil.com`, `/%2F%2Fevil.com`, `/%255Cevil.com`, `/%00`, `/%0A`, `/%ZZ`, `/portal/../admin`, `/portal/%2e%2e/admin`, `/portal#section`.

### lib/auth.ts
Add `import 'server-only'`. Export `AuthResult` union (`authenticated` with `user` | `unauthenticated` | `unprovisioned`) and `AuthUser = Pick<User, 'id' | 'clerkId' | 'email' | 'role' | 'createdAt' | 'updatedAt'>`. `getCurrentUser()` awaits `auth()`, returns `unauthenticated` if no `userId`, queries Prisma with explicit `select`, returns `unprovisioned` if no row. `requireRole(allowedRoles)` throws `ProgrammerError` on empty array; maps `unauthenticated` → `AuthenticationError`, `unprovisioned` → `ProvisioningError`, role mismatch → `ForbiddenError`. Comment: Server Components catch `AuthenticationError` → `redirect('/sign-in')`; `ForbiddenError`/`ProvisioningError` → 403 UI or `notFound()`; direct route-handler callers must return 403 for `unprovisioned`, not 401.

### app/layout.tsx
Import `@/lib/env` at module scope to trigger startup validation. Wrap the entire `<html>` in `<ClerkProvider>` with `publishableKey`, `signInUrl`, `signUpUrl` props from `env`. Keep theme cookie logic unchanged.

### proxy.ts
Imports: `clerkMiddleware` from `@clerk/nextjs/server`, `NextResponse` from `next/server`. Do not import `lib/env.ts` or any `server-only` module — `server-only` throws outside the RSC graph and proxy runs in a non-RSC bundle. Inline sign-in URL validation with a keep-in-sync comment referencing `lib/env.ts`, using `||` fallback (not `??`). Protected path test: `pathname === '/portal' || startsWith('/portal/') || pathname === '/admin' || startsWith('/admin/')`. On missing `userId`, redirect to `new URL(signInPath, req.url)` with `returnTo = pathname + search`. Comment: `// Not a security boundary. Every /portal and /admin page and every /api/portal, /api/admin route handler MUST call requireRole().` Default-export `clerkMiddleware(...)`; provide `config.matcher` excluding `_next` and static assets.

### next.config.ts
Add `serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream']`. Env validation runs at server startup via `app/layout.tsx`; build-time env validation is not required for this unit.

### .env.example
Required: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `DATABASE_URL`. Optional with defaults: `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`, `LOG_LEVEL=info`.

## Dependencies
- Runtime: `@clerk/nextjs`, `pino`, `thread-stream`
- Dev: `pino-pretty`, `vitest`

## Out of scope
- Sign-in / sign-up pages (Unit 09); role-based middleware; user sync webhook; UI components or styles.

## Verify when done
- [ ] `lib/env.ts` validates all six Clerk/env vars plus `LOG_LEVEL`; has `server-only`; imported by `app/layout.tsx`.
- [ ] Sign-in/up URLs reject `//evil.com` and `/\evil.com`; `LOG_LEVEL` warns only when a value is present but invalid.
- [ ] `proxy.ts` imports no `server-only` module; uses inline same-origin validation with a keep-in-sync comment; uses `||` fallback.
- [ ] `lib/logger.ts` guards `pino-pretty` with `typeof require !== 'undefined'` and dev-only; redaction covers top-level and `*.` nested forms.
- [ ] `ApiResponse<T>` is a discriminated union; `lib/api-response.ts` is type-only.
- [ ] `lib/errors.ts` uses `ErrorStatus` union; `handleApiError` maps Zod, custom auth errors, JSON-parse `SyntaxError`, `PrismaClientValidationError`, and Prisma P2002/P2003/P2025.
- [ ] `validateReturnTo` returns the original input and passes all listed cases in `vitest run`.
- [ ] `getCurrentUser` returns `AuthResult`; `requireRole` maps each status correctly; 403 (not 401) for direct `unprovisioned` callers.
- [ ] Root layout wraps the whole `<html>` in `<ClerkProvider>` with validated public props; theme cookie logic unchanged.
- [ ] `proxy.ts` is default-exported, contains the security warning comment, imports no Pino/Prisma/`lib/auth.ts`/`lib/env.ts`.
- [ ] `next.config.ts` `serverExternalPackages` set; `package.json` has `test` script and vitest/pino-pretty devDeps; `vitest.config.ts` exists; `.env.example` lists required vs optional with defaults.
- [ ] No files outside the plan were created, edited, or deleted.