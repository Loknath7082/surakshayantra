import type { StaticPageHero } from "./types";

export const contactContent: {
  readonly hero: StaticPageHero;
  readonly intro: string;
  readonly supportEmail: string;
  readonly formNote: string;
} = {
  hero: {
    title: "Contact",
    subtitle: "Get in touch with the Surakshayantra team.",
  },
  intro:
    "For general questions, partnership inquiries, or support, email us directly. We aim to reply within a few business days.",
  supportEmail: "support@surakshayantra.com",
  formNote: "A contact form will be available soon. In the meantime, please email us directly.",
};
