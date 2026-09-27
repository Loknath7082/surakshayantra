import "server-only";
import pino from "pino";
import { env } from "@/lib/env";

const isDev = process.env.NODE_ENV === "development";
let isPrettyAvailable = false;

if (isDev && typeof require !== "undefined") {
  try {
    require.resolve("pino-pretty");
    isPrettyAvailable = true;
  } catch {
    isPrettyAvailable = false;
  }
}

// Note: Pino redaction configured here covers top-level and one nesting level (*.) only.
export const logger = pino({
  level: env.LOG_LEVEL,
  redact: {
    paths: [
      "password",
      "*.password",
      "passwordHash",
      "*.passwordHash",
      "token",
      "*.token",
      "accessToken",
      "*.accessToken",
      "refreshToken",
      "*.refreshToken",
      "idToken",
      "*.idToken",
      "cookie",
      "*.cookie",
      "authorization",
      "*.authorization",
    ],
  },
  transport: isPrettyAvailable
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      }
    : undefined,
});
