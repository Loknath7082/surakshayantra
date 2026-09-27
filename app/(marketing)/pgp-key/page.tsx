import type { Metadata } from "next";
import { TriangleAlert } from "lucide-react";
import Container from "@/components/shared/container";
import PageHero from "@/components/marketing/page-hero";
import { pgpKeyContent } from "@/lib/static-pages";

export const metadata: Metadata = {
  title: "PGP Key — Surakshayantra",
  description:
      "Download or copy the Surakshayantra public PGP key for encrypted communications (currently unavailable).",
};

export default function PgpKeyPage() {
  return (
    <>
      <PageHero title={pgpKeyContent.hero.title} subtitle={pgpKeyContent.hero.subtitle} />
      <section className="bg-surface">
        <Container className="py-20 md:py-28">
          <div className="max-w-3xl space-y-10">
            <p className="text-base text-muted">{pgpKeyContent.intro}</p>
            <div className="space-y-6">
              <div className="flex items-start gap-3 rounded-md border border-state-warning bg-elevated p-4 text-sm text-state-warning">
                <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-bold">{pgpKeyContent.keyWarning}</p>
                  <p className="mt-1">{pgpKeyContent.keyWarningBody}</p>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary">{pgpKeyContent.keyLabel}</h2>
                <pre className="mt-4 rounded-md border border-default bg-elevated p-4 text-xs font-mono text-primary overflow-x-auto">
                  <code>{pgpKeyContent.publicKeyPlaceholder}</code>
                </pre>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">How to Report</h2>
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
              <p className="mt-6 text-base text-muted">
                {pgpKeyContent.fallbackMessage}
              </p>
            </div>
            <p className="text-base text-muted"> Unencrypted fallback:{" "}
                          <a
                            href={`mailto:${pgpKeyContent.securityEmail}`}
                            className="text-accent-primary hover:underline"
                          >
                            Unencrypted fallback
                          </a>
                        </p>
          </div>
        </Container>
      </section>
    </>
  );
}
