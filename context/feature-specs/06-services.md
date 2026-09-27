
# Unit 06: Services + Service Detail

## Goal

Build the `/services` listing page and `/services/[slug]` dynamic detail template, both driven by a single centralized, typed content source (`lib/services-data.ts`) that is structured for future migration to admin-managed content. Each of the 5 services gets unique Overview, Scope, Methodology, and Deliverables content.

## Design

- Authoritative token mapping: see `context/ui-context.md` → "Token → Tailwind Mapping". All utilities used in this spec are the correct generated classes: `text-primary`, `text-muted`, `bg-base`, `bg-surface`, `bg-elevated`, `border-default`, `text-accent-primary`, `text-state-success`, `bg-gradient-glow`.
- Public marketing pages. Server Components. No auth, no DB, no API, no CMS.
- Content source: `lib/services-data.ts` holds all service content as plain data. Icons are referenced by string name (`ServiceIconName`) and resolved to Lucide components at render time via `lib/service-icons.ts`. This keeps the data serializable so it can migrate to a Prisma model later without touching components.
- **Future-CMS note (informational, not implemented in Unit 06):** All user-facing marketing content — service entries, headings, CTA labels, trust text — is intended to become admin-editable in a later unit. Unit 06 only structures the Services content for that future. A backlog entry will be added to `progress-tracker.md`. Do not implement any admin UI, DB model, or CMS route in this unit.
- **Icon size rule (general):**
  - Inline text icons: `h-4 w-4`
  - Button / toolbar icons: `h-5 w-5`
  - Feature / card accent icons: `h-6 w-6`
  - **Exception — dense preview lists:** Icons inside a visually constrained preview (e.g. a card whose height is limited) may drop one size tier from their canonical size. This applies only to preview contexts, never to full-content contexts.
  - Applying this rule: listing card scope bullets use `h-4 w-4` (dense preview); detail Scope and Deliverables bullets use `h-5 w-5` (full content). This is a rule, not an arbitrary difference.
- **Typography hierarchy (intentional, documented):**
  - Homepage (Unit 05) is the visual flagship — larger h1/h2 for marketing impact.
  - Detail pages (Unit 06) are content pages — lower visual priority.
  - Detail page `<h1>`: `text-4xl md:text-5xl` (no `lg:text-6xl`). Section `<h2>`: `text-2xl md:text-3xl`. Bottom CTA `<h2>` keeps `text-3xl md:text-4xl` (conversion block, matches Unit 05).
  - **Hero heading intentionally uses `text-4xl` on mobile and `text-5xl` from `md` breakpoint onward to maintain strong visual impact on small screens.**
  - This is intentional, not an oversight.
- **Section backgrounds:**
  - Listing page: single `bg-base` band. The listing is one unified catalog view — no alternating bands.
  - Detail page (6 sections, alternating base/surface): Hero `bg-base` + gradient glow overlay; Overview `bg-surface`; Scope `bg-base`; Methodology `bg-surface`; Deliverables `bg-base`; Bottom CTA `bg-surface`. Final section is `bg-surface` (not `bg-base`) because Unit 06 has an even number of sections — alternation ends on `surface`.
- **Vertical padding:**
  - Most sections: `py-20 md:py-28`.
  - Detail hero: `py-12 md:py-20` — reduced because the breadcrumb immediately precedes it and contributes `pt-8` already. Mobile combined top gap = `pt-8 + 48px` = ~`pt-20`. Desktop combined top gap = `pt-8 + 80px` = ~`pt-28`. Intentional.
  - Breadcrumb: `pt-8` only (no `pb-*`) — hero's own top padding provides the visual gap.
- Listing page heading block is wrapped in a `<div className="text-center">` so `<h1>` and subtitle render centered.
- Listing card design: icon, title, shortDescription, first 3 scope items as bullets (via `.slice(0, 3)`), and a "Learn more →" indicator. Background `bg-elevated`, `border border-default`, `rounded-md`, `shadow-sm`, `transition-colors hover:border-accent-primary`.
- Detail page structure (in order):
  1. Breadcrumb (Home / Services / {Service title})
  2. Hero: title `<h1>`, subtitle `<p>`, primary CTA "Request Assessment" → `/sign-up`. Left-aligned (matches breadcrumb alignment) — intentional, differs from the centered Unit 05 homepage hero.
  3. Overview — `<h2>` + paragraph
  4. Scope — `<h2>` + bulleted list
  5. Methodology — `<h2>` + numbered list (vertical, not horizontal)
  6. Deliverables — `<h2>` + bulleted list with checkmark icons
  7. Bottom CTA — closing block with "Request Assessment" → `/sign-up`
