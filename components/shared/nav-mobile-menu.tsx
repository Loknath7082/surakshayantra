"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { marketingLinks } from "@/lib/nav-links";

export default function NavMobileMenu() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 bg-surface">
        <SheetHeader>
          <SheetTitle className="text-primary">Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {marketingLinks.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-elevated ${
                  pathname === link.href
                    ? "text-accent-primary"
                    : "text-primary"
                }`}
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 p-4">
          <SheetClose asChild>
            <Button variant="ghost" asChild className="w-full justify-center">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="default" asChild className="w-full justify-center">
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
