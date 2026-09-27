
# Unit 07: Static Content Pages + Contact Shell

## Goal

Build eight static marketing pages — About, Careers, Methodology, Responsible Disclosure, Privacy Policy, Terms of Service, PGP Key, and a Contact shell — all driven by centralized content in `lib/static-pages/`, sharing a reusable `PageHero` and `SectionsBody` component, with draft production-ready content that is easy to replace later. Legal pages display a visible "Draft — Pending Legal Review" warning and a placeholder "Last updated" line.

## Design

- Authoritative token mapping: see `context/ui-context.md` → "Token → Tailwind Mapping". Utilities used: `text-primary`, `text-muted`, `bg-base`, `bg-surface`, `bg-elevated`, `border-default`, `text-accent-primary`, `text-state-success`, `text-state-warning`, `bg-gradient-glow`, `font-mono`.
- Public marketing pages. Server Components. No auth, no DB, no API, no CMS, no forms in this unit (Contact form is Unit 14).
- Content source: `lib/static-pages/` with one file per page, a shared `types.ts`, and an `index.ts` re-export.
- Shared types live in `lib/static-pages/types.ts` — not duplicated across content files.
- **Layout component ownership (consistent):** All layout components are pure renderers — they do NOT wrap themselves in `<section>` or `<Container>`. Pages own their outer wrapper (`<section>` + `<Container>` + max-width).
  - Exception: `PageHero` owns its own `<section>` + `<Container>` because it always pairs the glow overlay with the section background and pages should never customize those. This exception is intentional and documented.
- Shared layout components:
  - `components/marketing/page-hero.tsx` — hero band (title `<h1>`, optional subtitle). Owns its section + Container.
  - `components/marketing/sections-body.tsx` — renders a list of `StaticPageSection` items. Pure renderer (no section, no Container).
  - `components/marketing/legal-page-body.tsx` — renders a list of `LegalSection` items. Pure renderer (no section, no Container).
- Routes (exact):
  - `/about`
  - `/careers`
  - `/methodology`
  - `/responsible-disclosure`
  - `/privacy`
  - `/terms`
  - `/pgp-key`
  - `/contact` (update existing shell)
- **Vertical padding (intentional):** Static pages use a lighter rhythm (`py-16 md:py-24`) for both `PageHero` and body sections. This differs from Unit 05/06 (`py-20 md:py-28`) because static content pages are text-dominant and benefit from slightly tighter spacing.
- **Alignment:** PageHero content wrapper uses `max-w-3xl` (left-aligned). Body section content wrapper also uses `max-w-3xl` (left-aligned, no `mx-auto`). Matches Unit 06.
- **Section spacing:**
  - Marketing-style body pages (About/Careers/Methodology/Responsible Disclosure): `space-y-12` between sections, no top margin after PageHero (PageHero provides visual separation).
  - Legal pages (Privacy/Terms): `space-y-12` between sections, with `mt-10` before the first section (because the "Last updated" line sits above and needs breathing room).
  - This difference is intentional and documented.
- **Section headings must be unique within a page** — they are used as React keys.
- **Section backgrounds:**
  - PageHero: `bg-base` + glow.
  - Body: `bg-surface` for About/Careers/Methodology/Responsible Disclosure/Contact/PGP Key.
  - Body: `bg-base` for Privacy/Terms (long-form reading surface).
  - Legal warning banner: `bg-elevated` with `border border-state-warning` and `text-state-warning`.
- **Content authorship:** Paragraph copy for all pages is authored by the implementing agent per the topical guidelines in each content file's spec. Bullet lists with exact strings are non-negotiable; paragraph copy is draft and expected to be revised before publication. No fabricated statistics, no certifications, no client names.
- **Email handling:**
  - Standalone email references (Contact page, Responsible Disclosure "How to Report" section, PGP Key "Send encrypted reports" line) render as `<a href="mailto:...">`.
  - Emails embedded inside content (paragraphs or list items that are not standalone references) — Privacy/Terms "Contact" sections, Careers "How to Apply" paragraph — render as plain text.
