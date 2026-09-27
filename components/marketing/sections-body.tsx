import { CheckCircle2 } from "lucide-react";
import type { StaticPageSection } from "@/lib/static-pages/types";

type SectionsBodyProps = {
  sections: readonly StaticPageSection[];
};

export default function SectionsBody({ sections }: SectionsBodyProps) {
  return (
    <div className="max-w-3xl space-y-12">
      {sections.map((section) => {
        const hasContent =
          (section.paragraphs && section.paragraphs.length > 0) ||
          (section.list && section.list.length > 0) ||
          Boolean(section.contactEmail);
        if (!hasContent) return null;
        return (
          <div key={section.heading}>
            <h2 className="text-2xl md:text-3xl font-bold text-primary">{section.heading}</h2>
            {section.paragraphs && section.paragraphs.length > 0 ? (
              <div className="mt-4 space-y-4">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-base text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}
            {section.list && section.list.length > 0 ? (
              <ul className="mt-4 space-y-2 list-none pl-0">
                {section.list.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-muted">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-state-success shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {section.contactEmail ? (
              <p className="mt-4 text-base">
                <a
                  href={`mailto:${section.contactEmail}`}
                  className="text-accent-primary hover:underline"
                >
                  {section.contactEmail}
                </a>
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
