import type { Metadata } from "next";
import Container from "@/components/shared/container";
import PageHero from "@/components/marketing/page-hero";
import SectionsBody from "@/components/marketing/sections-body";
import { responsibleDisclosureContent } from "@/lib/static-pages";

export const metadata: Metadata = {
  title: "Responsible Disclosure — Surakshayantra",
  description:
    "Guidelines for reporting security vulnerabilities to Surakshayantra safely and responsibly.",
};

export default function ResponsibleDisclosurePage() {
  return (
    <>
      <PageHero
        title={responsibleDisclosureContent.hero.title}
        subtitle={responsibleDisclosureContent.hero.subtitle}
      />
      <section className="bg-surface">
        <Container className="py-20 md:py-28">
          <SectionsBody sections={responsibleDisclosureContent.sections} />
        </Container>
      </section>
    </>
  );
}