- **PGP / Responsible Disclosure cross-linking (symmetric, plain text, no internal links):**
  - Responsible Disclosure "How to Report" section's paragraph mentions PGP as an encryption option with a **plain-text reference** (no `<Link>`).
  - PGP Key page promotes the security email to a standalone paragraph with a `mailto:` link. Users navigate to `/pgp-key` from the footer (Legal column) or navbar.
  - This unit does not import Next.js `<Link>` anywhere. Internal navigation between static pages happens through the global navbar and footer (built in Unit 04).
- Contact page: single section `bg-surface` with heading + description + support email + a clearly-labeled note that the form arrives later.
- PGP Key page: intro paragraph, `<pre>` block with `font-mono` containing a clearly-labeled placeholder key, then "How to Use" bullet list (2 items — no email), then a standalone mailto line for the security email.
  - **PGP page bullet list is rendered inline** (not via `SectionsBody`) because the page interleaves prose, a `<pre>` key block, and a bullet list in a non-standard layout. This is intentional.
- Every page's `<h1>` comes from `PageHero`. Only one `<h1>` per page.
- Lists use `list-none pl-0`. Bullet lists use `CheckCircle2` icon bullets.
- Mail links use `<a href="mailto:...">`.
- Icons: `TriangleAlert` (lucide ^0.542 canonical name) for the draft banner; `CheckCircle2` for bullets.
- Tokens only. No raw hex, no arbitrary values, no `bg-[var(--…)]`.
- No mojibake. Arrows `→`, em dashes `—`.

## Implementation

### `lib/static-pages/types.ts`

- Pure type module. No React, no Next.js imports.
- Exports:
  ```ts
  export type StaticPageHero = {
    readonly title: string;
    readonly subtitle: string;
  };

  export type StaticPageSection = {
    readonly heading: string;
    readonly paragraphs?: readonly string[];
    readonly list?: readonly string[];
    readonly contactEmail?: string;
  };

  export type LegalSection = {
    readonly heading: string;
    readonly paragraphs: readonly string[];
  };
  ```
- `contactEmail` renders as a standalone `<a href="mailto:...">` line below the section's paragraphs and list (if any).
- `listType` is not included — only bullet lists are supported in this unit.
- Sections with no `paragraphs`, no `list`, and no `contactEmail` are skipped at render time (no console output). Content files must populate at least one field — verified separately.

### `components/marketing/page-hero.tsx`

- Server Component. Owns its `<section>` + `<Container>`.
- Props:
  ```ts
  type PageHeroProps = { title: string; subtitle?: string };
  ```
- Imports: `Container` default from `@/components/shared/container`.
- Renders:
  ```tsx
  <section className="relative overflow-hidden bg-base">
    <div className="pointer-events-none absolute inset-0 bg-gradient-glow" aria-hidden="true" />
    <div className="relative z-10">
      <Container className="py-16 md:py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">{title}</h1>
          {subtitle ? <p className="mt-6 text-lg text-muted">{subtitle}</p> : null}
        </div>
      </Container>
    </div>
  </section>
  ```
- `PageHeroProps.subtitle` is optional; `StaticPageHero.subtitle` is required. This asymmetry is intentional — the component is flexible, every content file provides a subtitle.

### `components/marketing/sections-body.tsx`

- Server Component. Pure renderer — no `<section>`, no `<Container>`.
- Imports: `CheckCircle2` from `lucide-react`; `type StaticPageSection` from `@/lib/static-pages/types`.
- Props:
  ```ts
  type SectionsBodyProps = { sections: readonly StaticPageSection[] };
  ```
- Skips sections with no content.
- Renders:
  ```tsx
  <div className="max-w-3xl space-y-12">
    {sections.map((section) => {
      const hasContent =
        (section.paragraphs && section.paragraphs.length > 0) ||
        (section.list && section.list.length > 0) ||
        Boolean(section.contactEmail);
      if (!hasContent) return null;
      return (
        <div key={section.heading}>
          <h2 className="text-2xl md:text-3xl font-bold text-primary">{section.heading}</h2>
          {section.paragraphs && section.paragraphs.length > 0 ? (
            <div className="mt-4 space-y-4">
              {section.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-base text-muted">{paragraph}</p>
              ))}
            </div>
          ) : null}
          {section.list && section.list.length > 0 ? (
            <ul className="mt-4 space-y-2 list-none pl-0">
              {section.list.map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-state-success shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {section.contactEmail ? (
            <p className="mt-4 text-base">
              <a
                href={`mailto:${section.contactEmail}`}
                className="text-accent-primary hover:underline"
              >
                {section.contactEmail}
              </a>
            </p>
          ) : null}
        </div>
      );
    })}
  </div>
  ```
