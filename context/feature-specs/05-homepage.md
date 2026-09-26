File: `context/feature-specs/05-homepage.md`

```markdown
# Unit 05: Homepage

## Goal

Replace the placeholder marketing home page with the full Surakshayantra homepage — hero, services overview grid, methodology preview, trust indicators, and closing CTA — composed from static marketing components under `components/marketing/`.

## Design

- Public marketing page at `/`. Server Component. No auth, no DB, no API, no CMS.
- Static hardcoded content. No data fetching.
- **No decorative animations.** Particle effects, gradients that pulse, keyframe motion, `framer-motion` — all deferred. **Functional transitions** (hover/focus color and border changes) are allowed per `ui-context.md`.
- Layout: single vertical scroll. Each section is a full-width band containing a shared `<Container>`.
- **Section order + background** (settled):
  1. Hero — `bg-bg-base` + gradient glow overlay
  2. Services overview — `bg-bg-surface`
  3. Methodology preview — `bg-bg-base`
  4. Trust indicators — `bg-bg-surface`
  5. Closing CTA — `bg-bg-base`
- Each section's inner `<Container>` receives `className="py-20 md:py-28"`. This intentionally produces combined vertical spacing between adjacent sections. Approved visual rhythm; do not "fix."
- Typography: hero `<h1>`, section headings `<h2>`, services card titles `<h3>`. Exactly one `<h1>` on the page. Every card title must render as an actual `<h3>` element, not a styled `<div>` or `<span>`.
- Icons: `lucide-react` only.
  - Inline text icons (including trust indicators): `h-4 w-4`
  - Button / toolbar icons: `h-5 w-5`
  - Feature / card accent icons (services grid): `h-6 w-6`
- Buttons: shadcn `Button`. Primary `variant="default"`, secondary `variant="outline"`.
- Cards (services): `bg-bg-elevated`, `border border-border-default`, `rounded-md`, `shadow-sm`.
- Transitions on interactive elements: `transition-colors` only. No `duration-*` utilities unless they map to a defined token.
- All CTA links use Next.js `<Link>`. Where a `Button` wraps a `Link`, use the `asChild` pattern.
- Decorative icons rendered purely for visual emphasis (trust indicator checkmarks, services card icons) receive `aria-hidden="true"`.
- Tokens only. No raw hex, no arbitrary values, no `bg-[var(--…)]`.

## Implementation

### Page — `app/(marketing)/page.tsx`

- Server Component. Replace existing placeholder.
- Renders in order: `<Hero />`, `<ServicesOverview />`, `<MethodologyPreview />`, `<TrustIndicators />`, `<ClosingCta />` from `@/components/marketing/`.
- No other logic.

### Hero — `components/marketing/hero.tsx`

- Server Component.
- Wrapper: `<section className="relative overflow-hidden bg-bg-base">`
- Overlay: `<div className="pointer-events-none absolute inset-0 bg-gradient-glow" aria-hidden="true" />`
- Content wrapper: `<div className="relative z-10"><Container className="py-20 md:py-28">…</Container></div>`
- Inner: `max-w-3xl mx-auto text-center`
  - `<h1>`: `Secure Your Digital Future` — `text-4xl md:text-5xl lg:text-6xl font-bold text-fg-primary tracking-tight`
  - `<p>`: `Professional cybersecurity assessments to identify vulnerabilities before attackers do.` — `mt-6 text-lg md:text-xl text-fg-muted`
  - CTA row: `mt-10 flex flex-col sm:flex-row gap-3 justify-center`
    - Primary: `<Button asChild><Link href="/sign-up">Request Assessment</Link></Button>`
    - Secondary: `<Button variant="outline" asChild><Link href="/services">Explore Services</Link></Button>`

### Services Overview — `components/marketing/services-overview.tsx`

- Server Component.
- Wrapper: `<section className="bg-bg-surface">` + `<Container className="py-20 md:py-28">`
- Heading block centered:
  - `<h2>`: `Our Services` — `text-3xl md:text-4xl font-bold text-fg-primary`
  - Subtitle: `Professional security testing tailored to your digital assets.` — `mt-4 text-lg text-fg-muted`
- Import line (exact):
  ```ts
  import { Shield, Globe, Smartphone, Plug, Network, type LucideIcon } from "lucide-react";
  ```
- Local constant, exact:
  ```ts
  type ServiceCard = { title: string; description: string; href: string; icon: LucideIcon };
  const services: ServiceCard[] = [
    { title: "VAPT",            description: "Comprehensive penetration testing across applications, networks, and infrastructure.", href: "/services/vapt",    icon: Shield },
    { title: "Web App Testing", description: "Identify security weaknesses in web applications before attackers can exploit them.",    href: "/services/web-app", icon: Globe },
    { title: "Mobile Testing",  description: "Assess iOS and Android applications for vulnerabilities and insecure data handling.",    href: "/services/mobile",  icon: Smartphone },
    { title: "API Testing",     description: "Evaluate API endpoints for authentication, authorization, and data exposure issues.",    href: "/services/api",     icon: Plug },
    { title: "Network Testing", description: "Test internal and external network perimeters for misconfigurations and exposure.",      href: "/services/network", icon: Network },
  ];
  ```
- Grid: `mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5`
- Each card renders as:
  ```tsx
  {services.map((service) => {
    const Icon = service.icon;
    return (
      <Link key={service.href} href={service.href} className="block">
        <article className="bg-bg-elevated border border-border-default rounded-md p-6 shadow-sm transition-colors hover:border-accent-primary">
          <Icon className="text-accent-primary h-6 w-6" aria-hidden="true" />
          <h3 className="mt-4 text-lg font-semibold text-fg-primary">{service.title}</h3>
          <p className="mt-2 text-sm text-fg-muted">{service.description}</p>
        </article>
      </Link>
    );
  })}
  ```

### Methodology Preview — `components/marketing/methodology-preview.tsx`

- Server Component.
- Wrapper: `<section className="bg-bg-base">` + `<Container className="py-20 md:py-28">`
- Heading block centered:
  - `<h2>`: `Our Methodology` — `text-3xl md:text-4xl font-bold text-fg-primary`
  - Subtitle: `A structured, repeatable process aligned with industry standards.` — `mt-4 text-lg text-fg-muted`
- Steps array (exact order):
  ```ts
  const steps = ["Reconnaissance", "Scanning", "Vulnerability Analysis", "Exploitation", "Reporting & Retest"];
  ```
- **Desktop layout (lg+)** — `hidden lg:flex mt-12`:

  Each step is `flex-1`. No `gap-*` on the parent flex container — connectors meet at item boundaries.

  ```tsx
  <div className="hidden lg:flex mt-12">
    {steps.map((step, index) => (
      <div key={step} className="flex-1 flex flex-col items-center text-center relative px-2">
        {index > 0 && (
          <div className="absolute top-5 left-0 right-1/2 h-px bg-border-default" aria-hidden="true" />
        )}
        {index < steps.length - 1 && (
          <div className="absolute top-5 left-1/2 right-0 h-px bg-border-default" aria-hidden="true" />
        )}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-elevated border border-border-default text-accent-primary font-semibold relative z-10">
          {index + 1}
        </div>
        <span className="mt-4 text-fg-primary font-medium">{step}</span>
      </div>
    ))}
  </div>
  ```

  How the connector works: each item's circle is centered horizontally via `flex-col items-center`, so its center sits at `50%` of the item's width. Each item draws a half-line on its left (from item's left edge to its center) except the first item, and a half-line on its right (from center to right edge) except the last item. Adjacent items share the same boundary (no gap), so the half-lines connect into one continuous line from the first circle's center to the last circle's center.

- **Mobile/tablet layout (< lg)** — `lg:hidden flex flex-col gap-6 relative mt-12`:

  ```tsx
  <div className="lg:hidden flex flex-col gap-6 relative mt-12">
    <div className="absolute left-5 top-5 bottom-5 w-px bg-border-default" aria-hidden="true" />
    {steps.map((step, index) => (
      <div key={step} className="flex items-center gap-4 relative">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-elevated border border-border-default text-accent-primary font-semibold relative z-10 shrink-0">
          {index + 1}
        </div>
        <span className="text-fg-primary font-medium">{step}</span>
      </div>
    ))}
  </div>
  ```

  On mobile, circles are the first child of a `flex items-center` row, so they sit at the left edge. `left-5` (20px) therefore aligns the connector line with the circle centers. `top-5 bottom-5` limits the line to span from the first circle's center to the last circle's center.

- CTA below: `mt-12 flex justify-center` — `<Button variant="outline" asChild><Link href="/methodology">See Full Methodology</Link></Button>`

### Trust Indicators — `components/marketing/trust-indicators.tsx`

- Server Component.
- Import line (exact):
  ```ts
  import { CheckCircle2 } from "lucide-react";
  ```
- Wrapper: `<section className="bg-bg-surface">` + `<Container className="py-20 md:py-28">`
- No heading.
- Statements (exact, verbatim):
  ```ts
  const indicators = [
    "OWASP-aligned methodology",
    "Industry-standard testing practices",
    "Detailed vulnerability reports",
    "Actionable remediation guidance",
  ];
  ```
- Grid: `grid grid-cols-1 md:grid-cols-4 gap-6`
- Each item renders as:
  ```tsx
  {indicators.map((statement) => (
    <div key={statement} className="flex items-center gap-2">
      <CheckCircle2 className="h-4 w-4 text-state-success" aria-hidden="true" />
      <span className="text-fg-primary text-base">{statement}</span>
    </div>
  ))}
  ```
- The `CheckCircle2` icon is purely decorative; the adjacent text carries the meaning, so `aria-hidden="true"` is required.
- No fake numbers, no certifications, no client logos, no experience claims.

### Closing CTA — `components/marketing/closing-cta.tsx`

- Server Component.
- Wrapper: `<section className="bg-bg-base">` + `<Container className="py-20 md:py-28">`
- Content: `max-w-2xl mx-auto text-center`
  - `<h2>`: `Ready to Strengthen Your Security?` — `text-3xl md:text-4xl font-bold text-fg-primary`
  - `<p>`: `Request a security assessment and discover where your digital assets need protection.` — `mt-4 text-lg text-fg-muted`
  - Button: `mt-8` — `<Button asChild><Link href="/sign-up">Request Assessment</Link></Button>`
  - No custom gradient class on this button. Default primary `Button` styling applies.

## Dependencies

- None. `lucide-react`, shadcn `Button`, and `Container` are already installed.

## Verify when done

- [ ] `app/(marketing)/page.tsx` renders five sections in order: Hero, Services Overview, Methodology Preview, Trust Indicators, Closing CTA.
- [ ] No `use client` in page or any of the five section components.
- [ ] No data fetching, no Prisma, no API, no CMS imports.
- [ ] Exactly one `<h1>` on the page.
- [ ] Hero section background is `bg-bg-base`.
- [ ] Hero `<h1>` text is exactly `Secure Your Digital Future`.
- [ ] Hero `<p>` text is exactly `Professional cybersecurity assessments to identify vulnerabilities before attackers do.`
- [ ] Hero primary CTA: label `Request Assessment`, href `/sign-up`, wrapped via `Button asChild`.
- [ ] Hero secondary CTA: label `Explore Services`, href `/services`, wrapped via `Button variant="outline" asChild`.
- [ ] Hero overlay has `pointer-events-none`; content wrapper has `relative z-10`.
- [ ] Services section background is `bg-bg-surface`.
- [ ] Services grid renders exactly 5 cards in order: VAPT, Web App Testing, Mobile Testing, API Testing, Network Testing.
- [ ] Each services card `<Link>` uses `key={service.href}`, `href={service.href}`, and `className="block"`.
- [ ] Services card routes are exactly `/services/vapt`, `/services/web-app`, `/services/mobile`, `/services/api`, `/services/network`.
- [ ] Services card icons are `Shield`, `Globe`, `Smartphone`, `Plug`, `Network` from `lucide-react`.
- [ ] Services file imports `type LucideIcon` from `lucide-react` explicitly.
- [ ] Each services card title is rendered as an actual `<h3>` HTML element.
- [ ] Each services card has a visible icon at `h-6 w-6` with `aria-hidden="true"`.
- [ ] Services card descriptions match the exact strings in the spec.
- [ ] Services subtitle is exactly `Professional security testing tailored to your digital assets.`
- [ ] Services grid class string is `mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5`.
- [ ] Methodology section background is `bg-bg-base`.
- [ ] Methodology subtitle is exactly `A structured, repeatable process aligned with industry standards.`
- [ ] Methodology steps are exactly: `Reconnaissance`, `Scanning`, `Vulnerability Analysis`, `Exploitation`, `Reporting & Retest`, in that order.
- [ ] Methodology numbered circles render visible numbers 1 through 5 (via `{index + 1}`).
- [ ] Methodology desktop layout uses `hidden lg:flex` (not `grid`), with each step as `flex-1` and no `gap-*` on the parent flex container.
- [ ] Methodology desktop connector renders per item: left half-line (`absolute top-5 left-0 right-1/2`) on every step except the first, right half-line (`absolute top-5 left-1/2 right-0`) on every step except the last.
- [ ] Methodology desktop line is continuous from the first circle's center to the last circle's center, with no gaps at item boundaries.
- [ ] Methodology mobile connector uses `absolute left-5 top-5 bottom-5` — spans from first circle center to last circle center vertically.
- [ ] Methodology has separate desktop (`hidden lg:flex`) and mobile (`lg:hidden flex flex-col`) layouts.
- [ ] Both methodology layouts use `key={step}` in their `.map()`.
- [ ] Methodology CTA: label `See Full Methodology`, href `/methodology`, wrapped via `Button variant="outline" asChild`.
- [ ] Trust indicators section background is `bg-bg-surface`.
- [ ] Trust indicators file imports `CheckCircle2` explicitly from `lucide-react`.
- [ ] Trust indicators grid class is `grid grid-cols-1 md:grid-cols-4 gap-6`.
- [ ] Trust indicators render exactly these four statements, verbatim: `OWASP-aligned methodology`, `Industry-standard testing practices`, `Detailed vulnerability reports`, `Actionable remediation guidance`.
- [ ] Trust indicator icons are `CheckCircle2` at `h-4 w-4 text-state-success` with `aria-hidden="true"`.
- [ ] Each trust indicator item uses `key={statement}` in its `.map()`.
- [ ] Trust indicators contain no numbers, certifications, logos, or experience claims.
- [ ] Closing CTA section background is `bg-bg-base`.
- [ ] Closing CTA `<h2>` text is exactly `Ready to Strengthen Your Security?`
- [ ] Closing CTA `<p>` text is exactly `Request a security assessment and discover where your digital assets need protection.`
- [ ] Closing CTA button: label `Request Assessment`, href `/sign-up`, wrapped via `Button asChild`, default styling (no custom gradient class).
- [ ] Every `.map()` in every component provides a stable `key` (services: `service.href`; methodology: `step`; trust: `statement`). No React key warnings.
- [ ] No `duration-normal`, `duration-fast`, or undefined duration utilities used anywhere.
- [ ] Only `transition-colors` used where hover transitions appear; no `animate-*`, no `framer-motion`, no keyframes, no particles, no pulse.
- [ ] No raw hex, no arbitrary Tailwind values, no `bg-[var(--…)]`.
- [ ] Every section uses `<Container>` from `components/shared/container.tsx`, and `Container` accepts a `className` prop (per its Unit 04 signature `type ContainerProps = { children: React.ReactNode; className?: string }`).
- [ ] Files created/modified are limited to: `app/(marketing)/page.tsx`, `components/marketing/hero.tsx`, `components/marketing/services-overview.tsx`, `components/marketing/methodology-preview.tsx`, `components/marketing/trust-indicators.tsx`, `components/marketing/closing-cta.tsx`, and `context/progress-tracker.md` (tracker update exempt).
- [ ] No files modified in `components/shared/`, `components/ui/`, `lib/`, `prisma/`, or `app/api/`.
- [ ] Dark theme renders correctly with token-based colors.
- [ ] Light theme renders correctly with token-based colors.
- [ ] Mobile (< 640px): hero stacks, services single column, methodology vertical stack, trust indicators single column, closing CTA centered.
- [ ] `md` (768px): trust indicators show 4 columns.
- [ ] `lg` (1024px): services grid shows 3 columns; methodology horizontal.
- [ ] `xl` (1280px): services grid shows 5 columns.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] `context/progress-tracker.md` updated with Unit 05 completion state and detailed sub-bullets.
```