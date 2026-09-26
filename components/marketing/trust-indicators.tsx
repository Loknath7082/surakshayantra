import { CheckCircle2 } from "lucide-react";
import Container from "@/components/shared/container";

const indicators = [
  "OWASP-aligned methodology",
  "Industry-standard testing practices",
  "Detailed vulnerability reports",
  "Actionable remediation guidance",
];

export default function TrustIndicators() {
  return (
    <section className="bg-surface">
      <Container className="py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {indicators.map((statement) => (
            <div key={statement} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-state-success" aria-hidden="true" />
              <span className="text-primary text-base">{statement}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
