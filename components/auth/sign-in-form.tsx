"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { signInSchema, type SignInInput } from "@/lib/validations/auth";
import { mapClerkErrors } from "@/components/auth/clerk-error-mapping";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { OtpVerifyForm } from "@/components/auth/otp-verify-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface SignInFormProps {
  returnTo: string | null;
}

type SecondFactorStrategy = "email_code" | "totp" | "phone_code" | "backup_code";

/**
 * Sign-in form supporting credentials, OAuth, and multi-factor authentication challenges.
 */
export function SignInForm({ returnTo }: SignInFormProps) {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [formError, setFormError] = useState<string | null>(null);
  const [secondFactorStrategy, setSecondFactorStrategy] =
    useState<SecondFactorStrategy>("email_code");
  const [availableStrategies, setAvailableStrategies] = useState<SecondFactorStrategy[]>([]);

  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (!isLoaded) {
    return <div className="h-64" aria-hidden />;
  }

  const handleSelectStrategy = async (strategy: SecondFactorStrategy) => {
    if (!signIn) return;
    setFormError(null);
    try {
      if (strategy === "phone_code") {
        const factor = signIn.supportedSecondFactors?.find((f) => f.strategy === "phone_code") as
          | { strategy: "phone_code"; phoneNumberId?: string }
          | undefined;
        await signIn.prepareSecondFactor({
          strategy: "phone_code",
          ...(factor?.phoneNumberId ? { phoneNumberId: factor.phoneNumberId } : {}),
        } as Parameters<typeof signIn.prepareSecondFactor>[0]);
      } else if (strategy === "email_code") {
        const factor = signIn.supportedSecondFactors?.find((f) => f.strategy === "email_code") as
          | { strategy: "email_code"; emailAddressId?: string }
          | undefined;
        await signIn.prepareSecondFactor({
          strategy: "email_code",
          ...(factor?.emailAddressId ? { emailAddressId: factor.emailAddressId } : {}),
        } as Parameters<typeof signIn.prepareSecondFactor>[0]);
      }
      setSecondFactorStrategy(strategy);
    } catch {
      setFormError("Could not switch verification method. Please try again.");
    }
  };

  if (step === "otp") {
    return (
      <OtpVerifyForm
        returnTo={returnTo}
        strategy={secondFactorStrategy}
        availableStrategies={availableStrategies}
        onSelectStrategy={handleSelectStrategy}
        externalError={formError}
        onVerify={async (code) => {
          const r = await signIn.attemptSecondFactor({
            strategy: secondFactorStrategy,
            code,
          } as Parameters<typeof signIn.attemptSecondFactor>[0]);
          return {
            status: r.status ?? "",
            createdSessionId: r.createdSessionId ?? null,
          };
        }}
        onSuccess={async (sid) => {
          await setActive({ session: sid });
          router.push(returnTo ?? "/portal");
          router.refresh();
        }}
      />
    );
  }

  const onSubmit = async (data: SignInInput) => {
    setFormError(null);
    try {
      const result = await signIn.create({
        strategy: "password",
        identifier: data.email,
        password: data.password,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.push(returnTo ?? "/portal");
        router.refresh();
      } else if (result.status === "complete") {
        setFormError("Session could not be created. Please try again.");
      } else if (
        result.status === "needs_second_factor" ||
        (result.status as string) === "needs_client_trust"
      ) {
        const supported = result.supportedSecondFactors ?? [];
        const strategies = supported
          .map((f) => f.strategy as SecondFactorStrategy)
          .filter((s) => ["email_code", "totp", "phone_code", "backup_code"].includes(s));

        setAvailableStrategies(strategies);

        // Pick primary factor
        const factor =
          supported.find((f) => f.strategy === "email_code") ??
          supported.find((f) => f.strategy === "totp") ??
          supported.find((f) => f.strategy === "phone_code") ??
          supported.find((f) => f.strategy === "backup_code");

        if (factor) {
          const strategy = factor.strategy as SecondFactorStrategy;
          setSecondFactorStrategy(strategy);
          if (strategy === "phone_code") {
            const phoneFactor = factor as { strategy: "phone_code"; phoneNumberId?: string };
            await signIn.prepareSecondFactor({
              strategy: "phone_code",
              ...(phoneFactor.phoneNumberId ? { phoneNumberId: phoneFactor.phoneNumberId } : {}),
            } as Parameters<typeof signIn.prepareSecondFactor>[0]);
          } else if (strategy === "email_code") {
            const emailFactor = factor as { strategy: "email_code"; emailAddressId?: string };
            await signIn.prepareSecondFactor({
              strategy: "email_code",
              ...(emailFactor.emailAddressId ? { emailAddressId: emailFactor.emailAddressId } : {}),
            } as Parameters<typeof signIn.prepareSecondFactor>[0]);
          }
          setStep("otp");
        } else {
          setFormError("Your account requires an MFA method not yet supported. Contact support.");
        }
      } else if (result.status === "needs_new_password") {
        setFormError(
          "Password reset required. Please use the password reset link sent to your email.",
        );
      } else if (result.status === "needs_first_factor") {
        setFormError("Please verify your sign-in method. Contact support if this persists.");
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
            autoComplete="current-password"
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

        {formError && (
          <p role="alert" className="text-sm text-state-error">
            {formError}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-accent-primary text-base font-semibold hover:bg-accent-primary/90"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href={`/sign-up${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`}
          className="text-accent-primary hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
