import Link from "next/link";
import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg-base">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-glow"
        aria-hidden="true"
      />
      <div className="relative z-10">
        <Container className="py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-fg-primary md:text-5xl lg:text-6xl">
              Secure Your Digital Future
            </h1>
            <p className="mt-6 text-lg text-fg-muted md:text-xl">
              Professional cybersecurity assessments to identify vulnerabilities before attackers do.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/sign-up">Request Assessment</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
