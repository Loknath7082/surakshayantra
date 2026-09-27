import "server-only";
import { z } from "zod";

// Keep same-origin check in sync with proxy.ts inline validation.
const relativeUrlSchema = (defaultUrl: string) =>
  z
    .string()
    .min(1)
    .startsWith("/")
    .refine((val) => !val.startsWith("//") && !val.startsWith("/\\"), {
      message: "Must be a relative URL starting with / and not // or /\\",
    })
    .default(defaultUrl);

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  CLERK_SECRET_KEY: z.string().min(1, "CLERK_SECRET_KEY is required"),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required"),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: relativeUrlSchema("/sign-in"),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: relativeUrlSchema("/sign-up"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info")
    .catch((ctx) => {
      if (ctx.input !== undefined && ctx.input !== "") {
        console.warn(
          `Invalid LOG_LEVEL "${String(ctx.input)}", falling back to "info"`
        );
      }
      return "info";
    }),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  LOG_LEVEL: process.env.LOG_LEVEL,
});
