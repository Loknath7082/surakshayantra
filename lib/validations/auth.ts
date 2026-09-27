import { z } from "zod";

/**
 * Schema for disposable email pre-check validation.
 */
export const signupEmailSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
});

export type SignupEmail = z.infer<typeof signupEmailSchema>;

/**
 * Schema for sign-in form validation.
 */
export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Please enter a valid email address")),
  password: z.string().min(1, "Password is required"),
});

export type SignInInput = z.infer<typeof signInSchema>;

/**
 * Schema for sign-up form validation.
 */
export const signUpSchema = z
  .object({
    email: z.string().trim().toLowerCase().pipe(z.email("Please enter a valid email address")),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

/**
 * Schema for 6-digit OTP verification code.
 */
export const otpSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export type OtpInput = z.infer<typeof otpSchema>;
