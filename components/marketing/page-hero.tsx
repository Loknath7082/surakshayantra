import Container from "@/components/shared/container";

type PageHeroProps = {
  title: string;
  subtitle?: string;
};

export default function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-base">
      <div className="pointer-events-none absolute inset-0 bg-gradient-glow" aria-hidden="true" />
      <div className="relative z-10">
        <Container className="py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">{title}</h1>
            {subtitle ? <p className="mt-6 text-lg text-muted">{subtitle}</p> : null}
          </div>
        </Container>
      </div>
    </section>
  );
}