- `key={index}` on paragraphs is intentional for static content.

### `components/marketing/legal-page-body.tsx`

- Server Component. Pure renderer — no `<section>`, no `<Container>`.
- Imports: `TriangleAlert` from `lucide-react`; `type LegalSection` from `@/lib/static-pages/types`.
- Props:
  ```ts
  type LegalPageBodyProps = {
    lastUpdated: string;
    showDraftBanner: boolean;
    sections: readonly LegalSection[];
  };
  ```
- Renders:
  ```tsx
  <div className="max-w-3xl">
    {showDraftBanner ? (
      <div className="mb-8 flex items-start gap-3 rounded-md border border-state-warning bg-elevated p-4 text-sm text-state-warning">
        <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <span>Draft — Pending Legal Review</span>
      </div>
    ) : null}
    <p className="text-sm text-muted">Last updated: {lastUpdated}</p>
    <div className="mt-10 space-y-12">
      {sections.map((section) => (
        <div key={section.heading}>
          <h2 className="text-2xl md:text-3xl font-bold text-primary">{section.heading}</h2>
          <div className="mt-4 space-y-4">
            {section.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-base text-muted">{paragraph}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
  ```
- `LegalSection` has no `list`/`contactEmail` fields — legal documents are paragraph-only in this unit.
- "Introduction" is rendered as `<h2>` for consistency with all other legal sections. Intentional.

### `lib/static-pages/about.ts`

- Imports types from `./types`.
- Exports `aboutContent`:
  - **hero**: `{ title: "About", subtitle: "A cybersecurity services company focused on finding what others miss." }`
  - **sections**:
    1. `{ heading: "Who We Are", paragraphs: [<2 paragraphs — agent-authored>] }`
    2. `{ heading: "Our Approach", paragraphs: [<1 paragraph>], list: ["Manual testing led by experienced engineers", "Aligned with OWASP, PTES, and industry standards", "Evidence-driven findings with reproduction steps", "Actionable remediation guidance"] }`
    3. `{ heading: "Why Clients Choose Us", list: ["Senior engineers on every engagement", "Clear reporting written for both executives and developers", "No false positives — every finding is validated", "Post-fix retest included"] }`

### `lib/static-pages/careers.ts`

- Exports `careersContent`:
  - **hero**: `{ title: "Careers", subtitle: "Join a team of security engineers who take the craft seriously." }`
  - **sections**:
    1. `{ heading: "Our Culture", paragraphs: [<2 paragraphs>] }`
    2. `{ heading: "How We Work", list: ["Small, senior teams", "Deep focus over busy work", "Remote-friendly with clear communication", "Continuous learning and tool investment"] }`
    3. `{ heading: "What We Look For", list: ["Strong fundamentals in web and network security", "Comfort with manual testing over purely automated tools", "Clear written communication", "Curiosity and an attacker mindset"] }`
    4. `{ heading: "How to Apply", paragraphs: [<1 paragraph — includes support@surakshayantra.com as plain text; users copy it>] }`

### `lib/static-pages/methodology.ts`

- Exports `methodologyContent`:
  - **hero**: `{ title: "Methodology", subtitle: "A structured, repeatable process aligned with industry standards." }`
  - **sections** (each 1–2 paragraphs):
    1. `Reconnaissance`
    2. `Scanning`
    3. `Vulnerability Analysis`
    4. `Exploitation`
    5. `Reporting & Retest`

### `lib/static-pages/responsible-disclosure.ts`

