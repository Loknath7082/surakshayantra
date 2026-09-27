import type { Metadata } from "next";
import Container from "@/components/shared/container";
import PageHero from "@/components/marketing/page-hero";
import LegalPageBody from "@/components/marketing/legal-page-body";
import { termsContent } from "@/lib/static-pages";

export const metadata: Metadata = {
  title: "Terms of Service — Surakshayantra",
  description:
    "Read the terms, conditions, and user agreements that govern the use of Surakshayantra services.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero title={termsContent.hero.title} subtitle={termsContent.hero.subtitle} />
      <section className="bg-surface">
        <Container className="py-20 md:py-28">
          <LegalPageBody
            lastUpdated={termsContent.lastUpdated}
            showDraftBanner={true}
            sections={termsContent.sections}
          />
        </Container>
      </section>
    </>
  );
}
