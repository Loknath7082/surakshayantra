# Unit 04: Global Layout Shell

## Goal

Build the marketing layout shell — root layout with cookie-based theme handling, a logged-out marketing layout wrapping a fixed navbar and multi-column footer, a reusable 1280px Container, a Sun/Moon theme toggle that persists to a `theme` cookie with no FOUC, and a `/contact` stub page — so all future marketing pages render inside a consistent shell.

## Design

- Route structure:
  - `app/layout.tsx` — `<html>`, `<body>`, cookie read for theme, single `<html className>` set. No navbar/footer here.
  - `app/(marketing)/layout.tsx` — navbar + main + footer. Only marketing pages inherit this.
  - Portal and admin will have independent layouts in later units and must not inherit the marketing shell.
- Navbar: fixed top, height `64px` (`h-16`), bottom border `--border-default`, z-index via `z-navbar` token (not arbitrary).
- Container: max-width `1280px` (`max-w-7xl`), horizontal padding `px-4` mobile → `md:px-8` desktop.
- Theme: cookie `theme` with values `dark` | `light`. Default `dark` when cookie is absent. Never use `prefers-color-scheme`.
- FOUC prevention: root layout reads the cookie server-side (async `cookies()` in Next.js 16) and sets the `<html>` class on the server-rendered HTML. No inline `<script>` is added in this unit — server-rendered class is sufficient because every theme-dependent visual is Tailwind-class-based. If a hydration mismatch or transition flash is observed during verification, a minimal inline script may be added as a documented follow-up, not as a default.
- Theme toggle behavior:
  - Client Component, marked `"use client"`.
  - Reads current theme from `document.documentElement.classList` or the `theme` cookie.
  - On click: flips the theme, writes the cookie (`path=/; max-age=31536000; SameSite=Lax`), and updates the `<html>` class immediately.
  - No `router.refresh()` is used in Unit 04 — all theme-dependent rendering is class-based, so a route refresh is not required. If a future unit introduces server-rendered theme branching, it may add a refresh at that time.
- Tokens: use only utilities generated from `ui-context.md` tokens. No raw hex, no arbitrary values, no raw `var(--…)` in class names.
- Navbar is logged-out only. Logged-in variant is Unit 05.
- All CTA links to `/sign-in` and `/sign-up` target routes that do not exist yet — they are future Unit 05 routes. Do not create stub pages for them in Unit 04.
- Uptime indicator is static and non-clickable.
- No `proxy.ts` is created in Unit 04.

## Implementation

### `app/layout.tsx` (modify)

- Make the component async.
- Import `cookies` from `next/headers`.
- Read `theme` cookie: `(await cookies()).get("theme")?.value`.
- Validate against `"dark" | "light"`. Fall back to `"dark"` if missing or invalid.
- Set `<html lang="en" className={theme === "light" ? "light" : "dark"}>` (or `className={theme}` directly — the dark class must be present by default).
- Set `<html suppressHydrationWarning>` only if required to silence legitimate SSR/client class differences. Prefer not to add it unless verification shows a mismatch.
- Import global styles and the font variables already configured in Unit 01.
- Do not add navbar, footer, or any marketing-specific markup.

### `app/(marketing)/layout.tsx` (create)

- Renders `<Navbar />`, `<main>` with top padding to offset the fixed navbar (`pt-16`), and `<Footer />`.
- `<main>` wraps `{children}`.
- No auth checks, no role logic, no data fetching.

### `app/(marketing)/page.tsx` (move)

- If `app/page.tsx` exists from the initial Next.js setup, move it to `app/(marketing)/page.tsx` so that `/` inherits the marketing shell. Do not change its content.
- If `app/page.tsx` does not exist, create a minimal placeholder inside `app/(marketing)/page.tsx` wrapped in `<Container>` with a single heading. Homepage content is a future unit.
- URL for `/` must not change.

### `app/(marketing)/contact/page.tsx` (create)

- Stub page. No form, no data fetching, no mutations.
- Renders a single section inside `<Container>`:
  - Heading: `Contact`
  - Short paragraph: `Contact form coming soon.`
- Ready to be replaced in Unit 14.

### `components/shared/container.tsx` (create)

- Server Component.
- Props: `type ContainerProps = { children: React.ReactNode; className?: string }`.
- Renders `<div className={cn("mx-auto w-full max-w-7xl px-4 md:px-8", className)}>{children}</div>`.
- `max-w-7xl` maps to 1280px in Tailwind's default scale — no arbitrary values.
- No other behavior.

### `components/shared/navbar.tsx` (create)