- Unknown slug → `notFound()` from `next/navigation` (renders existing `app/not-found.tsx`).
- `generateMetadata` per service: `title` = `{Service title} — Surakshayantra`, `description` = `shortDescription`.
- **List item alignment rule (documented):**
  - Preview lists inside cards: `flex items-center gap-2` (short, single-line items).
  - Full-content lists (Scope, Deliverables): `flex items-start gap-3` (items may wrap to multiple lines).
- Tokens only. No raw hex, no arbitrary values, no `bg-[var(--…)]`.
- No mojibake in source files. All arrows use `→` (U+2192), all em dashes use `—` (U+2014).

## Implementation

### `lib/services-data.ts`

- Pure data module. No React, no Next.js imports.
- Exports:
  ```ts
  export type ServiceIconName = "shield" | "globe" | "smartphone" | "plug" | "network";

  export type ServiceContent = {
    readonly slug: string;
    readonly title: string;
    readonly shortDescription: string;
    readonly subtitle: string;
    readonly overview: string;
    readonly scope: readonly string[];
    readonly methodology: readonly string[];
    readonly deliverables: readonly string[];
    readonly iconName: ServiceIconName;
  };

  export const services: readonly ServiceContent[] = [ /* 5 entries, exact below */ ];

  export function getServiceBySlug(slug: string): ServiceContent | undefined {
    return services.find((s) => s.slug === slug);
  }

  export function getAllServiceSlugs(): readonly string[] {
    return services.map((s) => s.slug);
  }
  ```

- Exact entries (order matters — matches Unit 05 order):

  1. **slug**: `vapt` | **iconName**: `shield` | **title**: `VAPT` | **shortDescription**: `Comprehensive penetration testing across applications, networks, and infrastructure.`
     - **subtitle**: `End-to-end security assessment that uncovers exploitable weaknesses across your entire attack surface.`
     - **overview**: `Comprehensive security assessment combining automated scanning with manual penetration testing to identify exploitable weaknesses across your entire attack surface — from web applications and APIs to networks and cloud infrastructure.`
     - **scope**: `["Web applications", "APIs", "Network infrastructure", "Cloud environments", "Mobile applications", "Active Directory"]`
     - **methodology**: `["Reconnaissance", "Automated Scanning", "Manual Analysis", "Exploitation", "Reporting & Retest"]`
     - **deliverables**: `["Executive summary", "Detailed technical report", "Proof-of-concept evidence", "Prioritized remediation roadmap", "Post-fix retest"]`

  2. **slug**: `web-app` | **iconName**: `globe` | **title**: `Web App Testing` | **shortDescription**: `Identify security weaknesses in web applications before attackers can exploit them.`
     - **subtitle**: `Deep-dive assessment aligned with the OWASP Top 10 and modern web application threats.`
     - **overview**: `Deep-dive security assessment of web applications aligned with the OWASP Top 10 and beyond — uncovering authentication bypasses, authorization flaws, injection vulnerabilities, and business logic weaknesses.`
     - **scope**: `["Authentication & session management", "Authorization & access control", "Input validation", "Business logic", "Client-side security", "API endpoints"]`
     - **methodology**: `["Reconnaissance", "Authentication Testing", "Input Fuzzing", "Business Logic Analysis", "Reporting & Retest"]`
     - **deliverables**: `["Findings report with severity ratings", "Reproduction steps", "Remediation guidance", "Developer-ready recommendations", "Retest"]`

  3. **slug**: `mobile` | **iconName**: `smartphone` | **title**: `Mobile Testing` | **shortDescription**: `Assess iOS and Android applications for vulnerabilities and insecure data handling.`
     - **subtitle**: `Security assessment of mobile applications mapped to OWASP MASVS.`
     - **overview**: `Security assessment of iOS and Android applications covering client-side storage, network communication, binary protections, and backend API interactions — mapped to OWASP MASVS.`
     - **scope**: `["Local data storage", "Secure transport", "Binary protections", "Code tampering", "Runtime manipulation", "Backend API interactions"]`
     - **methodology**: `["Static Analysis", "Dynamic Analysis", "Network Interception", "Backend API Testing", "Reporting & Retest"]`
     - **deliverables**: `["Findings report", "Proof-of-concept demonstrations", "Platform-specific remediation", "MASVS compliance mapping", "Retest"]`

  4. **slug**: `api` | **iconName**: `plug` | **title**: `API Testing` | **shortDescription**: `Evaluate API endpoints for authentication, authorization, and data exposure issues.`
     - **subtitle**: `Comprehensive review of REST, GraphQL, and SOAP APIs across your service boundaries.`
     - **overview**: `Comprehensive security review of REST, GraphQL, and SOAP APIs — covering authentication, authorization, rate limiting, input validation, and data exposure across your service boundaries.`
     - **scope**: `["Authentication mechanisms", "Authorization & IDOR", "Rate limiting", "Input validation", "Data exposure", "Business logic abuse"]`
     - **methodology**: `["Endpoint Discovery", "Authentication Testing", "Authorization Testing", "Input Injection", "Reporting & Retest"]`
     - **deliverables**: `["Findings report", "Vulnerable endpoint evidence", "Remediation roadmap", "API-specific hardening guidance", "Retest"]`

  5. **slug**: `network` | **iconName**: `network` | **title**: `Network Testing` | **shortDescription**: `Test internal and external network perimeters for misconfigurations and exposure.`
     - **subtitle**: `Internal and external network penetration testing that maps attack paths before adversaries do.`
     - **overview**: `Internal and external network penetration testing to identify misconfigurations, exposed services, weak credentials, and lateral movement paths before attackers exploit them.`
     - **scope**: `["External perimeter", "Internal network", "Wireless infrastructure", "Active Directory", "Cloud network configuration", "Segmentation controls"]`
     - **methodology**: `["Reconnaissance", "Port Scanning", "Service Enumeration", "Exploitation", "Lateral Movement", "Reporting & Retest"]`
     - **deliverables**: `["Findings report", "Attack path documentation", "Configuration fixes", "Remediation priority matrix", "Retest"]`

