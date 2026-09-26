"use client";

import { startTransition, useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const initialTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    startTransition(() => setTheme(initialTheme));
  }, []);

  function toggle() {
    const isDark = document.documentElement.classList.contains("dark");
    const next = isDark ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    document.cookie = `theme=${next}; path=/; max-age=31536000; SameSite=Lax`;
    setTheme(next);
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
    >
      <Sun className="hidden dark:block h-5 w-5" />
      <Moon className="dark:hidden h-5 w-5" />
    </Button>
  );
}