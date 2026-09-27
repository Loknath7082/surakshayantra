import type { Metadata } from "next";
import Container from "@/components/shared/container";
import PageHero from "@/components/marketing/page-hero";
import LegalPageBody from "@/components/marketing/legal-page-body";
import { privacyContent } from "@/lib/static-pages";

export const metadata: Metadata = {
  title: "Privacy Policy — Surakshayantra",
  description:
    "Learn how Surakshayantra collects, uses, and safeguards your personal and technical data.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero title={privacyContent.hero.title} subtitle={privacyContent.hero.subtitle} />
      <section className="bg-surface">
        <Container className="py-20 md:py-28">
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