### `lib/service-icons.ts`

- Maps `ServiceIconName` to `LucideIcon` components. Keeps `services-data.ts` free of React imports so the data can later move to a DB.
- Exports:
  ```ts
  import { Shield, Globe, Smartphone, Plug, Network, type LucideIcon } from "lucide-react";
  import type { ServiceIconName } from "./services-data";

  export const serviceIcons: Record<ServiceIconName, LucideIcon> = {
    shield: Shield,
    globe: Globe,
    smartphone: Smartphone,
    plug: Plug,
    network: Network,
  };
  ```

### `app/(marketing)/services/page.tsx` — Listing

- Server Component.
- Imports (explicit):
  ```ts
  import type { Metadata } from "next";
  import Link from "next/link";
  import { ArrowRight, CheckCircle2 } from "lucide-react";
  import Container from "@/components/shared/container";
  import { services } from "@/lib/services-data";
  import { serviceIcons } from "@/lib/service-icons";
  ```
- `export const metadata: Metadata = { title: "Services — Surakshayantra", description: "Professional security testing across VAPT, web applications, mobile, API, and network infrastructure." };`
- Wrapper: `<section className="bg-base">` + `<Container className="py-20 md:py-28">`
- Heading block wrapped in a centered div:
  ```tsx
  <div className="text-center">
    <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">Our Services</h1>
    <p className="mt-4 text-lg text-muted">Professional security testing tailored to your digital assets.</p>
  </div>
  ```
- Grid of larger cards: `mt-12 grid gap-6 grid-cols-1 md:grid-cols-2`
- Card (each service), rendered as:
  ```tsx
  {services.map((service) => {
    const Icon = serviceIcons[service.iconName];
    return (
      <Link key={service.slug} href={`/services/${service.slug}`} className="block">
        <article className="bg-elevated border border-default rounded-md p-6 shadow-sm transition-colors hover:border-accent-primary h-full flex flex-col">
          <Icon className="h-6 w-6 text-accent-primary" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-semibold text-primary">{service.title}</h2>
          <p className="mt-2 text-sm text-muted">{service.shortDescription}</p>
          <ul className="mt-4 space-y-1 list-none pl-0">
            {service.scope.slice(0, 3).map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-muted">
                <CheckCircle2 className="h-4 w-4 text-state-success shrink-0" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <span className="mt-auto pt-6 text-sm font-medium text-accent-primary inline-flex items-center gap-1">
            Learn more <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </article>
      </Link>
    );
  })}
  ```

