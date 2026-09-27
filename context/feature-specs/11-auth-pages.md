
# Unit 11: Auth Pages

## Goal

Build custom `/sign-in` and `/sign-up` pages with email+password forms (plus Google + GitHub OAuth), wire the Unit 09 `validate-signup` pre-check before `signUp.create()`, and include the OTP email-verification step.

## Design

- Two-panel layout on `lg+`: left = wordmark, tagline, short text-only feature list; right = centered form. Below `lg` = form only (left panel `hidden lg:flex`).
- Left panel content: wordmark `surakshayantra`; tagline `Security testing, professionally delivered.`; features: `VAPT, Web, Mobile, API, and Network testing`, `Role-scoped client portal`, `Server-side authorization on every request`. Heading above tagline differs by `mode`: `Welcome back` (sign-in) / `Get started` (sign-up).
- Theme via root layout's `<html className>` (Unit 04 cookie reader). Custom forms use app Tailwind tokens — no `@clerk/themes`, no `baseTheme`.
- No gradients, no oversized heroes, no feature cards.
- Already-authenticated users visiting `/sign-in` or `/sign-up` redirect to `validateReturnTo(searchParams.returnTo) ?? '/portal'`, with self-referential guard.

## Implementation

### Pre-implementation — MANDATORY
1. **Delete** these two files (added in PR #12, commit `f5e752d`):
   - `app/sign-in/[[...sign-in]]/page.tsx`
   - `app/sign-up/[[...sign-up]]/page.tsx`
   Next.js build fails with parallel-route error if they remain alongside `app/(auth)/` route group. Not conditional — these files exist.
2. **Verify Clerk dashboard settings**:
   - User & Authentication → Email, Phone, Username: `username`, `first_name`, `last_name` must NOT be required. If any is required, add it to `signUpSchema` and `signUp.create` payload.
   - Multi-factor → Email verification code must be enabled. If disabled, the OTP-during-sign-in path is dead code.
3. **Pin `@clerk/nextjs` version** in `package.json` (e.g., `^5.7.0`). Use the legacy API throughout this spec (`prepareEmailAddressVerification`, `attemptEmailAddressVerification`, `attemptSecondFactor`). Do NOT use Clerk v6 "future" API. If the project later migrates to v6 future API, revise the spec.

### package.json
Add `react-hook-form`, `@hookform/resolvers`. Pin `@clerk/nextjs` to the current installed version (see Pre-implementation step 3).

### components/auth/auth-layout.tsx
Props: `{ children; mode: 'sign-in' | 'sign-up' }`. Two-panel shell using `Container` from `@/components/shared/container` (match existing export style — named or default). Left panel `hidden lg:flex`. Left content uses semantic markup: `<h2>` for heading, `<p>` for tagline, `<ul><li>` for features. `mode` controls only the heading text (`Welcome back` / `Get started`). Rendered at page level, not from a shared layout.

### app/(auth)/sign-in/[[...sign-in]]/page.tsx
Server Component. Type props as `{ searchParams: Promise<{ returnTo?: string | string[] }> }`. Inside:
```ts
const { userId } = await auth();
const params = await searchParams;
const raw = typeof params.returnTo === 'string' ? params.returnTo : null;
let returnTo = validateReturnTo(raw);
if (returnTo === '/sign-in' || returnTo === '/sign-up') returnTo = null;
if (userId) redirect(returnTo ?? '/portal');
```
`export const metadata = { title: 'Sign in — surakshayantra' }`. Renders `<AuthLayout mode="sign-in"><Suspense fallback={<div className="h-64" aria-hidden />}><SignInForm returnTo={returnTo} /></Suspense></AuthLayout>`.

### app/(auth)/sign-up/[[...sign-up]]/page.tsx
Same shape with `mode="sign-up"`, matching metadata, same `searchParams` await + `typeof` guard + self-referential guard.

### app/sso-callback/page.tsx
**Outside the `(auth)` group**. Client Component. Renders `<Suspense fallback={<div className="h-64" aria-hidden />}><AuthenticateWithRedirectCallback /></Suspense>`.

### components/auth/oauth-buttons.tsx
`"use client"`. Props: `{ returnTo: string | null; onError: (message: string) => void }`. `const { signIn, isLoaded } = useSignIn(); if (!isLoaded) return null;`. Local state: `const [loading, setLoading] = useState<'google' | 'github' | null>(null);`.

Each button:
```tsx
<button
  type="button"
  disabled={loading !== null}
  onClick={async () => {
    setLoading('google'); // or 'github'
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google', // or 'oauth_github'
        redirectUrl: '/sso-callback',
        redirectUrlComplete: returnTo ?? '/portal',
      });
    } catch {
      onError('Could not start OAuth. Please try again.');
      setLoading(null);
    }
  }}
/>
```
Lucide `Chrome`, `Github` at `h-4 w-4`.

### components/auth/sign-in-form.tsx
`"use client"`. Props: `{ returnTo: string | null }`. State:
```ts
const [step, setStep] = useState<'form' | 'otp'>('form');
const [formError, setFormError] = useState<string | null>(null);
```
`const { signIn, setActive, isLoaded } = useSignIn(); if (!isLoaded) return <div className="h-64" aria-hidden />;`. RHF + `zodResolver(signInSchema)`. Fields: email (`autoComplete="email"`), password (`autoComplete="current-password"`).

Form-level error rendered once above the submit button:
```tsx
{formError && <p role="alert" className="text-sm text-state-error">{formError}</p>}
```

`OAuthButtons` rendered above the form with `onError={setFormError}`.

If `step === 'otp'`, render:
```tsx
<OtpVerifyForm
  returnTo={returnTo}
  onVerify={(code) =>
    signIn.attemptSecondFactor({ strategy: 'email_code', code }).then((r) => ({
      status: r.status,
      createdSessionId: r.createdSessionId ?? null,
    }))
  }
  onSuccess={async (sid) => {
    await setActive({ session: sid });
    router.push(returnTo ?? '/portal');
    router.refresh();
  }}
/>
```

Otherwise the credentials form. Submit:
```ts
try {
  const result = await signIn.create({
    strategy: 'password',
    identifier: email,
    password,
  });
  if (result.status === 'complete' && result.createdSessionId) {
    await setActive({ session: result.createdSessionId });
    router.push(returnTo ?? '/portal');
    router.refresh();
  } else if (result.status === 'complete') {
    setFormError('Session could not be created. Please try again.');
  } else if (result.status === 'needs_second_factor') {
    const supportsEmailCode = result.supportedSecondFactors?.some(
      (f) => f.strategy === 'email_code',
    );
    if (supportsEmailCode) setStep('otp');
    else setFormError('Your account requires an MFA method not yet supported. Contact support.');
  } else if (result.status === 'needs_new_password') {
    setFormError('Password reset required. Please use the password reset link sent to your email.');
  } else if (result.status === 'needs_first_factor') {
    setFormError('Please verify your sign-in method. Contact support if this persists.');
  } else {
    setFormError(`Unexpected status: ${result.status}`);
  }
} catch (err) {
  if (isClerkAPIResponseError(err)) mapClerkErrors(err.errors, setError, setFormError);
  else setFormError('Something went wrong. Please try again.');
}
```

Submit button `disabled={isSubmitting}`; text `Signing in…` pending. Cross-link via Next.js `<Link>`:
```tsx
<Link href={`/sign-up${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`}>
  Don&apos;t have an account? Sign up
</Link>
```

### components/auth/sign-up-form.tsx
`"use client"`. Props: `{ returnTo: string | null }`. Same `step` and `formError` state pattern. `const { signUp, setActive, isLoaded } = useSignUp(); if (!isLoaded) return <div className="h-64" aria-hidden />;`. RHF + `zodResolver(signUpSchema)`. Fields: email (`autoComplete="email"`), password (`autoComplete="new-password"`), confirmPassword (`autoComplete="new-password"`). `OAuthButtons` with `onError={setFormError}`. Form-level error rendered once above submit.

If `step === 'otp'`, render `<OtpVerifyForm>` with:
```tsx
onVerify={(code) =>
  signUp.attemptEmailAddressVerification({ code }).then((r) => ({
    status: r.status,
    createdSessionId: r.createdSessionId ?? null,
  }))
}
onSuccess={async (sid) => {
  await setActive({ session: sid });
  router.push(returnTo ?? '/portal');
  router.refresh();
}}
```

Otherwise form. Submit:
1. Pre-check (exact shape):
```ts
try {
  const res = await fetch('/api/auth/validate-signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    setError('email', { message: json?.error?.message ?? 'Email rejected' });
    return;
  }
} catch {
  setFormError('Could not verify email. Please try again.');
  return;
}
```
2. `const result = await signUp.create({ strategy: 'password', emailAddress: email, password });`
3. Status handling:
   - `complete` AND `result.createdSessionId` → `await setActive({ session: result.createdSessionId }); router.push(returnTo ?? '/portal'); router.refresh();`
   - `complete` but no `createdSessionId` → `setFormError('Session could not be created. Please try again.')`
   - `missing_requirements` AND `result.unverifiedFields?.some((f) => f === 'email_address' || f === 'emailAddress')` → `await signUp.prepareEmailAddressVerification({ strategy: 'email_code' }); setStep('otp');`
   - `abandoned` → `setFormError('Sign-up session expired. Please try again.')`
   - else → `setFormError(\`Unexpected status: ${result.status}\`)`.
4. Catch → `isClerkAPIResponseError` mapping; else generic.

Same loading state. Cross-link via `<Link href={`/sign-in${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`}>`.

### components/auth/otp-verify-form.tsx
`"use client"`. Props:
```ts
{
  onVerify: (code: string) => Promise<{ status: string; createdSessionId: string | null }>;
  onSuccess: (sessionId: string) => Promise<void>;
  returnTo: string | null;
}
```
Single input with `inputMode="numeric"`, `autoComplete="one-time-code"`, `maxLength={6}`. `onChange` strips non-digits: `setValue('code', e.target.value.replace(/\D/g, '').slice(0, 6))`. Auto-submit on length 6 via `useEffect` guarded by a `hasSubmitted` ref.

Submit (explicit try/catch so thrown errors reset the flag):
```ts
try {
  const result = await onVerify(code);
  if (result.status === 'complete' && result.createdSessionId) {
    await onSuccess(result.createdSessionId);
  } else {
    hasSubmitted.current = false;
    setFormError(`Unexpected status: ${result.status}`);
  }
} catch (err) {
  hasSubmitted.current = false;
  if (isClerkAPIResponseError(err)) mapClerkErrors(err.errors, setError, setFormError);
  else setFormError('Something went wrong. Please try again.');
}
```

Form-level error rendered above the submit button. Submit button also present.

### components/auth/clerk-error-mapping.ts
Shared helper. `mapClerkErrors(errors, setError, setFormError)`:

```ts
const fieldMap: Record<string, string> = {
  identifier: 'email',
  email_address: 'email',
  password: 'password',
  code: 'code',
};
```

For each Clerk error, resolve RHF field via `fieldMap[error.meta?.paramName]`. Known codes:
- `form_identifier_not_found`, `form_identifier_exists`, `form_param_format_invalid`, `form_param_nil` → email field.
- `form_password_incorrect`, `form_password_pwned`, `form_password_length_too_short`, `form_password_validation_failed` → password field.
- `form_code_incorrect`, `verification_expired`, `verification_failed` → code field.
- Unmatched → `setFormError(error.message)`.

### lib/validations/auth.ts (extend)
- `signInSchema`: `email: z.string().trim().toLowerCase().pipe(z.email())`, `password: z.string().min(1, 'Password is required')` (legacy passwords may be shorter than 8; min 1 only).
- `signUpSchema`: same email rule; `password: z.string().min(8, 'Password must be at least 8 characters')`; `confirmPassword: z.string()`; `.refine(d => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] })`.
- `otpSchema`: `code: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code')` (input already strips non-digits on change).
- Export inferred types: `SignInInput`, `SignUpInput`, `OtpInput`.

### Accessibility
- Every input has `<label htmlFor>`.
- Field errors and form-level errors in `<p role="alert">` with `text-state-error`.
- OTP: `inputMode="numeric"`, `autoComplete="one-time-code"`.
- Email: `autoComplete="email"`. Password: `current-password` (sign-in) / `new-password` (sign-up).

### Imports reference
- `import Link from 'next/link'`.
- `import { useRouter } from 'next/navigation'`.
- `Loader` is NOT used anywhere — replaced with `<div className="h-64" aria-hidden />` for in-layout loading states. If a shared Loader component is preferred, verify it renders inline (not full-page) before using it.
- Container import from `@/components/shared/container` — match existing export style.
- `import { isClerkAPIResponseError } from '@clerk/nextjs/errors'`.
- `import { validateReturnTo } from '@/lib/return-to'`.

## Dependencies
`react-hook-form`, `@hookform/resolvers`. Pin `@clerk/nextjs` (see Pre-implementation step 3).

## Out of scope
- Password reset / forgot-password flow.
- TOTP / SMS / backup-code MFA.
- Playwright E2E tests.
- Custom Google "G" SVG (lucide `Chrome` used).
- Password visibility toggle.

## Verify when done
- [ ] `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx` deleted before route group created.
- [ ] Clerk dashboard verified: no required username/first_name/last_name; email_code MFA enabled.
- [ ] `@clerk/nextjs` pinned; legacy API used throughout (no v6 future API).
- [ ] Both auth pages type `searchParams` as `Promise<{ returnTo?: string | string[] }>` and `await searchParams`; `typeof` guard before `validateReturnTo`.
- [ ] Self-referential guard: `returnTo` cannot be `/sign-in` or `/sign-up`.
- [ ] No new `ClerkProvider`; no `app/(auth)/layout.tsx` — `AuthLayout` rendered at page level with correct `mode`.
- [ ] `app/sso-callback/page.tsx` outside `(auth)` group; `<AuthenticateWithRedirectCallback />` in `<Suspense>` with `<div className="h-64" aria-hidden />` fallback.
- [ ] `/sign-in` and `/sign-up` pages redirect authenticated users to `returnTo ?? '/portal'`.
- [ ] Both forms use `useState<'form' | 'otp'>` and render `<OtpVerifyForm>` when `step === 'otp'`.
- [ ] Sign-in submit: `signIn.create({ strategy: 'password', identifier, password })`; `complete` requires `createdSessionId`; missing → form error.
- [ ] Sign-up: validate-signup fetch with explicit method/headers/body and `res.ok && json.success` check; network failure handled; `signUp.create({ strategy: 'password', emailAddress, password })`; `unverifiedFields?.some(...)` optional chaining; `complete` requires `createdSessionId`.
- [ ] OTP submit wraps `onVerify` in try/catch; `hasSubmitted` reset on error; strict return type.
- [ ] `setActive` followed by `router.push(...)` AND `router.refresh()`.
- [ ] `isClerkAPIResponseError` in all catch blocks; `paramName` mapped (`identifier`/`email_address` → `email`).
- [ ] OAuth buttons `type="button"`, `disabled={loading !== null}`, `onClick` async with `await` inside try/catch; `onError` prop wired to `setFormError`.
- [ ] Cross-links use Next.js `<Link>` with `encodeURIComponent(returnTo)`.
- [ ] `isLoaded` guard renders `<div className="h-64" aria-hidden />` (not full-page `<Loader />`).
- [ ] Form-level error rendered via `{formError && <p role="alert" className="text-sm text-state-error">{formError}</p>}` in both forms and OTP form.
- [ ] No raw hex, no arbitrary Tailwind values, no `@clerk/themes`.
- [ ] `npx tsc --noEmit`, `npm run lint`, `npm run build`, `vitest run` all pass.
- [ ] No files outside the plan created, edited, or deleted (except the two mandatory deletions).
