import type { Metadata } from "next";
import Container from "@/components/shared/container";
import PageHero from "@/components/marketing/page-hero";
import { pgpKeyContent } from "@/lib/static-pages";

export const metadata: Metadata = {
  title: "PGP Key — Surakshayantra",
  description:
    "Download or copy the Surakshayantra public PGP key for encrypted communications.",
};

export default function PgpKeyPage() {
  return (
    <>
      <PageHero title={pgpKeyContent.hero.title} subtitle={pgpKeyContent.hero.subtitle} />
      <section className="bg-surface">
        <Container className="py-20 md:py-28">
          <div className="max-w-3xl space-y-10">
            <p className="text-base text-muted">{pgpKeyContent.intro}</p>
            <div>
              <h2 className="text-2xl font-bold text-primary">{pgpKeyContent.keyLabel}</h2>
              <pre className="mt-4 rounded-md border border-default bg-elevated p-4 text-xs font-mono text-primary overflow-x-auto">
                <code>{pgpKeyContent.publicKeyPlaceholder}</code>
              </pre>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">How to Use</h2>
              <ol className="mt-4 space-y-3 list-none pl-0">
                {pgpKeyContent.usageInstructions.map((instruction, index) => (
                  <li key={instruction} className="flex items-center gap-4">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-elevated border border-default text-accent-primary text-xs font-semibold shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-muted">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="text-base text-muted">
              Send encrypted reports to:{" "}
              <a
                href={`mailto:${pgpKeyContent.securityEmail}`}
                className="text-accent-primary hover:underline"
              >
                {pgpKeyContent.securityEmail}
              </a>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
