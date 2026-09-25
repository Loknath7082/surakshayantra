# Unit 02: System States

## Goal

Create branded system-state UI: a 404 page, a 500 error page,
a global loading UI, and three reusable shared components
(Skeleton, Spinner, EmptyState) that all future UI units will
reuse. No business logic. No data fetching.

## Design

- All pages use a full-viewport centered layout with the text
  wordmark "Surakshayantra" as the brand mark, a short message,
  and a support link (`mailto:support@surakshayantra.com`).
- Text wordmark uses `text-primary` token and the largest
  heading size from Tailwind's default scale.
- Support link uses `text-accent-primary` with underline on hover.
- All visuals use tokens from `ui-context.md` — no raw hex,
  no arbitrary Tailwind values, no `[var(--...)]` in className.
- Dark theme active (Unit 01 hardcodes `dark` on `<html>`).
- Skeleton pulse uses `bg-elevated` token.
- Spinner uses Lucide `Loader2` with `animate-spin`, colored
  `text-accent-primary`.
- Empty state: centered stack — icon slot (lucide), heading,
  description, optional CTA slot.

## Implementation

### 1. `components/shared/skeleton.tsx`

Single reusable `Skeleton` component.

Props (`SkeletonProps`):
- `width?: string` — any valid CSS width, default `"100%"`
- `height?: string` — any valid CSS height, default `"1rem"`
- `variant?: "line" | "circle" | "rect"` — default `"rect"`
  - `line`: `rounded-sm`
  - `circle`: `rounded-full`
  - `rect`: `rounded-md`
- `className?: string` — merged via `cn()`

Rendering: `<div>` with `bg-elevated`, `animate-pulse`,
inline `style={{ width, height }}`, variant-based radius class,
and merged className.

### 2. `components/shared/spinner.tsx`

Props (`SpinnerProps`):
- `size?: "sm" | "md" | "lg"` — default `"md"`
  - `sm`: `h-4 w-4`
  - `md`: `h-5 w-5`
  - `lg`: `h-6 w-6`
- `className?: string` — merged via `cn()`

Renders Lucide `Loader2` with `animate-spin` and
`text-accent-primary`. Inherits currentColor otherwise.
Add `role="status"` and `aria-label="Loading"` for accessibility.

### 3. `components/shared/empty-state.tsx`

Props (`EmptyStateProps`):
- `icon?: LucideIcon` — optional icon component
- `title: string` — required heading
- `description?: string` — optional body text
- `action?: React.ReactNode` — optional CTA slot (typically a Button)
- `className?: string` — merged via `cn()`

Renders a centered vertical stack:
- Icon (if provided): `h-6 w-6`, `text-fg-muted`
- Title: heading-sized, `text-primary`
- Description: `text-muted`
- Action: rendered below if provided

No business-specific copy — the component is generic.
Actual copy ("No active tests", etc.) is injected by callers
in later units.

### 4. `app/not-found.tsx`

Server Component.

Full-viewport centered layout (`min-h-screen flex items-center justify-center`):
- Text wordmark "Surakshayantra"
- Heading: "Page not found"
- Short message: "The page you're looking for doesn't exist or has been moved."
- Support link: `mailto:support@surakshayantra.com` — "Contact support"

Uses tokens: `bg-base`, `text-primary`, `text-muted`, `text-accent-primary`.

### 5. `app/error.tsx`

Client Component (`"use client"` — required by Next.js error boundary).

Props: `{ error: Error & { digest?: string }; reset: () => void }`.

Full-viewport centered layout:
- Text wordmark "Surakshayantra"
- Heading: "Something went wrong"
- Short message: "An unexpected error occurred. Please try again."
- Two actions:
  - "Try again" button → calls `reset()`
  - Support link: `mailto:support@surakshayantra.com`

Does not log `error` to console in production (per `code-standards.md`
— Pino wrapper is added in a later unit).

### 6. `app/loading.tsx`

Server Component.

Minimal global loading UI:
- Full-viewport centered
- Uses the shared `Skeleton` component
- Renders three stacked skeleton bars:
  - Width `8rem`, height `1rem`, variant `line`
  - Width `12rem`, height `1rem`, variant `line`
  - Width `16rem`, height `1rem`, variant `line`

No spinner here — loading.tsx is a static fallback for route
transitions, Skeleton is the correct primitive.

## Dependencies

No new packages. All dependencies (`lucide-react`, `clsx`,
`tailwind-merge`) are installed in Unit 01.

## Verify when done

- [ ] `components/shared/skeleton.tsx` — exports `Skeleton`, typed props, uses `bg-elevated` + `animate-pulse`
- [ ] `components/shared/spinner.tsx` — exports `Spinner`, typed props, uses Lucide `Loader2` + `text-accent-primary`
- [ ] `components/shared/empty-state.tsx` — exports `EmptyState`, typed props, generic (no business copy)
- [ ] `app/not-found.tsx` — renders 404 with wordmark + support link
- [ ] `app/error.tsx` — is a client component, has working reset button, support link
- [ ] `app/loading.tsx` — uses shared `Skeleton`, no spinner
- [ ] No raw hex values anywhere
- [ ] No arbitrary Tailwind values (e.g. `text-[#fff]`, `p-[13px]`)
- [ ] No `bg-[var(--...)]` in any className
- [ ] All components have `ComponentNameProps` type block
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] No invariant from `context/architecture-context.md` is violated
