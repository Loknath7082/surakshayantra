"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { otpSchema, type OtpInput } from "@/lib/validations/auth";
import { mapClerkErrors } from "@/components/auth/clerk-error-mapping";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface OtpVerifyFormProps {
  onVerify: (code: string) => Promise<{ status: string; createdSessionId: string | null }>;
  onSuccess: (sessionId: string) => Promise<void>;
  returnTo: string | null;
}

/**
 * 6-digit OTP email verification form with automatic submit on completion.
 */
export function OtpVerifyForm({ onVerify, onSuccess }: OtpVerifyFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: OtpInput) => {
    setFormError(null);
    try {
      const result = await onVerify(data.code);
      if (result.status === "complete" && result.createdSessionId) {
        startTransition(async () => {
          await onSuccess(result.createdSessionId as string);
        });
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

  const isLoading = isSubmitting || isPending;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value.replace(/\D/g, "").slice(0, 6);
    setValue("code", sanitized, { shouldValidate: true });
    if (sanitized.length === 6 && !isLoading) {
      void handleSubmit(onSubmit)();
    }
  };

  const { ref, ...restRegister } = register("code");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="code"
          className="block text-sm font-medium text-primary"
        >
          Verification code
        </label>
        <p className="text-xs text-muted">
          Enter the 6-digit verification code sent to your email.
        </p>
        <Input
          id="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          disabled={isLoading}
          placeholder="123456"
          className="text-center text-lg tracking-widest"
          ref={ref}
          {...restRegister}
          onChange={handleInputChange}
        />
        {errors.code && (
          <p role="alert" className="text-sm text-state-error">
            {errors.code.message}
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
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Verifying…" : "Verify code"}
      </Button>
    </form>
  );
}
