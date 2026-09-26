"use client";

import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  function toggle() {
    const isDark = document.documentElement.classList.contains("dark");
    const next = isDark ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    document.cookie = `theme=${next}; path=/; max-age=31536000; SameSite=Lax`;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle theme"
    >
      <Sun className="hidden dark:block h-5 w-5" />
      <Moon className="dark:hidden h-5 w-5" />
    </Button>
  );
}