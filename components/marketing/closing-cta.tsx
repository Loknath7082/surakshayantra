import Link from "next/link";
import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export default function ClosingCta() {
  return (
    <section className="bg-bg-base">
      <Container className="py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-fg-primary md:text-4xl">
            Ready to Strengthen Your Security?
          </h2>
          <p className="mt-4 text-lg text-fg-muted">
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
  );
}