### `app/(marketing)/services/[slug]/page.tsx` — Detail

- Server Component.
- Imports (explicit):
  ```ts
  import type { Metadata } from "next";
  import { notFound } from "next/navigation";
  import Link from "next/link";
  import { ChevronRight, CheckCircle2 } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import Container from "@/components/shared/container";
  import { getServiceBySlug, getAllServiceSlugs } from "@/lib/services-data";
  ```
- Signature (Next.js 16):
  ```ts
  export default async function ServiceDetailPage({
    params,
  }: {
    params: Promise<{ slug: string }>;
  }) {
    const { slug } = await params;
    const service = getServiceBySlug(slug);
    if (!service) notFound();
    // ...rest
  }
  ```
- `export async function generateStaticParams() { return getAllServiceSlugs().map((slug) => ({ slug })); }`
- `export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const service = getServiceBySlug(slug); if (!service) return {}; return { title: \`${service.title} — Surakshayantra\`, description: service.shortDescription }; }`
- Page structure:
  1. **Breadcrumb**:
     ```tsx
     <nav aria-label="Breadcrumb" className="bg-base">
       <Container className="pt-8">
         <ol className="flex items-center gap-2 text-sm text-muted list-none pl-0">
           <li><Link href="/">Home</Link></li>
           <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
           <li><Link href="/services">Services</Link></li>
           <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
           <li><span aria-current="page" className="text-primary">{service.title}</span></li>
         </ol>
       </Container>
     </nav>
     ```
  2. **Hero**:
     ```tsx
     <section className="relative overflow-hidden bg-base">
       <div className="pointer-events-none absolute inset-0 bg-gradient-glow" aria-hidden="true" />
       <div className="relative z-10">
         <Container className="py-12 md:py-20">
           <div className="max-w-3xl">
             <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">{service.title}</h1>
             <p className="mt-6 text-lg text-muted">{service.subtitle}</p>
             <div className="mt-8">
               <Button asChild><Link href="/sign-up">Request Assessment</Link></Button>
             </div>
           </div>
         </Container>
       </div>
     </section>
     ```
  3. **Overview**:
     ```tsx
     <section className="bg-surface">
       <Container className="py-20 md:py-28">
         <div className="max-w-3xl">
           <h2 className="text-2xl md:text-3xl font-bold text-primary">Overview</h2>
           <p className="mt-4 text-lg text-muted">{service.overview}</p>
         </div>
       </Container>
     </section>
     ```
  4. **Scope**:
     ```tsx
     <section className="bg-base">
       <Container className="py-20 md:py-28">
         <div className="max-w-3xl">
           <h2 className="text-2xl md:text-3xl font-bold text-primary">Scope</h2>
           <ul className="mt-6 space-y-3 list-none pl-0">
             {service.scope.map((item) => (
               <li key={item} className="flex items-start gap-3 text-muted">
                 <CheckCircle2 className="mt-0.5 h-5 w-5 text-state-success shrink-0" aria-hidden="true" />
                 <span>{item}</span>
               </li>
             ))}
           </ul>
         </div>
       </Container>
     </section>
     ```
  5. **Methodology**:
     ```tsx
     <section className="bg-surface">
       <Container className="py-20 md:py-28">
         <div className="max-w-3xl">
           <h2 className="text-2xl md:text-3xl font-bold text-primary">Methodology</h2>
           <ol className="mt-6 space-y-4 list-none pl-0">
             {service.methodology.map((step, index) => (
               <li key={step} className="flex items-center gap-4">
                 <span className="flex h-8 w-8 items-center justify-center rounded-full bg-elevated border border-default text-accent-primary text-sm font-semibold shrink-0">
                   {index + 1}
                 </span>
                 <span className="text-primary font-medium">{step}</span>
               </li>
             ))}
           </ol>
         </div>
       </Container>
     </section>
     ```
  6. **Deliverables**:
     ```tsx
     <section className="bg-base">
       <Container className="py-20 md:py-28">
         <div className="max-w-3xl">
           <h2 className="text-2xl md:text-3xl font-bold text-primary">Deliverables</h2>
           <ul className="mt-6 space-y-3 list-none pl-0">
             {service.deliverables.map((item) => (
               <li key={item} className="flex items-start gap-3 text-muted">
                 <CheckCircle2 className="mt-0.5 h-5 w-5 text-state-success shrink-0" aria-hidden="true" />
                 <span>{item}</span>
               </li>
             ))}
           </ul>
         </div>
       </Container>
     </section>
     ```
  7. **Bottom CTA**:
     ```tsx
     <section className="bg-surface">
       <Container className="py-20 md:py-28">
         <div className="max-w-2xl mx-auto text-center">
           <h2 className="text-3xl md:text-4xl font-bold text-primary">Ready to Strengthen Your Security?</h2>
           <p className="mt-4 text-lg text-muted">Request a security assessment and discover where your digital assets need protection.</p>
           <div className="mt-8">
             <Button asChild><Link href="/sign-up">Request Assessment</Link></Button>
           </div>
         </div>
       </Container>
     </section>
     ```

