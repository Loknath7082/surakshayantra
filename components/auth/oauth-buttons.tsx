"use client";

import React, { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { Chrome, Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface OAuthButtonsProps {
  returnTo: string | null;
  onError: (message: string) => void;
}

/**
 * Social OAuth provider buttons (Google and GitHub) for Clerk authentication.
 */
export function OAuthButtons({ returnTo, onError }: OAuthButtonsProps) {
  const { signIn, isLoaded } = useSignIn();
  const [loading, setLoading] = useState<"google" | "github" | null>(null);

  if (!isLoaded) {
    return null;
  }

  const handleOAuth = async (provider: "google" | "github") => {
    setLoading(provider);
    try {
      await signIn.authenticateWithRedirect({
        strategy: provider === "google" ? "oauth_google" : "oauth_github",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: returnTo ?? "/portal",
      });
    } catch {
      onError("Could not start OAuth. Please try again.");
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        type="button"
        variant="outline"
        disabled={loading !== null}
        onClick={() => handleOAuth("google")}
        className="w-full flex items-center justify-center gap-2"
      >
        {loading === "google" ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted" />
        ) : (
          <Chrome className="h-4 w-4" />
        )}
        <span>Google</span>
      </Button>

      <Button
        type="button"
        variant="outline"
        disabled={loading !== null}
        onClick={() => handleOAuth("github")}
        className="w-full flex items-center justify-center gap-2"
      >
        {loading === "github" ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted" />
        ) : (
          <Github className="h-4 w-4" />
        )}
        <span>GitHub</span>
      </Button>
    </div>
  );
}
