# UI Context

## Theme

Both Dark and Light themes with a user-facing toggle. Dark is the visual flagship — a technical cybersecurity workspace with near-black backgrounds, layered surfaces, and vivid accent colors. Light is a fully designed theme in its own right, not an inverted dark theme — softer glows, reduced particle intensity, subtle gradients, and cleaner shadows.

Brand personality: Technical & Precise (for developers and security users) + Trust & Enterprise (for business customers). The design must feel credible, engineering-grade, and audit-safe.

### Theme Persistence

- The active theme is stored in a cookie (`theme`, values `dark` | `light`) so Server Components can read it during SSR and render the correct theme on first paint — avoiding a flash of incorrect theme (FOUC).
- `localStorage` is **not** the source of truth; it is not available during SSR. A `localStorage` mirror may be used only as a client-side fallback, never as the primary store.
- The toggle writes the cookie (and refreshes the route if needed) and updates the DOM class on `<html>` (`dark` / `light`).
- If no cookie is present, default to `dark` (the visual flagship). Do not use `prefers-color-scheme` as a fallback — first visit is always Dark.

### Animation

All decorative animations are theme-aware.

- **Dark:** stronger glow, gradients, atmospheric particles, animated grids.
- **Light:** softer glow, reduced particle intensity, subtle gradients, cleaner shadows.
- **Functional animations** (hover, focus, transitions, status changes) remain consistent across themes.
- Never simply invert dark-mode animations for light mode — Light gets its own tuned treatment.

| Token    | Duration | Easing       |
| -------- | -------- | ------------ |
| `fast`   | 150ms    | `ease-out`   |
| `normal` | 250ms    | `ease-out`   |
| `slow`   | 400ms    | `ease-in-out`|

### Spacing

Use Tailwind CSS's default spacing scale. Do not introduce custom spacing values.

### Breakpoints

Use Tailwind CSS's default responsive breakpoints.

| Name | Min-width |
| ---- | --------- |
| `sm` | 640px     |
| `md` | 768px     |
| `lg` | 1024px    |
| `xl` | 1280px    |
| `2xl`| 1536px    |

### Shadows & Elevation

Theme-aware tokens. Dark uses restrained glow, Light uses clean classic depth.

| Token           | Dark                                    | Light                                    |
| --------------- | --------------------------------------- | ---------------------------------------- |
| `--shadow-sm`   | `0 1px 2px rgba(0,0,0,0.4)`             | `0 1px 2px rgba(15,23,42,0.06)`          |
| `--shadow-md`   | `0 4px 12px rgba(0,0,0,0.5)`            | `0 4px 12px rgba(15,23,42,0.08)`         |
| `--shadow-lg`   | `0 8px 24px rgba(0,0,0,0.6)`            | `0 8px 24px rgba(15,23,42,0.10)`         |
| `--shadow-glow-sm` | `0 0 8px rgba(59,130,246,0.15)`      | `0 0 8px rgba(37,99,235,0.10)`           |
| `--shadow-glow-md` | `0 0 20px rgba(59,130,246,0.25)`     | `0 0 20px rgba(37,99,235,0.15)`          |

### Gradients

Theme-aware tokens. Dark uses stronger brand gradients; Light uses softer, more subtle gradients.

| Token                 | Dark                                                             | Light                                                            |
| --------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| `--gradient-brand`    | `linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)`              | `linear-gradient(135deg, #2563EB 0%, #0891B2 100%)`              |
| `--gradient-surface`  | `linear-gradient(180deg, #0F172A 0%, #0A0E1A 100%)`              | `linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)`              |
| `--gradient-glow`     | `radial-gradient(circle at 50% 0%, rgba(59,130,246,0.15), transparent 70%)` | `radial-gradient(circle at 50% 0%, rgba(37,99,235,0.08), transparent 70%)` |

### Z-Index

Fixed semantic layers. Do not use arbitrary z-index values anywhere in the codebase.

| Token                | Value |
| -------------------- | ----- |
| `--z-base`           | 0     |
| `--z-dropdown`       | 1000  |
| `--z-sticky`         | 1020  |
| `--z-navbar`         | 1030  |
| `--z-modal-backdrop` | 1040  |
| `--z-modal`          | 1050  |
| `--z-popover`        | 1060  |
| `--z-tooltip`        | 1070  |
| `--z-toast`          | 1080  |

## Colors

All components must use these tokens — no hardcoded hex values anywhere in the codebase.

