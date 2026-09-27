import type { StaticPageHero, LegalSection } from "./types";

export const termsContent: {
  readonly hero: StaticPageHero;
  readonly lastUpdated: string;
  readonly sections: readonly LegalSection[];
} = {
  hero: {
    title: "Terms of Service",
    subtitle: "The terms that govern your use of our services.",
  },
  lastUpdated: "To be set on final publication",
  sections: [
    {
      heading: "Acceptance of Terms",
      paragraphs: [
        "By accessing or using the Surakshayantra website, client portal, or security testing services, you agree to be bound by these Terms of Service and all applicable laws and regulations.",
      ],
    },
    {
      heading: "Use of Services",
      paragraphs: [
        "You agree to use our website and services only for legitimate business and security assessment purposes. You represent and warrant that you have full authorization and legal rights to request testing on any digital assets, domains, or infrastructure submitted to us.",
      ],
    },
    {
      heading: "Accounts and Access",
      paragraphs: [
        "When creating an account, you must provide accurate and complete information. You are responsible for safeguarding your credentials and for all activities that occur under your account.",
      ],
    },
    {
      heading: "Intellectual Property",
      paragraphs: [
        "All materials, designs, documentation, and software provided by Surakshayantra remain the exclusive property of Surakshayantra and its licensors. Security reports delivered to clients upon completion of an engagement are subject to the specific terms of the applicable services agreement.",
      ],
    },
    {
      heading: "Prohibited Uses",
      paragraphs: [
        "You may not use our website to transmit malicious code, attempt unauthorized access to our internal systems, disrupt site availability, or misrepresent your identity or company affiliation.",
      ],
    },
    {
      heading: "Disclaimers",
      paragraphs: [
        "Our website and public content are provided on an 'as is' and 'as available' basis. While we strive for accuracy, Surakshayantra makes no warranties, express or implied, regarding site availability, uptime, or error-free operation.",
      ],
    },
    {
      heading: "Limitation of Liability",
      paragraphs: [
        "To the fullest extent permitted by law, Surakshayantra and its officers, employees, or agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or inability to use the site.",
      ],
    },
    {
      heading: "Indemnification",
      paragraphs: [
        "You agree to indemnify and hold harmless Surakshayantra from and against any claims, liabilities, damages, losses, and expenses arising out of your violation of these Terms or misuse of our services.",
      ],
    },
    {
      heading: "Governing Law",
      paragraphs: [
        "These Terms shall be governed by and construed in accordance with the applicable laws of our operating jurisdiction, without regard to its conflict of law principles.",
      ],
    },
    {
      heading: "Changes to These Terms",
      paragraphs: [
        "We reserve the right to modify these Terms of Service at any time. Any changes will become effective immediately upon posting to this website.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [
        "If you have questions regarding these Terms of Service, please contact us at support@surakshayantra.com.",
      ],
    },
  ],
};