- Exports `responsibleDisclosureContent`:
  - **hero**: `{ title: "Responsible Disclosure", subtitle: "How to report a security vulnerability to us." }`
  - **sections**:
    1. `{ heading: "Our Commitment", paragraphs: [<1 paragraph>] }`
    2. `{ heading: "How to Report", paragraphs: ["For sensitive reports, encrypt your message using our PGP key listed on the PGP Key page. Otherwise, email us directly at the address below."], contactEmail: "security@surakshayantra.com" }`
    3. `{ heading: "What to Include", list: ["Description of the vulnerability", "Steps to reproduce", "Proof of concept or screenshots", "Affected URLs, endpoints, or components", "Your contact details for follow-up"] }`
    4. `{ heading: "What to Expect", list: ["Acknowledgment within 3 business days", "Triage and validation", "Status updates as we investigate", "Credit if you wish after remediation"] }`
    5. `{ heading: "Guidelines", list: ["Do not access or modify data that is not yours", "Do not disrupt production systems", "Do not publicly disclose before a fix is available", "Give us reasonable time to remediate"] }`
    6. `{ heading: "Out of Scope", list: ["Automated scanner output without validation", "Social engineering of staff", "Physical attacks", "Denial-of-service testing"] }`

### `lib/static-pages/privacy.ts`

- Exports `privacyContent`:
  - **hero**: `{ title: "Privacy Policy", subtitle: "How we collect, use, and protect your information." }`
  - **lastUpdated**: `"To be set on final publication"`
  - **sections** (`LegalSection[]`):
    1. `Introduction`
    2. `Information We Collect`
    3. `How We Use Your Information`
    4. `Cookies and Similar Technologies`
    5. `Third-Party Services` — mentions Clerk, Vercel, Prisma Postgres, Vercel Blob as processors.
    6. `Data Retention`
    7. `Your Rights`
    8. `Data Security`
    9. `Children's Privacy`
    10. `Changes to This Policy`
    11. `Contact` — mentions `support@surakshayantra.com` as plain text.

### `lib/static-pages/terms.ts`

- Exports `termsContent`:
  - **hero**: `{ title: "Terms of Service", subtitle: "The terms that govern your use of our services." }`
  - **lastUpdated**: `"To be set on final publication"`
  - **sections** (`LegalSection[]`):
    1. `Acceptance of Terms`
    2. `Use of Services`
    3. `Accounts and Access`
    4. `Intellectual Property`
    5. `Prohibited Uses`
    6. `Disclaimers`
    7. `Limitation of Liability`
    8. `Indemnification`
    9. `Governing Law`
    10. `Changes to These Terms`
    11. `Contact` — mentions `support@surakshayantra.com` as plain text.

### `lib/static-pages/pgp-key.ts`

- Exports `pgpKeyContent`:
  - **hero**: `{ title: "PGP Key", subtitle: "Use our public key to encrypt sensitive communications." }`
  - **intro**: `"When sending sensitive information — such as vulnerability reports or confidential messages — please encrypt your message to our public key."`
  - **keyLabel**: `"Public Key (Placeholder — to be replaced with the real key)"`
  - **publicKeyPlaceholder**: template literal (backticks) with the placeholder content on its own lines, no leading indentation inside the string:
    ```ts
    publicKeyPlaceholder: `-----BEGIN PGP PUBLIC KEY BLOCK-----
    PLACEHOLDER — REPLACE WITH ACTUAL PUBLIC KEY BEFORE PUBLISHING
    -----END PGP PUBLIC KEY BLOCK-----`,
    ```
  - **usageInstructions**: `["Import the key into your PGP client", "Encrypt your message to this key"]`
  - **securityEmail**: `"security@surakshayantra.com"`

### `lib/static-pages/contact.ts`

- Exports `contactContent`:
  - **hero**: `{ title: "Contact", subtitle: "Get in touch with the Surakshayantra team." }`
  - **intro**: `"For general questions, partnership inquiries, or support, email us directly. We aim to reply within a few business days."`
  - **supportEmail**: `"support@surakshayantra.com"`
  - **formNote**: `"A contact form will be available soon. In the meantime, please email us directly."`

### `lib/static-pages/index.ts`

- Re-exports every page content module:
  ```ts
  export { aboutContent } from "./about";
  export { careersContent } from "./careers";
  export { methodologyContent } from "./methodology";
  export { responsibleDisclosureContent } from "./responsible-disclosure";
  export { privacyContent } from "./privacy";
  export { termsContent } from "./terms";
  export { pgpKeyContent } from "./pgp-key";
  export { contactContent } from "./contact";
  ```
- No type re-exports.

### Page files

Each page: Server Component, `import type { Metadata } from "next"`, exports `metadata: Metadata`. Owns its own `<section>` + `<Container>` wrapper.

