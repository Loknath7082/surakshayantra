"use client";

import { Suspense } from "react";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

/**
 * SSO callback page component that processes OAuth redirect responses.
 */
export default function SsoCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base">
      <Suspense fallback={<div className="h-64" aria-hidden />}>
        <AuthenticateWithRedirectCallback />
      </Suspense>
    </div>
  );
}
