import type { Metadata } from "next";
import Container from "@/components/shared/container";
import PageHero from "@/components/marketing/page-hero";
import SectionsBody from "@/components/marketing/sections-body";
import { careersContent } from "@/lib/static-pages";

export const metadata: Metadata = {
  title: "Careers — Surakshayantra",
  description:
    "Explore career opportunities at Surakshayantra and join our team of offensive security specialists.",
};

export default function CareersPage() {
  return (
    <>
      <PageHero title={careersContent.hero.title} subtitle={careersContent.hero.subtitle} />
      <section className="bg-surface">
        <Container className="py-20 md:py-28">
          <SectionsBody sections={careersContent.sections} />
        </Container>
      </section>
    </>
  );
}