## Dependencies

- None. All icons and shadcn components are already installed.
- **Pre-implementation check:** Confirm `components/shared/container.tsx` uses `export default function Container(...)`. If it uses a named export instead, adjust imports to `import { Container } from "@/components/shared/container"` before writing any page code. (Verified as of Unit 06: `components/shared/container.tsx` uses `export default`.)

## Verify when done

- [ ] `lib/services-data.ts` exists and exports `ServiceIconName`, `ServiceContent`, `services`, `getServiceBySlug`, `getAllServiceSlugs`.
- [ ] `lib/services-data.ts` has no React or Next.js imports.
- [ ] `services` is typed as `readonly ServiceContent[]`; each entry's string fields are `readonly`; `scope`, `methodology`, `deliverables` are `readonly string[]`.
- [ ] `getAllServiceSlugs` return type is `readonly string[]`.
- [ ] `getServiceBySlug` and `getAllServiceSlugs` have real implementations.
- [ ] `services` array has exactly 5 entries in order: `vapt`, `web-app`, `mobile`, `api`, `network`.
- [ ] Each entry has non-empty `title`, `shortDescription`, `subtitle`, `overview`, `scope`, `methodology`, `deliverables`, and valid `iconName`.
- [ ] Content strings match the exact values listed in the spec.
- [ ] `lib/service-icons.ts` exists and maps all five `ServiceIconName` values to their Lucide components.
- [ ] Listing page imports `Metadata` type and exports `metadata: Metadata` with title `Services — Surakshayantra` and the exact description string.
- [ ] `app/(marketing)/services/page.tsx` exists and renders an `<h1>` with text `Our Services`.
- [ ] Listing heading block is wrapped in `<div className="text-center">` so `<h1>` and subtitle render centered.
- [ ] Listing subtitle is exactly `Professional security testing tailored to your digital assets.`
- [ ] Listing renders exactly 5 cards, one per service, in order.
- [ ] Each listing card links to `/services/{slug}` via `<Link>` with `className="block"` and `key={service.slug}`.
- [ ] Each listing card shows the service icon at `h-6 w-6 text-accent-primary` with `aria-hidden="true"`.
- [ ] Each listing card shows `title` as `<h2>`, `shortDescription` as `<p>`, and first 3 items of `scope` via `.slice(0, 3).map(...)` as bullets with `CheckCircle2` at `h-4 w-4 text-state-success`.
- [ ] Each listing card's scope `<ul>` has `list-none pl-0`.
- [ ] Each listing card's scope `<li>` uses `flex items-center gap-2` (preview alignment).
- [ ] Each listing card's "Learn more" indicator uses `mt-auto pt-6` and contains `ArrowRight` at `h-4 w-4` with `aria-hidden="true"`.
- [ ] `app/(marketing)/services/[slug]/page.tsx` exists with signature `params: Promise<{ slug: string }>`, awaited before use.
- [ ] `generateStaticParams` returns one entry per service slug.
- [ ] `generateMetadata` signature is `({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata>`, awaits `params`, returns `{}` when slug unknown, and returns `{ title: \`${service.title} — Surakshayantra\`, description: service.shortDescription }` otherwise.
- [ ] Unknown slug triggers `notFound()` and renders existing `app/not-found.tsx`.
- [ ] `notFound()` is typed to return `never` (Next.js 15+); TypeScript narrows `service` to non-null after `if (!service) notFound();`.
- [ ] Detail page renders in order: Breadcrumb, Hero, Overview, Scope, Methodology, Deliverables, Bottom CTA.
- [ ] Breadcrumb `<ol>` contains only `<li>` children (each item wrapped in `<li>`).
- [ ] Breadcrumb separator `<li>` elements have `aria-hidden="true"`.
- [ ] Breadcrumb `<ol>` has `list-none pl-0`.
- [ ] Breadcrumb separator `ChevronRight` uses `h-4 w-4` (no `aria-hidden` on the icon itself — it's on the parent `<li>`).
- [ ] Breadcrumb last item uses `aria-current="page"`.
- [ ] Hero `<h1>` uses `text-4xl md:text-5xl` (no `lg:` tier). Intentional content-page hierarchy.
- [ ] Hero has `bg-gradient-glow` overlay with `pointer-events-none` and `aria-hidden="true"`, and content wrapper has `relative z-10`.
- [ ] Hero content is left-aligned (no `text-center`) inside `max-w-3xl`.
- [ ] Hero uses reduced padding `py-12 md:py-20`.
- [ ] Hero CTA is `Request Assessment` → `/sign-up` via `Button asChild`.
- [ ] Overview `<h2>` uses `text-2xl md:text-3xl`. Overview paragraph is `text-lg text-muted`.
- [ ] Scope `<h2>` uses `text-2xl md:text-3xl`. Each scope `<li>` uses `flex items-start gap-3` with `CheckCircle2` at `h-5 w-5 text-state-success`.
- [ ] Scope `<ul>` has `list-none pl-0`.
- [ ] Methodology `<h2>` uses `text-2xl md:text-3xl`. Each step renders a numbered circle at `h-8 w-8 text-sm` using `{index + 1}`.
- [ ] Methodology `<ol>` has `list-none pl-0`.
- [ ] Deliverables `<h2>` uses `text-2xl md:text-3xl`. Each item uses `flex items-start gap-3` with `CheckCircle2` at `h-5 w-5 text-state-success`.
- [ ] Deliverables `<ul>` has `list-none pl-0`.
- [ ] Bottom CTA `<h2>` uses `text-3xl md:text-4xl` and text is exactly `Ready to Strengthen Your Security?`
- [ ] Bottom CTA `<p>` text is exactly `Request a security assessment and discover where your digital assets need protection.`
- [ ] Bottom CTA button is `Request Assessment` → `/sign-up` via `Button asChild`.
- [ ] Every `.map()` uses a stable `key` (scope/deliverables: `item`; methodology: `step`; listing cards: `service.slug`).
- [ ] Listing page imports enumerated: `Metadata`, `Link`, `ArrowRight`, `CheckCircle2`, `Container`, `services`, `serviceIcons`.
- [ ] Detail page imports enumerated: `Metadata`, `notFound`, `Link`, `ChevronRight`, `CheckCircle2`, `Button`, `Container`, `getServiceBySlug`, `getAllServiceSlugs`.
- [ ] `Container` is imported as a default import (`import Container from "@/components/shared/container"`), matching the default export in `components/shared/container.tsx`.
- [ ] No `use client` anywhere.
- [ ] No data fetching, no Prisma, no API, no CMS imports.
- [ ] No files created outside `lib/services-data.ts`, `lib/service-icons.ts`, `app/(marketing)/services/page.tsx`, `app/(marketing)/services/[slug]/page.tsx`, and `context/progress-tracker.md`.
- [ ] No files modified in `components/ui/`, `components/shared/`, `components/marketing/`, `prisma/`, `app/api/`, or `app/layout.tsx`.
- [ ] Correct Tailwind utilities used (`text-primary`, `text-muted`, `bg-base`, `bg-surface`, `bg-elevated`, `border-default`, `text-accent-primary`, `text-state-success`). No `text-fg-*`, `bg-bg-*`, or `border-border-*`.
- [ ] No raw hex, no arbitrary Tailwind values, no `bg-[var(--…)]`.
- [ ] Only `transition-colors` used for hover transitions. No `animate-*`, no `framer-motion`, no keyframes.
- [ ] No mojibake characters in any source file. All arrows are `→`, em dashes are `—`.
- [ ] Dark theme renders correctly. Light theme renders correctly.
- [ ] Mobile (< 640px): listing single column; detail sections stack correctly.
- [ ] `md` (768px): listing shows 2 columns.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] `context/progress-tracker.md` updated with Unit 06 completion state and detailed sub-bullets.
- [ ] Backlog entry added under `## Future Enhancements / Backlog`: `- Admin-editable site content (services, headings, CTA labels, trust text) — needs Prisma model + admin routes + migration of lib/services-data.ts to DB.`
