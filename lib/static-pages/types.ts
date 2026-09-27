export type StaticPageHero = {
  readonly title: string;
  readonly subtitle: string;
};

export type StaticPageSection = {
  readonly heading: string;
  readonly paragraphs?: readonly string[];
  readonly list?: readonly string[];
  readonly contactEmail?: string;
};

export type LegalSection = {
  readonly heading: string;
  readonly paragraphs: readonly string[];
};
