import type { StaticPageHero, StaticPageSection } from "./types";

export const methodologyContent: {
  readonly hero: StaticPageHero;
  readonly sections: readonly StaticPageSection[];
} = {
  hero: {
    title: "Methodology",
    subtitle: "A structured, repeatable process aligned with industry standards.",
  },
  sections: [
    {
      heading: "Reconnaissance",
      paragraphs: [
        "We begin by identifying and mapping all exposed assets, services, and endpoints. This passive and active intelligence gathering establishes the target perimeter and defines potential attack vectors without disrupting active operations.",
      ],
    },
    {
      heading: "Scanning",
      paragraphs: [
        "Targeted automated tools and custom scripts are deployed to identify known vulnerabilities, outdated dependencies, and perimeter misconfigurations across the defined scope.",
      ],
    },
    {
      heading: "Vulnerability Analysis",
      paragraphs: [
        "Our engineers manually analyze scanning data, verify findings, and examine business logic, authentication models, and data flows to uncover nuanced security weaknesses.",
      ],
    },
    {
      heading: "Exploitation",
      paragraphs: [
        "Controlled proof-of-concept exploits are executed to determine the real-world exploitability and blast radius of each vulnerability, proving impact while ensuring system stability.",
      ],
    },
    {
      heading: "Reporting & Retest",
      paragraphs: [
        "We deliver a comprehensive report with executive summaries, technical reproduction steps, and prioritized remediation guidance. Once fixes are deployed, we perform a complimentary retest to verify resolution.",
      ],
    },
  ],
};
