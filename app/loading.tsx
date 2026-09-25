import { Skeleton } from "@/components/shared/skeleton";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base px-6">
      <div className="flex w-full max-w-xs flex-col items-start gap-3">
        <Skeleton width="8rem" height="1rem" variant="line" />
        <Skeleton width="12rem" height="1rem" variant="line" />
        <Skeleton width="16rem" height="1rem" variant="line" />
      </div>
    </main>
  );
}
