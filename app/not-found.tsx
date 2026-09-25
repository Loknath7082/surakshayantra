import Link from "next/link";

/** Shows the branded fallback for a missing page. */
export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base px-6">
      <div className="flex max-w-lg flex-col items-center text-center">
        <p className="text-5xl font-extrabold tracking-tight text-primary">Surakshayantra</p>
        <h1 className="mt-6 text-4xl font-bold text-primary">Page not found</h1>
        <p className="mt-3 text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          className="mt-6 text-sm font-medium text-accent-primary underline-offset-4 hover:underline"
          href="mailto:support@surakshayantra.com"
        >
          Contact support
        </Link>
      </div>
    </main>
  );
}
