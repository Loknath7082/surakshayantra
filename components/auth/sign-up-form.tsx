"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { signUpSchema, type SignUpInput } from "@/lib/validations/auth";
import { mapClerkErrors } from "@/components/auth/clerk-error-mapping";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { OtpVerifyForm } from "@/components/auth/otp-verify-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface SignUpFormProps {
  returnTo: string | null;
}

/**
 * Sign-up form with email validation pre-check, credentials creation, and OTP verification.
 */
export function SignUpForm({ returnTo }: SignUpFormProps) {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [formError, setFormError] = useState<string | null>(null);

  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  if (!isLoaded) {
    return <div className="h-64" aria-hidden />;
  }

  if (step === "otp") {
    return (
      <OtpVerifyForm
        returnTo={returnTo}
        onVerify={(code) =>
          signUp.attemptEmailAddressVerification({ code }).then((r) => ({
            status: r.status ?? "",
            createdSessionId: r.createdSessionId ?? null,
          }))
        }
        onSuccess={async (sid) => {
          await setActive({ session: sid });
          router.push(returnTo ?? "/portal");
          router.refresh();
        }}
      />
    );
  }

  const onSubmit = async (data: SignUpInput) => {
    setFormError(null);

    // 1. Pre-check email against disposable domains and format rules
    try {
      const res = await fetch("/api/auth/validate-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError("email", { message: json?.error?.message ?? "Email rejected" });
        return;
      }
    } catch {
      setFormError("Could not verify email. Please try again.");
      return;
    }

    // 2. Create account on Clerk
    try {
      const result = await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.push(returnTo ?? "/portal");
        router.refresh();
      } else if (result.status === "complete") {
        setFormError("Session could not be created. Please try again.");
      } else if (
        result.status === "missing_requirements" &&
        result.unverifiedFields?.some((f) => (f as string) === "email_address" || (f as string) === "emailAddress")
      ) {
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setStep("otp");
      } else if (result.status === "abandoned") {
        setFormError("Sign-up session expired. Please try again.");
      } else {
        setFormError(`Unexpected status: ${result.status}`);
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        mapClerkErrors(err.errors, setError, setFormError);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <OAuthButtons returnTo={returnTo} onError={setFormError} />

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-default" />
        </div>
        <div className="relative bg-surface px-3 text-xs text-muted">
          or continue with email
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-primary"
          >
            Email address
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            disabled={isSubmitting}
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p role="alert" className="text-sm text-state-error">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-primary"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            disabled={isSubmitting}
            placeholder="••••••••"
            {...register("password")}
          />
          {errors.password && (
            <p role="alert" className="text-sm text-state-error">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-primary"
          >
            Confirm password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            disabled={isSubmitting}
            placeholder="••••••••"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p role="alert" className="text-sm text-state-error">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {formError && (
          <p role="alert" className="text-sm text-state-error">
            {formError}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <div className="text-center text-sm text-muted">
        <Link
          href={`/sign-in${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`}
          className="text-accent-primary hover:underline"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
}
