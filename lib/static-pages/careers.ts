import type { StaticPageHero, StaticPageSection } from "./types";

export const careersContent: {
  readonly hero: StaticPageHero;
  readonly sections: readonly StaticPageSection[];
} = {
  hero: {
    title: "Careers",
    subtitle: "Join a team of security engineers who take the craft seriously.",
  },
  sections: [
    {
      heading: "Our Culture",
      paragraphs: [
        "At Surakshayantra, we foster a culture of technical excellence, continuous curiosity, and rigorous craftsmanship. We value deep problem solving and respect the time it takes to do thorough security work.",
        "We prioritize autonomy, honest technical discussions, and practical impact over bureaucracy. You will work directly on real-world systems with clients who value proactive security.",
      ],
    },
    {
      heading: "How We Work",
      list: [
        "Small, senior teams",
        "Deep focus over busy work",
        "Remote-friendly with clear communication",
        "Continuous learning and tool investment",
      ],
    },
    {
      heading: "What We Look For",
      list: [
        "Strong fundamentals in web and network security",
        "Comfort with manual testing over purely automated tools",
        "Clear written communication",
        "Curiosity and an attacker mindset",
      ],
    },
    {
      heading: "How to Apply",
      paragraphs: [
        "If you are passionate about offensive security and want to work on complex assessments, send your resume, proof of work, or relevant findings to support@surakshayantra.com.",
      ],
    },
  ],
};
