Read `AGENTS.md` before starting. Then read `context/ui-context.md` and `context/code-standards.md`.

We're adding the design system and UI primitive components.

## Setup

Install and configure `shadcn/ui` (New York style).

Add these shadcn components:
- Button
- Card
- Dialog
- Input
- Tabs
- Textarea
- ScrollArea

Do not modify the generated `components/ui/*` files after installation.

Also install `lucide-react`.

Create `lib/utils.ts` with a reusable `cn()` helper for merging Tailwind classes.

## Design tokens

Translate all design tokens from `context/ui-context.md` into `app/globals.css` using the Tailwind v4 `@theme inline` directive.

- Define Light values under `:root`.
- Define Dark values under `.dark`.
- Map tokens to Tailwind utilities following the naming convention in `ui-context.md`.
- Override the border radius scale: `rounded-sm` = 6px, `rounded-md` = 8px, `rounded-lg` = 10px, `rounded-xl` = 12px.
- Configure Geist (`--font-sans`) and JetBrains Mono (`--font-mono`) via `next/font` in `app/layout.tsx`.
- Map shadcn's default variables (`--background`, `--foreground`, `--primary`, `--border`, `--ring`, etc.) to our tokens so shadcn components use our theme.
- No raw hex values, no arbitrary Tailwind values, no `bg-[var(--...)]` in class names.

## Dark mode default

In `app/layout.tsx`, set `className="dark"` on the `<html>` element.

Theme toggle and cookie-based theme persistence are out of scope for this unit.

Ensure all components match the dark theme tokens in `globals.css`.

## Check when done

- [ ] All installed shadcn components import without errors.
- [ ] `cn()` works properly — conflicting class pair resolves to the later class.
- [ ] All tokens from `ui-context.md` are available as Tailwind utilities.
- [ ] shadcn components render with our tokens, not shadcn defaults.
- [ ] No default light styling appears.
- [ ] No raw hex, no arbitrary Tailwind values, no `[var(--...)]` in class names.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] No invariant from `context/architecture-context.md` is violated.

## Files in scope

- `app/globals.css`
- `app/layout.tsx` (font setup + `className="dark"` only)
- `components/ui/*` (generated, not hand-edited)
- `lib/utils.ts`
- `package.json` / lockfile (dependencies only)

## Out of scope

- Theme toggle and cookie-based theme persistence
- Business logic, API routes, DB models, auth
- Feature pages, 404/500 pages, loading/empty/pending states
- Clerk, Prisma, Vercel Blob