#### `app/(marketing)/about/page.tsx`

```tsx
import type { Metadata } from "next";
import Container from "@/components/shared/container";
import PageHero from "@/components/marketing/page-hero";
import SectionsBody from "@/components/marketing/sections-body";
import { aboutContent } from "@/lib/static-pages/about";

export const metadata: Metadata = {
  title: "About — Surakshayantra",
  description: aboutContent.hero.subtitle,
};

export default function AboutPage() {
  return (
    <>
      <PageHero title={aboutContent.hero.title} subtitle={aboutContent.hero.subtitle} />
      <section className="bg-surface">
        <Container className="py-16 md:py-24">
          <SectionsBody sections={aboutContent.sections} />
        </Container>
      </section>
    </>
  );
}
```

#### `app/(marketing)/careers/page.tsx`

- Same shape as About. Uses `careersContent`. Title `Careers — Surakshayantra`.

#### `app/(marketing)/methodology/page.tsx`

- Same shape as About. Uses `methodologyContent`. Title `Methodology — Surakshayantra`.

#### `app/(marketing)/responsible-disclosure/page.tsx`

- Same shape as About. Uses `responsibleDisclosureContent`. Title `Responsible Disclosure — Surakshayantra`.

#### `app/(marketing)/privacy/page.tsx`

```tsx
import type { Metadata } from "next";
import Container from "@/components/shared/container";
import PageHero from "@/components/marketing/page-hero";
import LegalPageBody from "@/components/marketing/legal-page-body";
import { privacyContent } from "@/lib/static-pages/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy — Surakshayantra",
  description: privacyContent.hero.subtitle,
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero title={privacyContent.hero.title} subtitle={privacyContent.hero.subtitle} />
      <section className="bg-base">
        <Container className="py-16 md:py-24">
          <LegalPageBody
            lastUpdated={privacyContent.lastUpdated}
            showDraftBanner={true}
            sections={privacyContent.sections}
          />
        </Container>
      </section>
    </>
  );
}
```

#### `app/(marketing)/terms/page.tsx`

- Same shape as privacy. Uses `termsContent`. Title `Terms of Service — Surakshayantra`.

#### `app/(marketing)/pgp-key/page.tsx`

```tsx
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import Container from "@/components/shared/container";
import PageHero from "@/components/marketing/page-hero";
import { pgpKeyContent } from "@/lib/static-pages/pgp-key";

export const metadata: Metadata = {
  title: "PGP Key — Surakshayantra",
  description: pgpKeyContent.hero.subtitle,
};

export default function PgpKeyPage() {
  return (
    <>
      <PageHero title={pgpKeyContent.hero.title} subtitle={pgpKeyContent.hero.subtitle} />
      <section className="bg-surface">
        <Container className="py-16 md:py-24">
          <div className="max-w-3xl">
            <p className="text-base text-muted">{pgpKeyContent.intro}</p>
            <h2 className="mt-10 text-2xl md:text-3xl font-bold text-primary">{pgpKeyContent.keyLabel}</h2>
            <pre className="mt-4 overflow-x-auto rounded-md border border-default bg-elevated p-4 text-sm text-primary font-mono">
              {pgpKeyContent.publicKeyPlaceholder}
            </pre>
            <h2 className="mt-10 text-2xl md:text-3xl font-bold text-primary">How to Use</h2>
            <ul className="mt-4 space-y-2 list-none pl-0">
              {pgpKeyContent.usageInstructions.map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-state-success shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-base text-muted">
              Send encrypted reports to{" "}
              <a
                href={`mailto:${pgpKeyContent.securityEmail}`}
                className="text-accent-primary hover:underline"
              >
                {pgpKeyContent.securityEmail}
              </a>
              .
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
```

#### `app/(marketing)/contact/page.tsx`

