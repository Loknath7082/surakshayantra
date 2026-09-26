import Link from "next/link";
import { Linkedin, Twitter, Github } from "lucide-react";
import Container from "@/components/shared/container";
import UptimeIndicator from "@/components/shared/uptime-indicator";

const servicesLinks = [
  { label: "VAPT", href: "/services/vapt" },
  { label: "Web App Testing", href: "/services/web-app" },
  { label: "Mobile Testing", href: "/services/mobile" },
  { label: "API Testing", href: "/services/api" },
  { label: "Network Testing", href: "/services/network" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "PGP Key", href: "/pgp-key" },
  { label: "Responsible Disclosure", href: "/responsible-disclosure" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-default bg-surface py-12">
      <Container>
        {/* Columns */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-primary">
              Services
            </h3>
            <ul className="space-y-2">
              {servicesLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-primary">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-primary">
              Contact
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:support@surakshayantra.com"
                  className="text-sm text-muted transition-colors hover:text-primary"
                >
                  support@surakshayantra.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-default pt-8 md:flex-row">
          <p className="text-sm text-muted">
            &copy; {year} Surakshayantra. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <span
              role="img"
              className="text-muted"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" aria-hidden="true" />
            </span>
            <span
              role="img"
              className="text-muted"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" aria-hidden="true" />
            </span>
            <span
              role="img"
              className="text-muted"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>

          <UptimeIndicator />
        </div>
      </Container>
    </footer>
  );
}
