import type { Metadata } from "next";
import { Mail } from "lucide-react";
import Container from "@/components/shared/container";
import PageHero from "@/components/marketing/page-hero";
import { contactContent } from "@/lib/static-pages";

export const metadata: Metadata = {
  title: "Contact — Surakshayantra",
  description:
    "Get in touch with Surakshayantra for security inquiries, assessments, or support.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero title={contactContent.hero.title} subtitle={contactContent.hero.subtitle} />
      <section className="bg-surface">
        <Container className="py-20 md:py-28">
          <div className="max-w-2xl space-y-8">
            <p className="text-base text-muted">{contactContent.intro}</p>
            <div className="rounded-md border border-default bg-elevated p-6 flex items-start gap-4">
              <Mail className="h-6 w-6 text-accent-primary shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-semibold text-primary">Email Support</h2>
                <p className="mt-1 text-sm text-muted">Direct communication with our team</p>
                <p className="mt-3 text-base">
                  <a
                    href={`mailto:${contactContent.supportEmail}`}
                    className="text-accent-primary hover:underline font-medium"
                  >
                    {contactContent.supportEmail}
                  </a>
                </p>
              </div>
            </div>
            <div className="rounded-md border border-default bg-elevated p-6 text-sm text-muted">
              <span>{contactContent.formNote}</span>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