```tsx
import type { Metadata } from "next";
import Container from "@/components/shared/container";
import PageHero from "@/components/marketing/page-hero";
import { contactContent } from "@/lib/static-pages/contact";

export const metadata: Metadata = {
  title: "Contact — Surakshayantra",
  description: contactContent.hero.subtitle,
};

export default function ContactPage() {
  return (
    <>
      <PageHero title={contactContent.hero.title} subtitle={contactContent.hero.subtitle} />
      <section className="bg-surface">
        <Container className="py-16 md:py-24">
          <div className="max-w-3xl">
            <p className="text-base text-muted">{contactContent.intro}</p>
            <p className="mt-6 text-base text-muted">
              Email:{" "}
              <a
                href={`mailto:${contactContent.supportEmail}`}
                className="text-accent-primary hover:underline"
              >
                {contactContent.supportEmail}
              </a>
            </p>
            <p className="mt-6 text-sm text-muted">{contactContent.formNote}</p>
          </div>
        </Container>
      </section>
    </>
  );
}
```

## Dependencies

- None. `lucide-react`, shadcn components, and `Container` are already installed.
- Pre-implementation checks (verified at spec authoring time; re-verify if codebase changes):
  - `components/shared/container.tsx` uses `export default function Container`.
  - `app/globals.css` defines `--font-mono` → `font-mono` utility maps to JetBrains Mono.
  - `lucide-react` version is `^0.542.0` — use `TriangleAlert` (not deprecated `AlertTriangle`).
  - `app/(marketing)/layout.tsx` exists (created in Unit 04).
  - `components/shared/footer.tsx` contains `{ label: "PGP Key", href: "/pgp-key" }` in the Legal column — confirming `/pgp-key` is reachable from the global footer. Verified: present.
  - Existing `app/(marketing)/contact/page.tsx` contains the "Contact form coming soon." stub from Unit 04/05.

## Verify when done

