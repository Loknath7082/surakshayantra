import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

/** Shows an accessible loading indicator at the requested size. */
export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClassName =
    size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5";

  return (
    <Loader2
      aria-label="Loading"
      className={cn("animate-spin text-accent-primary", sizeClassName, className)}
      role="status"
    />
  );
}
