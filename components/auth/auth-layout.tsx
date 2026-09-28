import React from "react";
import Link from "next/link";
import Container from "@/components/shared/container";
import { Check } from "lucide-react";

export interface AuthLayoutProps {
  children: React.ReactNode;
  mode: "sign-in" | "sign-up";
}

const features = [
  "VAPT, Web, Mobile, API, and Network testing",
  "Role-scoped client portal",
  "Server-side authorization on every request",
];

/**
 * Two-panel layout shell for authentication pages.
 * On large screens, renders a brand/value panel on the left and form on the right.
 * On smaller screens, renders only the centered form.
 */
export function AuthLayout({ children, mode }: AuthLayoutProps) {
  const heading = mode === "sign-in" ? "Welcome back" : "Get started";

  return (
    <div className="min-h-screen bg-base py-12 md:py-16">
      <Container className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="grid w-full max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left panel (desktop only) */}
          <div className="hidden flex-col justify-between space-y-8 lg:flex">
            <div>
              <Link
                href="/"
                className="inline-block text-xl font-bold tracking-tight text-primary hover:opacity-90"
              >
                surakshayantra
              </Link>

              <div className="mt-12 space-y-3">
                <h2 className="text-3xl font-bold tracking-tight text-primary">
                  {heading}
                </h2>
                <p className="text-base text-muted">
                  Security testing, professionally delivered.
                </p>
              </div>

              <ul className="mt-8 space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-primary">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface text-accent-primary">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 text-xs text-muted">
              &copy; {new Date().getFullYear()} surakshayantra. All rights reserved.
            </div>
          </div>

          {/* Right panel (centered form) */}
          <div className="flex w-full justify-center">
            <div className="w-full max-w-md rounded-xl border border-default bg-surface p-6 shadow-md md:p-8">
              <div className="mb-6 lg:hidden">
                <Link
                  href="/"
                  className="text-lg font-bold tracking-tight text-primary"
                >
                  surakshayantra
                </Link>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-primary">
                  {heading}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Security testing, professionally delivered.
                </p>
              </div>
              {children}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