- [ ] `lib/static-pages/` directory exists with `types.ts`, `about.ts`, `careers.ts`, `methodology.ts`, `responsible-disclosure.ts`, `privacy.ts`, `terms.ts`, `pgp-key.ts`, `contact.ts`, `index.ts`.
- [ ] `lib/static-pages/types.ts` exports `StaticPageHero`, `StaticPageSection`, `LegalSection`.
- [ ] `StaticPageSection` has no `listType` field.
- [ ] `LegalSection` contains only `heading` and `paragraphs`.
- [ ] No content file duplicates type definitions — each imports from `./types`.
- [ ] `lib/static-pages/index.ts` re-exports all eight content modules.
- [ ] `lib/static-pages/index.ts` does not re-export types.
- [ ] No content file imports React or Next.js.
- [ ] All content objects are `readonly`.
- [ ] Every `StaticPageSection` in every content file has at least one of `paragraphs`, `list`, or `contactEmail` populated.
- [ ] Every `LegalSection` in privacy and terms has a non-empty `paragraphs` array.
- [ ] All section headings within each content file are unique (used as React keys).
- [ ] `components/marketing/page-hero.tsx` exists, is a Server Component, accepts `{ title: string; subtitle?: string }`, uses `py-16 md:py-24`, `max-w-3xl` (no `mx-auto`), glow overlay with `pointer-events-none` + `aria-hidden="true"`, and content wrapper with `relative z-10`.
- [ ] `components/marketing/sections-body.tsx` exists, is a pure renderer (no `<section>`, no `<Container>`), accepts `{ sections: readonly StaticPageSection[] }`, renders heading + paragraphs + optional bullet list + optional `contactEmail` as `mailto:` link, and skips sections with no content (no console output).
- [ ] `components/marketing/legal-page-body.tsx` exists, is a pure renderer (no `<section>`, no `<Container>`), accepts `{ lastUpdated, showDraftBanner, sections }`, uses `mt-10` before the first section, and renders draft banner when `showDraftBanner` is true.
- [ ] No component referenced in any page file is undefined.
- [ ] Draft banner uses `TriangleAlert` from `lucide-react`.
- [ ] Draft banner text is exactly `Draft — Pending Legal Review`.
- [ ] Draft banner uses `border-state-warning`, `bg-elevated`, `text-state-warning`.
- [ ] `app/(marketing)/about/page.tsx` exists, exports `metadata: Metadata` with title `About — Surakshayantra`, uses hero title `About` (no brand suffix), and renders `<PageHero>` + `<section className="bg-surface">` + `<Container>` + `<SectionsBody>`.
- [ ] `app/(marketing)/careers/page.tsx` exists with the same structure. Metadata title `Careers — Surakshayantra`.
- [ ] `app/(marketing)/methodology/page.tsx` exists with the same structure. Metadata title `Methodology — Surakshayantra`.
- [ ] `app/(marketing)/responsible-disclosure/page.tsx` exists with the same structure. Metadata title `Responsible Disclosure — Surakshayantra`.
- [ ] Responsible Disclosure "How to Report" section renders `security@surakshayantra.com` as a `mailto:` link (via `SectionsBody`'s `contactEmail` handling).
- [ ] Responsible Disclosure "How to Report" section's paragraph references the PGP Key page as plain text (no `<Link>`, no `<a>` to `/pgp-key`).
- [ ] `app/(marketing)/privacy/page.tsx` exists, uses `<LegalPageBody>` with `showDraftBanner={true}` and `lastUpdated="To be set on final publication"`, wrapped in `<section className="bg-base">` + `<Container>`. Metadata title `Privacy Policy — Surakshayantra`.
- [ ] `app/(marketing)/terms/page.tsx` exists with the same structure. Metadata title `Terms of Service — Surakshayantra`.
- [ ] `app/(marketing)/pgp-key/page.tsx` exists and renders a `<pre>` block using `font-mono` with the placeholder content from `pgpKeyContent.publicKeyPlaceholder`.
- [ ] Placeholder key string contains the word `PLACEHOLDER`.
- [ ] PGP page "How to Use" list has exactly 2 items (`usageInstructions`) and does NOT contain the security email.
- [ ] PGP page renders the security email as a standalone paragraph below the list, wrapped in `<a href="mailto:security@surakshayantra.com">`.
- [ ] `app/(marketing)/contact/page.tsx` replaces the old stub; renders `<PageHero>` + intro + `support@surakshayantra.com` as `mailto:` link + form note.
- [ ] No page renders more than one `<h1>`.
- [ ] Every `metadata` export uses title format `{Page title} — Surakshayantra`.
- [ ] Every `metadata` export imports `type { Metadata } from "next"`.
- [ ] Every `<ul>` and `<ol>` uses `list-none pl-0`.
- [ ] Every `.map()` has a stable `key` (paragraphs use `index` — intentional for static content; sections use `section.heading`; list items use `item`).
- [ ] Mail links use `<a href="mailto:...">`, not Next.js `<Link>`.
- [ ] No page or component imports `Link` from `next/link` in this unit.
- [ ] `/pgp-key` is reachable from the global footer (pre-check confirmed via `components/shared/footer.tsx`).
- [ ] Correct Tailwind utilities used (`text-primary`, `text-muted`, `bg-base`, `bg-surface`, `bg-elevated`, `border-default`, `text-accent-primary`, `text-state-success`, `text-state-warning`, `bg-gradient-glow`, `font-mono`). No `text-fg-*`, `bg-bg-*`, or `border-border-*`.
- [ ] No raw hex, no arbitrary Tailwind values, no `bg-[var(--…)]`.
- [ ] Only `transition-colors` used for hover transitions. No `animate-*`, no `framer-motion`, no keyframes.
- [ ] No mojibake characters in any source file. Arrows `→`, em dashes `—`.
- [ ] No `use client` anywhere in this unit.
- [ ] No data fetching, no Prisma, no API, no CMS imports.
- [ ] No `<form>`, no input elements, no form fields created in this unit — Contact remains a shell.
- [ ] No fabricated statistics, no fake certifications, no fake client names in any content file.
- [ ] Paragraph copy is on-topic per the section descriptions in the spec.
- [ ] No files created outside `lib/static-pages/`, `components/marketing/page-hero.tsx`, `components/marketing/sections-body.tsx`, `components/marketing/legal-page-body.tsx`, the eight page files under `app/(marketing)/`, and `context/progress-tracker.md`.
- [ ] No files modified in `components/ui/`, `components/shared/`, `components/marketing/hero.tsx`, `components/marketing/services-overview.tsx`, `components/marketing/methodology-preview.tsx`, `components/marketing/trust-indicators.tsx`, `components/marketing/closing-cta.tsx`, `prisma/`, `app/api/`, or `app/layout.tsx`.
- [ ] Dark theme renders correctly. Light theme renders correctly.
- [ ] Mobile (< 640px): hero stacks; legal sections readable; PGP `<pre>` scrolls horizontally.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] `context/progress-tracker.md` updated with Unit 07 completion state and detailed sub-bullets.
```

