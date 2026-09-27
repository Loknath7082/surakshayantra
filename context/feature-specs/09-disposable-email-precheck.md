
# Unit 09: Disposable Email Pre-check

## Goal

Add a public API route that validates a signup email against a disposable-domain blocklist before `signUp.create`, plus a Zod schema, a shared blocklist module, and tests.

## Design

- Public unauthenticated route. Skips auth/role steps per `code-standards.md`; applies Zod validation, blocklist lookup, and `ApiResponse<T>` envelope.
- Exact domain match only — subdomains are not blocked. This route is a UX pre-check, not a security boundary; the authoritative block is Clerk dashboard restrictions.
- Blocked email returns `400` with `ApiResponse` error envelope.
- No UI, no styling changes.

## Implementation

### lib/disposable-emails.ts
Export `DISPOSABLE_DOMAINS: readonly string[]` with exactly these entries (lowercase, alphabetically sorted):

```
10minutemail.com
20minutemail.com
dispostable.com
fakeinbox.com
getnada.com
guerrillamail.com
maildrop.cc
mailinator.com
mailnesia.com
mintemail.com
mohmal.com
sharklasers.com
spamgourmet.com
tempinbox.com
tempmail.com
tempmail.net
throwawaymail.com
throwawaymail.net
trashmail.com
yopmail.com
```

Header comment:
```
// SYNC SOURCE: Clerk Dashboard → Restrictions → Disposable email domains
// Last synced: 2026-09-27
// Manual sync required. This is a UX pre-check only, NOT a security boundary.
// When Clerk adds new domains, mirror them here and update the date.
// All entries MUST be lowercase and alphabetically sorted.
```

Export `isDisposableEmail(email: string): boolean`. Lowercases input, extracts part after `@`, returns false if no `@` or empty domain, then exact membership check. Client-safe — no `server-only` import.

### lib/validations/auth.ts
New directory `lib/validations/` per `code-standards.md`. Export `signupEmailSchema` with a single `email` field: `z.string().trim().toLowerCase().pipe(z.email())`. Export inferred type as `SignupEmail`. Do NOT create `lib/validations/index.ts` (no barrel file); import directly.

### app/api/auth/validate-signup/route.ts
POST handler. Top-level try/catch wraps `await request.json()` (SyntaxError) and `signupEmailSchema.parse(body)` (ZodError); all errors routed through `handleApiError`. On disposable → 400 with `{ success: false, data: null, error: { message: "Disposable emails are not allowed", code: "DISPOSABLE_EMAIL" } }`. On allowed → 200 with `{ success: true, data: { allowed: true }, error: null }`. No auth or role check.

### test/setup.ts
New file. `vi.mock('server-only', () => ({}))`. Set test env vars: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dummy`, `CLERK_SECRET_KEY=sk_test_dummy`, `DATABASE_URL=postgres://test`, `LOG_LEVEL=silent`.

### vitest.config.ts (modify)
Add `setupFiles: ['./test/setup.ts']`.

### lib/__tests__/disposable-emails.test.ts
Vitest: `user@mailinator.com` → true; `USER@MAILINATOR.COM` → true; `user@gmail.com` → false; `user@sub.mailinator.com` → false (exact-only); `user@mailinator.com.evil.com` → false; `user+tag@mailinator.com` → true; `""` → false; `"user@"` → false; malformed without `@` → false. Plus: all `DISPOSABLE_DOMAINS` entries lowercase; no duplicates.

### app/api/auth/__tests__/validate-signup.test.ts
Vitest. Tests construct a `Request` via `new Request(url, { method: 'POST', body: JSON.stringify(...), headers: { 'Content-Type': 'application/json' } })` and call `POST(request)` directly. Four cases: empty body → 400; empty email → 400; disposable email → 400 with `code: "DISPOSABLE_EMAIL"`; allowed email → 200 with `data.allowed === true`.

## Dependencies
None (Vitest already present from Unit 08).

## Out of scope
- Rate limiting.
- Clerk sign-up page integration (Unit 10+).
- Subdomain blocking.
- Live sync with Clerk dashboard API.

## Verify when done
- [ ] `lib/disposable-emails.ts` exports the exact 20-entry list, all lowercase and alphabetically sorted, with the sync header comment.
- [ ] `isDisposableEmail` is case-insensitive, exact-domain-only, returns false for input without `@`, empty string, and empty domain.
- [ ] `lib/validations/auth.ts` uses `z.string().trim().toLowerCase().pipe(z.email())`; exports `SignupEmail`; no `index.ts`.
- [ ] Route try/catch wraps `request.json()` and `.parse()`; both route through `handleApiError`.
- [ ] Route returns 200 for allowed and 400 with `ApiResponse` error envelope for blocked.
- [ ] No auth or role check in the route.
- [ ] `test/setup.ts` mocks `server-only` and sets the four test env vars; `vitest.config.ts` includes `setupFiles`.
- [ ] All Vitest cases in both test files pass under `vitest run`.
- [ ] `npx tsc --noEmit`, `npm run lint`, `npm run build`, `vitest run` all pass.
- [ ] No files outside the plan created, edited, or deleted (modifications: `vitest.config.ts`; new: `test/setup.ts`).
```

