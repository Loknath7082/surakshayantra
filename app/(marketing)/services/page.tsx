import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Container from "@/components/shared/container";
import { services } from "@/lib/services-data";
import { serviceIcons } from "@/lib/service-icons";

export const metadata: Metadata = {
  title: "Services — Surakshayantra",
  description:
    "Professional security testing across VAPT, web applications, mobile, API, and network infrastructure.",
};

export default function ServicesPage() {
  return (
    <section className="bg-base">
      <Container className="py-20 md:py-28">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">Our Services</h1>
          <p className="mt-4 text-lg text-muted">Professional security testing tailored to your digital assets.</p>
        </div>
        <div className="mt-12 grid gap-6 grid-cols-1 md:grid-cols-2">
          {services.map((service) => {
            const Icon = serviceIcons[service.iconName];
            return (
              <Link key={service.slug} href={`/services/${service.slug}`} className="block">
                <article className="bg-elevated border border-default rounded-md p-6 shadow-sm transition-colors hover:border-accent-primary h-full flex flex-col">
                  <Icon className="h-6 w-6 text-accent-primary" aria-hidden="true" />
                  <h2 className="mt-4 text-xl font-semibold text-primary">{service.title}</h2>
                  <p className="mt-2 text-sm text-muted">{service.shortDescription}</p>
                  <ul className="mt-4 space-y-1 list-none pl-0">
                    {service.scope.slice(0, 3).map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-muted">
                        <CheckCircle2 className="h-4 w-4 text-state-success shrink-0" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto pt-6 text-sm font-medium text-accent-primary inline-flex items-center gap-1">
                    Learn more <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </article>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
