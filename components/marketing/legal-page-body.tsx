import { TriangleAlert } from "lucide-react";
import type { LegalSection } from "@/lib/static-pages/types";

type LegalPageBodyProps = {
  lastUpdated: string;
  showDraftBanner: boolean;
  sections: readonly LegalSection[];
};

export default function LegalPageBody({
  lastUpdated,
  showDraftBanner,
  sections,
}: LegalPageBodyProps) {
  return (
    <div className="max-w-3xl">
      {showDraftBanner ? (
        <div className="mb-8 flex items-start gap-3 rounded-md border border-state-warning bg-elevated p-4 text-sm text-state-warning">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <span>Draft — Pending Legal Review</span>
        </div>
      ) : null}
      <p className="text-sm text-muted">Last updated: {lastUpdated}</p>
      <div className="mt-10 space-y-12">
        {sections.map((section) => (
          <div key={section.heading}>
            <h2 className="text-2xl md:text-3xl font-bold text-primary">{section.heading}</h2>
            <div className="mt-4 space-y-4">
              {section.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-base text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
