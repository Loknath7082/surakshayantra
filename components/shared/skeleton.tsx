import { cn } from "@/lib/utils";

export type SkeletonProps = {
  width?: string;
  height?: string;
  variant?: "line" | "circle" | "rect";
  className?: string;
};

/** Shows a pulsing placeholder with configurable size and shape. */
export function Skeleton({
  width = "100%",
  height = "1rem",
  variant = "rect",
  className,
}: SkeletonProps) {
  const variantClassName =
    variant === "line"
      ? "rounded-sm"
      : variant === "circle"
        ? "rounded-full"
        : "rounded-md";

  return (
    <div
      className={cn("bg-elevated animate-pulse", variantClassName, className)}
      style={{ width, height }}
    />
  );
}
