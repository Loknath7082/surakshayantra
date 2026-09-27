import type { StaticPageHero, StaticPageSection } from "./types";

export const aboutContent: {
  readonly hero: StaticPageHero;
  readonly sections: readonly StaticPageSection[];
} = {
  hero: {
    title: "About",
    subtitle: "A cybersecurity services company focused on finding what others miss.",
  },
  sections: [
    {
      heading: "Who We Are",
      paragraphs: [
        "Surakshayantra is an independent security testing firm dedicated to helping modern engineering teams build resilient systems. We specialize in manual penetration testing, vulnerability assessments, and comprehensive security reviews across cloud, web, mobile, and API environments.",
        "Our engineers combine deep offensive security expertise with a developer-first approach to uncover vulnerabilities that automated scanners overlook, delivering clear remediation roadmaps tailored to your stack.",
      ],
    },
    {
      heading: "Our Approach",
      paragraphs: [
        "We believe that real security requires human insight and rigorous methodology. Every assessment is led by experienced practitioners who simulate real-world attack paths against your critical assets.",
      ],
      list: [
        "Manual testing led by experienced engineers",
        "Aligned with OWASP, PTES, and industry standards",
        "Evidence-driven findings with reproduction steps",
        "Actionable remediation guidance",
      ],
    },
    {
      heading: "Why Clients Choose Us",
      list: [
        "Senior engineers on every engagement",
        "Clear reporting written for both executives and developers",
        "No false positives — every finding is validated",
        "Post-fix retest included",
      ],
    },
  ],
};
