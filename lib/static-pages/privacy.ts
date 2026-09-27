import type { StaticPageHero, LegalSection } from "./types";

export const privacyContent: {
  readonly hero: StaticPageHero;
  readonly lastUpdated: string;
  readonly sections: readonly LegalSection[];
} = {
  hero: {
    title: "Privacy Policy",
    subtitle: "How we collect, use, and protect your information.",
  },
  lastUpdated: "To be set on final publication",
  sections: [
    {
      heading: "Introduction",
      paragraphs: [
        "Surakshayantra is committed to protecting your privacy. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of your information when you access our marketing website and client portal.",
      ],
    },
    {
      heading: "Information We Collect",
      paragraphs: [
        "We collect information you provide directly to us when creating an account, requesting security testing assessments, or contacting our team. This may include your name, business email address, company name, phone number, and technical assessment details.",
        "We also collect basic technical data automatically when you interact with our site, including IP addresses, browser types, and session tokens necessary for authentication and security monitoring.",
      ],
    },
    {
      heading: "How We Use Your Information",
      paragraphs: [
        "We use your information to provide, maintain, and improve our security testing services, authenticate client portal access, manage customer accounts, and communicate with you regarding requested assessments.",
        "We do not sell, rent, or trade your personal information to third parties for marketing purposes.",
      ],
    },
    {
      heading: "Cookies and Similar Technologies",
      paragraphs: [
        "We use essential cookies to maintain user authentication sessions and preserve your visual theme preference (dark or light mode). These cookies are strictly necessary for core site functionality.",
      ],
    },
    {
      heading: "Third-Party Services",
      paragraphs: [
        "We engage trusted third-party service providers to process data and host infrastructure on our behalf. These include Clerk for authentication and user identity management, Vercel for web application hosting, Prisma Postgres for structured database persistence, and Vercel Blob for secure document and image storage.",
        "Each processor is bound by strict confidentiality obligations and is authorized to process data solely to provide services to Surakshayantra.",
      ],
    },
    {
      heading: "Data Retention",
      paragraphs: [
        "We retain personal data and security assessment metadata only for as long as necessary to fulfill the purposes for which it was collected, satisfy legal obligations, resolve disputes, and enforce our agreements.",
      ],
    },
    {
      heading: "Your Rights",
      paragraphs: [
        "Depending on your jurisdiction, you may have the right to request access to, correction of, or deletion of your personal data. You may also request a copy of the data we hold about you.",
      ],
    },
    {
      heading: "Data Security",
      paragraphs: [
        "We employ industry-standard technical and organizational safeguards designed to protect your personal information against unauthorized access, destruction, loss, alteration, or disclosure.",
      ],
    },
    {
      heading: "Children's Privacy",
      paragraphs: [
        "Our services are strictly directed toward enterprise businesses and working professionals. We do not knowingly collect personal information from individuals under the age of 18.",
      ],
    },
    {
      heading: "Changes to This Policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time to reflect changes in our operational, legal, or regulatory practices. Material changes will be posted on this page with an updated revision date.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [
        "If you have questions or concerns about this Privacy Policy or our data handling practices, please contact us at support@surakshayantra.com.",
      ],
    },
  ],
};
