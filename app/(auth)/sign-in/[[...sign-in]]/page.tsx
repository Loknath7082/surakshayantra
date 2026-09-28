import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { validateReturnTo } from "@/lib/return-to";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata = {
  title: "Sign in — surakshayantra",
};

interface SignInPageProps {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}

/**
 * Custom sign-in page component with server-side authentication redirect
 * and returnTo parameter validation.
 */
export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { userId } = await auth();
  const params = await searchParams;
  const raw = typeof params.returnTo === "string" ? params.returnTo : null;
  let returnTo = validateReturnTo(raw);

  // Self-referential guard: prevent redirecting back to auth pages
  if (returnTo === "/sign-in" || returnTo === "/sign-up") {
    returnTo = null;
  }

  // Already authenticated users redirect to returnTo or /portal
  if (userId) {
    redirect(returnTo ?? "/portal");
  }

  return (
    <AuthLayout mode="sign-in">
      <Suspense fallback={<div className="h-64" aria-hidden />}>
        <SignInForm returnTo={returnTo} />
      </Suspense>
    </AuthLayout>
  );
}