| Role               | CSS Variable            | Dark      | Light     |
| ------------------ | ----------------------- | --------- | --------- |
| Page background    | `--bg-base`             | `#0A0E1A` | `#FFFFFF` |
| Surface            | `--bg-surface`          | `#0F172A` | `#F8FAFC` |
| Elevated surface   | `--bg-elevated`         | `#1E293B` | `#F1F5F9` |
| Primary text       | `--fg-primary`          | `#F8FAFC` | `#0F172A` |
| Muted text         | `--fg-muted`            | `#94A3B8` | `#64748B` |
| Primary accent     | `--accent-primary`      | `#3B82F6` | `#2563EB` |
| Secondary accent   | `--accent-secondary`    | `#06B6D4` | `#0891B2` |
| Border             | `--border-default`      | `#1E293B` | `#E2E8F0` |
| Error              | `--state-error`         | `#DC2626` | `#DC2626` |
| Success            | `--state-success`       | `#16A34A` | `#16A34A` |
| Warning            | `--state-warning`       | `#CA8A04` | `#CA8A04` |
| Severity — Critical| `--severity-critical`   | `#DC2626` | `#DC2626` |
| Severity — High    | `--severity-high`       | `#EA580C` | `#EA580C` |
| Severity — Medium  | `--severity-medium`     | `#CA8A04` | `#CA8A04` |
| Severity — Low     | `--severity-low`        | `#16A34A` | `#16A34A` |

Severity tokens are semantic and used for request status badges and risk indicators. WCAG AA contrast is usage-dependent: normal-size text must meet 4.5:1, large text / icons / borders must meet 3:1, and any severity color used as a badge background must be paired with a validated foreground. Verify contrast for each usage in both themes before shipping.

### Focus Ring

Accessible `focus-visible` ring using the brand accent. Applied to all interactive elements (buttons, links, inputs, dropdowns). Focus rings must never be removed — only restyled.

| Token                  | Dark                       | Light                      |
| ---------------------- | -------------------------- | -------------------------- |
| `--focus-ring-color`   | `#3B82F6`                  | `#2563EB`                  |
| `--focus-ring-width`   | `2px`                      | `2px`                      |
| `--focus-ring-offset`  | `2px`                      | `2px`                      |
| `--focus-ring-style`   | `solid`                    | `solid`                    |

### Overlay / Backdrop

Theme-aware modal backdrop. Dark uses a darker backdrop with controlled blur. Light uses a lighter neutral backdrop with subtle blur. Both must keep underlying content legible enough to signal "background" while ensuring the modal stays the visual focus.

| Token                 | Dark                            | Light                            |
| --------------------- | ------------------------------- | -------------------------------- |
| `--overlay-backdrop`  | `rgba(10, 14, 26, 0.75)`        | `rgba(15, 23, 42, 0.40)`         |
| `--overlay-blur`      | `12px`                          | `4px`                            |

## Token → Tailwind Mapping

Every design token in this file is defined as a CSS variable (under `:root` for Light and `.dark` for Dark) and **must** be exposed to Tailwind so it can be used as a utility class. Raw CSS variable references in `className` (e.g. `bg-[var(--bg-base)]`) are forbidden.

- The mapping is declared once, in the project's Tailwind theme configuration — via the `@theme inline` directive (Tailwind v4) or `theme.extend` in `tailwind.config.ts` (Tailwind v3). Do not scatter variable reads across components.
- Tailwind v4 reserves several namespaces (`--color-*`, `--text-*` → font-size, `--font-*`, `--shadow-*`, `--radius-*`). To avoid collisions, design tokens deliberately avoid the reserved `--text-*` namespace and use `--fg-*` for foreground colors instead.
- Naming convention — CSS variable prefix maps to utility namespace:

  | CSS Variable Prefix       | Tailwind Utility                                |
  | ------------------------- | ----------------------------------------------- |
  | `--bg-*`                  | `bg-*` (background-color)                       |
  | `--fg-*`                  | `text-*` (foreground color)                     |
  | `--border-*`              | `border-*` (border-color)                       |
  | `--accent-*`              | `bg-accent-*`, `text-accent-*`, `border-accent-*` |
  | `--state-*`               | `bg-state-*`, `text-state-*`, `border-state-*`  |
  | `--severity-*`            | `bg-severity-*`, `text-severity-*`, `border-severity-*` |
  | `--shadow-*`              | `shadow-*`                                      |
  | `--gradient-*`            | Custom `background-image` utilities — see below |
  | `--z-*`                   | Custom `z-*` utilities                          |
  | `--overlay-*`             | Consumed inside the modal/dialog component styles only |
  | `--focus-ring-*`          | Consumed by a single shared `.focus-ring` utility |

