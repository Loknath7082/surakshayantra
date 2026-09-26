import { cn } from "@/lib/utils";

export type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 md:px-8", className)}>
      {children}
    </div>
  );
}
