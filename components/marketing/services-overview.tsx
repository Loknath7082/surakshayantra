import Link from "next/link";
import { Shield, Globe, Smartphone, Plug, Network, type LucideIcon } from "lucide-react";
import Container from "@/components/shared/container";

type ServiceCard = { title: string; description: string; href: string; icon: LucideIcon };

const services: ServiceCard[] = [
  { title: "VAPT",            description: "Comprehensive penetration testing across applications, networks, and infrastructure.", href: "/services/vapt",    icon: Shield },
  { title: "Web App Testing", description: "Identify security weaknesses in web applications before attackers can exploit them.",    href: "/services/web-app", icon: Globe },
  { title: "Mobile Testing",  description: "Assess iOS and Android applications for vulnerabilities and insecure data handling.",    href: "/services/mobile",  icon: Smartphone },
  { title: "API Testing",     description: "Evaluate API endpoints for authentication, authorization, and data exposure issues.",    href: "/services/api",     icon: Plug },
  { title: "Network Testing", description: "Test internal and external network perimeters for misconfigurations and exposure.",      href: "/services/network", icon: Network },
];

export default function ServicesOverview() {
  return (
    <section className="bg-surface">
      <Container className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">Our Services</h2>
          <p className="mt-4 text-lg text-muted">
            Professional security testing tailored to your digital assets.
          </p>
        </div>
        <div className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link key={service.href} href={service.href} className="block">
                <article className="bg-elevated border border-default rounded-md p-6 shadow-sm transition-colors hover:border-accent-primary">
                  <Icon className="text-accent-primary h-6 w-6" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-semibold text-primary">{service.title}</h3>
                  <p className="mt-2 text-sm text-muted">{service.description}</p>
                </article>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