- Example: `--bg-base` becomes the `bg-base` utility, `--fg-primary` becomes `text-primary`, `--accent-primary` becomes `bg-accent-primary` / `text-accent-primary`.
- Gradient tokens are exposed as custom `background-image` utilities — `bg-gradient-brand`, `bg-gradient-surface`, `bg-gradient-glow`. These are distinct from Tailwind's built-in linear/radial gradient utilities (`bg-linear-*`, `bg-radial-*`) and must not be mixed with them.
- If a token has no natural Tailwind namespace (gradients, focus ring, overlay), expose it via a named utility in the same theme config — never via inline `style` or arbitrary `[var(--…)]` classes.

## Typography

| Role      | Font           | Variable      | Weights                 |
| --------- | -------------- | ------------- | ----------------------- |
| UI text   | Geist          | `--font-sans` | 400 / 500 / 600 / 700   |
| Code/mono | JetBrains Mono | `--font-mono` | 400 / 500 / 600 / 700   |

Use Tailwind's default size scale. JetBrains Mono is reserved for technical content — code blocks, IDs, hashes, terminal output, security findings, and any value a user might copy.

## Border Radius

These values are **not** Tailwind's defaults. Extend the Tailwind theme (`@theme` for v4 or `theme.extend.borderRadius` for v3) so that `rounded-sm`, `rounded-md`, `rounded-lg`, and `rounded-xl` resolve to the values below. Do not rely on default Tailwind radius values.

| Context           | Class          | Value  | Tailwind Default |
| ----------------- | -------------- | ------ | ---------------- |
| Inline / small UI | `rounded-sm`   | 6px    | 2px (0.125rem)   |
| Cards / panels    | `rounded-md`   | 8px    | 6px (0.375rem)   |
| Modals / overlays | `rounded-lg`   | 10px   | 8px (0.5rem)     |
| Large containers  | `rounded-xl`   | 12px   | 12px (0.75rem)   |
| Pills / avatars   | `rounded-full` | 9999px | 9999px           |

Professional and modern — never overly rounded. Do not use values outside this scale.

## Component Library

shadcn/ui on top of Tailwind, using the **New York** style as the base and overridden with the design tokens above. Components live in `components/ui/`.

- Add components via the shadcn CLI — never write primitives from scratch.
- Never edit files in `components/ui/` directly unless a spec explicitly says so. Extend via wrappers in `components/shared/`, `components/marketing/`, `components/portal/`, or `components/admin/`.
- All variants and sizes must reference the tokens in this file.

## Layout Patterns

- **Navbar:** fixed top bar, height `64px`, with a bottom border (`--border-default`). Two variants:
  - **Logged-out (marketing):** Logo · marketing links · theme toggle · Sign In · Get Started.
  - **Logged-in (portal / admin):** Logo · role-scoped application links · theme toggle · Profile menu · Sign Out.

  Navbar structure, height, and visual behavior are defined here. Exact link labels and role-scoped navigation are the source of truth in `project-overview.md` and the active feature spec — this file must not independently define menu items.
- **Container:** max-width `1280px`, horizontally centered, responsive horizontal padding (16px mobile → 32px desktop).
- **Footer:** multi-column layout on desktop, stacked on mobile, with a bottom strip for copyright, social icons, and the uptime status dot.
- **Marketing pages:** vertical scroll, sectioned layout, generous spacing, hero-first structure.
- **Portal pages:** sidebar-driven layout — fixed left sidebar, main content area, generous whitespace, data-dense tables and cards.
- **Admin pages:** same sidebar pattern as portal, plus data tables with filters and status badges.
- **Modals / dialogs:** centered overlay with backdrop blur (`--overlay-backdrop`, `--overlay-blur`), `rounded-lg`, focus-trap, and ESC-to-close.
- **Forms:** single-column on mobile, two-column on desktop where field count justifies it. Inline validation errors below each field in `--state-error`.
- **Loading states:** skeleton loaders for tables and cards; branded spinners for form submissions.
- **Empty states:** centered graphic, short message, and a primary CTA.
- **System error pages (404 / 500):** full-viewport centered layout with brand mark and support link.

## Icons

Lucide React. Stroke-based icons only. Sizes: `h-4 w-4` for inline text, `h-5 w-5` for buttons and toolbar actions, `h-6 w-6` for feature/hero accents. Icons inherit `currentColor` — never hardcode icon colors.

---