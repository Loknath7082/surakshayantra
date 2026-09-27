import type { Metadata } from "next";
import Container from "@/components/shared/container";
import PageHero from "@/components/marketing/page-hero";
import SectionsBody from "@/components/marketing/sections-body";
import { aboutContent } from "@/lib/static-pages";

export const metadata: Metadata = {
  title: "About — Surakshayantra",
  description:
    "Learn about Surakshayantra, our offensive security philosophy, and our team of penetration testing specialists.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero title={aboutContent.hero.title} subtitle={aboutContent.hero.subtitle} />
      <section className="bg-surface">
        <Container className="py-20 md:py-28">
          <SectionsBody sections={aboutContent.sections} />
        </Container>
      </section>
    </>
  );
}
