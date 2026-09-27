import { vi } from "vitest";

vi.mock("server-only", () => ({}));

process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test_dummy";
process.env.CLERK_SECRET_KEY = "«redacted:sk_test_…»";
process.env.CLERK_WEBHOOK_SECRET = "whsec_test_dummy";
process.env.DATABASE_URL = "postgres://test";
process.env.LOG_LEVEL = "silent";
