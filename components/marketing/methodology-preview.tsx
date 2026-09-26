import Link from "next/link";
import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";

const steps = [
  "Reconnaissance",
  "Scanning",
  "Vulnerability Analysis",
  "Exploitation",
  "Reporting & Retest",
];

export default function MethodologyPreview() {
  return (
    <section className="bg-base">
      <Container className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">Our Methodology</h2>
          <p className="mt-4 text-lg text-muted">
            A structured, repeatable process aligned with industry standards.
          </p>
        </div>

        {/* Desktop layout (lg+) */}
        <div className="hidden lg:flex mt-12">
          {steps.map((step, index) => (
            <div key={step} className="flex-1 flex flex-col items-center text-center relative px-2">
              {index > 0 && (
                <div className="absolute top-5 left-0 right-1/2 h-px bg-border-default" aria-hidden="true" />
              )}
              {index < steps.length - 1 && (
                <div className="absolute top-5 left-1/2 right-0 h-px bg-border-default" aria-hidden="true" />
              )}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-elevated border border-default text-accent-primary font-semibold relative z-10">
                {index + 1}
              </div>
              <span className="mt-4 text-primary font-medium">{step}</span>
            </div>
          ))}
        </div>

        {/* Mobile/tablet layout (< lg) */}
        <div className="lg:hidden flex flex-col gap-6 relative mt-12">
          <div className="absolute left-5 top-5 bottom-5 w-px bg-border-default" aria-hidden="true" />
          {steps.map((step, index) => (
            <div key={step} className="flex items-center gap-4 relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-elevated border border-default text-accent-primary font-semibold relative z-10 shrink-0">
                {index + 1}
              </div>
              <span className="text-primary font-medium">{step}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/methodology">See Full Methodology</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
