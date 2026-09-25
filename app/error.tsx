"use client";

import Link from "next/link";

export type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** Shows the route error fallback with retry and support actions. */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  void error;

  return (
    <main className="flex min-h-screen items-center justify-center bg-base px-6">
      <div className="flex max-w-lg flex-col items-center text-center">
        <p className="text-5xl font-extrabold tracking-tight text-primary">Surakshayantra</p>
        <h1 className="mt-6 text-4xl font-bold text-primary">Something went wrong</h1>
        <p className="mt-3 text-muted">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-6 flex items-center gap-4">
          <button
            className="rounded-md bg-accent-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent-primary/90"
            onClick={reset}
            type="button"
          >
            Try again
          </button>
          <Link
            className="text-sm font-medium text-accent-primary underline-offset-4 hover:underline"
            href="mailto:support@surakshayantra.com"
          >
            Contact support
          </Link>
        </div>
      </div>
    </main>
  );
}