- Server Component (no interactivity itself).
- Fixed top bar: `fixed top-0 inset-x-0 z-navbar h-16 border-b border-border-default bg-bg-surface`.
- Inside: `<Container>` with a flex row.
- Left: text wordmark `Surakshayantra` using `text-fg-primary` and a font weight from the defined scale. No image asset.
- Center (desktop only, hidden below `md`): marketing links in this exact order:
  - `Home` → `/`
  - `Services` → `/services`
  - `Methodology` → `/methodology`
  - `Learning` → `/learning`
  - `About` → `/about`
  - `Careers` → `/careers`
  - `Responsible Disclosure` → `/responsible-disclosure`
  - `Contact` → `/contact`
- Right (desktop only):
  - `<ThemeToggle />`
  - `Sign In` → `/sign-in`, shadcn `Button` variant `ghost`
  - `Get Started` → `/sign-up`, shadcn `Button` variant `default`
- Mobile (below `md`):
  - `<ThemeToggle />`
  - A hamburger button (lucide `Menu` icon) that opens the mobile menu component.
- Active-link styling for the current route uses `text-accent-primary` and may be computed from `usePathname` in the mobile menu client component. Desktop active-link state is out of scope for Unit 04 unless implemented without additional client components — do not add a client wrapper just for active styling.
- No auth state is read.

### `components/shared/nav-mobile-menu.tsx` (create)

- Client Component (`"use client"`).
- Renders the mobile menu trigger and content.
- Uses shadcn `Sheet` (added via `npx shadcn@latest add sheet`) — do not hand-roll a dialog.
- Contents: the same eight marketing links, then `Sign In` (ghost) and `Get Started` (default) buttons.
- Closes on link click.
- Uses `usePathname` from `next/navigation` to highlight the current link.

### `components/shared/theme-toggle.tsx` (create)

- Client Component.
- Button (shadcn `Button`, variant `ghost`, size `icon`).
- Icon: `Sun` when current theme is dark, `Moon` when current theme is light. Both from `lucide-react` with `h-5 w-5` and `currentColor`.
- `aria-label` toggles between `Switch to light theme` and `Switch to dark theme`.
- On click:
  1. Determine the next theme by reading `document.documentElement.classList.contains("dark")`.
  2. Toggle the `dark` class on `document.documentElement`.
  3. Write `document.cookie = "theme=<next>; path=/; max-age=31536000; SameSite=Lax"`.
- Do not use `next-themes`.
- Do not call `router.refresh()`.
- Do not use `localStorage`.

### `components/shared/footer.tsx` (create)

- Server Component.
- Multi-column layout on desktop, stacked on mobile. Uses `<Container>`.
- Columns (exact):

  **Services:**
  - `VAPT` → `/services/vapt`
  - `Web App Testing` → `/services/web-app`
  - `Mobile Testing` → `/services/mobile`
  - `API Testing` → `/services/api`
  - `Network Testing` → `/services/network`

  **Legal:**
  - `Privacy Policy` → `/privacy`
  - `Terms of Service` → `/terms`
  - `PGP Key` → `/pgp-key`
  - `Responsible Disclosure` → `/responsible-disclosure`

  **Contact:**
  - `support@surakshayantra.com` (`mailto:` link)

- Bottom strip: copyright line (`© {year} Surakshayantra. All rights reserved.`), three social icon placeholders (LinkedIn, Twitter/X, GitHub — lucide icons, `href="#"` until a future unit wires real URLs), and `<UptimeIndicator />` on the right.
- Uses only token-based utilities.

### `components/shared/uptime-indicator.tsx` (create)

- Server Component.
- Renders a green dot (`bg-state-success` on an `h-2 w-2 rounded-full` span) followed by the text `All systems operational`.
- Text uses `text-fg-muted` at the default small size.
- Non-clickable, no `href`, no `onClick`, no state.

### `lib/theme.ts` (create)

- Exports:
  - `type Theme = "dark" | "light"`.
  - `const DEFAULT_THEME: Theme = "dark"`.
  - `const THEME_COOKIE = "theme"`.
  - `const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365`.
  - `function parseTheme(value: string | undefined): Theme` — returns `"light"` if value is exactly `"light"`, otherwise returns `DEFAULT_THEME`.
- No React, no Next.js imports. Pure helpers only.

### `lib/nav-links.ts` (create)

- Exports the eight marketing link objects `{ label, href }` used by both `Navbar` and `NavMobileMenu`.
- Single source of truth for the marketing link list in this unit.
- No React imports.

## Dependencies

