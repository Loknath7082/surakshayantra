import type { StaticPageHero, StaticPageSection } from "./types";

export const responsibleDisclosureContent: {
  readonly hero: StaticPageHero;
  readonly sections: readonly StaticPageSection[];
} = {
  hero: {
    title: "Responsible Disclosure",
    subtitle: "How to report a security vulnerability to us.",
  },
  sections: [
    {
      heading: "Our Commitment",
      paragraphs: [
        "Security is central to our mission at Surakshayantra. We appreciate the efforts of security researchers who discover vulnerabilities and work with us in good faith to protect our users and infrastructure.",
      ],
    },
    {
      heading: "How to Report",
      paragraphs: [
        "For sensitive reports, encrypt your message using our PGP key listed on the PGP Key page. Otherwise, email us directly at the address below.",
      ],
      contactEmail: "security@surakshayantra.com",
    },
    {
      heading: "What to Include",
      list: [
        "Description of the vulnerability",
        "Steps to reproduce",
        "Proof of concept or screenshots",
        "Affected URLs, endpoints, or components",
        "Your contact details for follow-up",
      ],
    },
    {
      heading: "What to Expect",
      list: [
        "Acknowledgment within 3 business days",
        "Triage and validation",
        "Status updates as we investigate",
        "Credit if you wish after remediation",
      ],
    },
    {
      heading: "Guidelines",
      list: [
        "Do not access or modify data that is not yours",
        "Do not disrupt production systems",
        "Do not publicly disclose before a fix is available",
        "Give us reasonable time to remediate",
      ],
    },
    {
      heading: "Out of Scope",
      list: [
        "Automated scanner output without validation",
        "Social engineering of staff",
        "Physical attacks",
        "Denial-of-service testing",
      ],
    },
  ],
};
