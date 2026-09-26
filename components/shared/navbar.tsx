import Link from "next/link";
import { Button } from "@/components/ui/button";
import Container from "@/components/shared/container";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import NavMobileMenu from "@/components/shared/nav-mobile-menu";
import { marketingLinks } from "@/lib/nav-links";

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-navbar h-16 border-b border-default bg-surface">
      <Container className="flex h-full items-center justify-between">
        {/* Left: Wordmark */}
        <Link href="/" className="text-lg font-bold text-primary">
          Surakshayantra
        </Link>

        {/* Center: Desktop nav links */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          {marketingLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Desktop actions */}
        <div className="hidden md:flex md:items-center md:gap-2">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button variant="default" asChild>
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <NavMobileMenu />
        </div>
      </Container>
    </header>
  );
}
