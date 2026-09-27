import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/shared/container";
import { getServiceBySlug, getAllServiceSlugs } from "@/lib/services-data";

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: `${service.title} — Surakshayantra`,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      {/* 1. Breadcrumb */}
      <nav aria-label="Breadcrumb" className="bg-base">
        <Container className="pt-8">
          <ol className="flex items-center gap-2 text-sm text-muted list-none pl-0">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-4 w-4" />
            </li>
            <li>
              <Link href="/services">Services</Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-4 w-4" />
            </li>
            <li>
              <span aria-current="page" className="text-primary">
                {service.title}
              </span>
            </li>
          </ol>
        </Container>
      </nav>

      {/* 2. Hero */}
      <section className="relative overflow-hidden bg-base">
        <div className="pointer-events-none absolute inset-0 bg-gradient-glow" aria-hidden="true" />
        <div className="relative z-10">
          <Container className="py-12 md:py-20">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">{service.title}</h1>
              <p className="mt-6 text-lg text-muted">{service.subtitle}</p>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/sign-up">Request Assessment</Link>
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* 3. Overview */}
      <section className="bg-surface">
        <Container className="py-20 md:py-28">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Overview</h2>
            <p className="mt-4 text-lg text-muted">{service.overview}</p>
          </div>
        </Container>
      </section>

      {/* 4. Scope */}
      <section className="bg-base">
        <Container className="py-20 md:py-28">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Scope</h2>
            <ul className="mt-6 space-y-3 list-none pl-0">
              {service.scope.map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-state-success shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* 5. Methodology */}
      <section className="bg-surface">
        <Container className="py-20 md:py-28">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Methodology</h2>
            <ol className="mt-6 space-y-4 list-none pl-0">
              {service.methodology.map((step, index) => (
                <li key={step} className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-elevated border border-default text-accent-primary text-sm font-semibold shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-primary font-medium">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* 6. Deliverables */}
      <section className="bg-base">
        <Container className="py-20 md:py-28">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Deliverables</h2>
            <ul className="mt-6 space-y-3 list-none pl-0">
              {service.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-state-success shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* 7. Bottom CTA */}
      <section className="bg-surface">
        <Container className="py-20 md:py-28">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Ready to Strengthen Your Security?</h2>
            <p className="mt-4 text-lg text-muted">
              Request a security assessment and discover where your digital assets need protection.
            </p>
            <div className="mt-8">
              <Button asChild>
                <Link href="/sign-up">Request Assessment</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
