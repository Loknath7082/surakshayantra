import type { Metadata } from "next";
import Container from "@/components/shared/container";
import PageHero from "@/components/marketing/page-hero";
import SectionsBody from "@/components/marketing/sections-body";
import { methodologyContent } from "@/lib/static-pages";

export const metadata: Metadata = {
  title: "Methodology — Surakshayantra",
  description:
    "Explore our 5-phase security assessment methodology aligned with OWASP, PTES, and industry standards.",
};

export default function MethodologyPage() {
  return (
    <>
      <PageHero title={methodologyContent.hero.title} subtitle={methodologyContent.hero.subtitle} />
      <section className="bg-surface">
        <Container className="py-20 md:py-28">
          <SectionsBody sections={methodologyContent.sections} />
        </Container>
      </section>
    </>
  );
}