- `sheet` — shadcn/ui component added via `npx shadcn@latest add sheet`. Backed by `@radix-ui/react-dialog`, which is already a transitive dependency of the installed `dialog` component, so no new npm package is expected. If the CLI adds `@radix-ui/react-dialog` explicitly to `package.json`, that is acceptable and within this unit's scope.
- No other npm packages.
- No new icon packages — `lucide-react` is already installed.

## Verify when done

- [ ] `app/layout.tsx` is async, reads the `theme` cookie via `next/headers`, and sets the `<html>` class to `dark` or `light`.
- [ ] `app/layout.tsx` defaults to `dark` when the cookie is missing or invalid.
- [ ] `app/layout.tsx` does not import or render navbar, footer, or marketing components.
- [ ] `app/(marketing)/layout.tsx` exists and renders `Navbar`, a `<main>` with top padding for the fixed navbar, and `Footer`.
- [ ] `/` renders inside the marketing shell (i.e. `app/(marketing)/page.tsx` exists and `app/page.tsx` no longer exists at the root).
- [ ] `/contact` renders a stub inside the marketing shell with a heading and the "Contact form coming soon." paragraph.
- [ ] `components/shared/container.tsx` uses `max-w-7xl` and `px-4 md:px-8`, accepts `children` and optional `className`, and merges classes with `cn()`.
- [ ] `components/shared/navbar.tsx` is fixed at top, height `h-16`, bottom border uses `border-border-default`, background uses `bg-bg-surface`, z-index uses the `z-navbar` utility (no arbitrary z-index).
- [ ] Navbar renders text wordmark `Surakshayantra` — no image asset.
- [ ] Navbar renders the eight marketing links in the exact order: `Home, Services, Methodology, Learning, About, Careers, Responsible Disclosure, Contact`.
- [ ] Navbar renders `<ThemeToggle />`, a `Sign In` ghost button linking to `/sign-in`, and a `Get Started` default button linking to `/sign-up`.
- [ ] Navbar does not read auth state and does not render a logged-in variant.
- [ ] `components/shared/nav-mobile-menu.tsx` is a Client Component using shadcn `Sheet`.
- [ ] Mobile menu closes on link click and highlights the current route via `usePathname`.
- [ ] `components/shared/theme-toggle.tsx` is a Client Component using lucide `Sun`/`Moon` icons sized `h-5 w-5`.
- [ ] Theme toggle flips the `dark` class on `document.documentElement` and writes `theme=dark|light` to a cookie with `path=/`, `max-age=31536000`, `SameSite=Lax`.
- [ ] Theme toggle does not use `next-themes`, `localStorage`, or `router.refresh()`.
- [ ] Theme toggle has a correct `aria-label` for both states.
- [ ] `components/shared/footer.tsx` renders three columns (`Services`, `Legal`, `Contact`) with the exact links listed above.
- [ ] Footer's `Contact` column uses `mailto:support@surakshayantra.com` and no phone number.
- [ ] Footer bottom strip contains the copyright line, three social icon placeholders with `href="#"`, and `<UptimeIndicator />`.
- [ ] `components/shared/uptime-indicator.tsx` renders a green dot (`bg-state-success`) and the text `All systems operational`, non-clickable.
- [ ] `lib/theme.ts` exports `Theme`, `DEFAULT_THEME`, `THEME_COOKIE`, `THEME_COOKIE_MAX_AGE`, and `parseTheme`.
- [ ] `lib/nav-links.ts` exports the eight marketing link objects and is the single source of truth used by `Navbar` and `NavMobileMenu`.
- [ ] No `proxy.ts` and no `middleware.ts` are created in this unit.
- [ ] No `/sign-in` or `/sign-up` pages are created in this unit.
- [ ] No route under `app/(portal)/` or `app/(admin)/` is created in this unit.
- [ ] No raw hex colors, no arbitrary Tailwind values, no `bg-[var(--…)]` classes are introduced.
- [ ] No `use client` is added to any component that does not require browser APIs, state, or event handlers.
- [ ] Refreshing `/` with `theme=dark` cookie paints dark on first paint with no FOUC.
- [ ] Refreshing `/` with `theme=light` cookie paints light on first paint with no FOUC.
- [ ] Toggling the theme updates the cookie, updates the `<html>` class, and persists across a full page reload.
- [ ] Navbar renders correctly at mobile width (< 768px) with the hamburger trigger visible and marketing links hidden.
- [ ] No TypeScript errors (`npx tsc --noEmit` or `npm run typecheck`).
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] `context/progress-tracker.md` is updated with Unit 04 status and details. 