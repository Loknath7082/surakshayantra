import { vi } from "vitest";

vi.mock("server-only", () => ({}));

process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test_dummy";
process.env.CLERK_SECRET_KEY = "sk_test_dummy";
process.env.DATABASE_URL = "postgres://test";
process.env.LOG_LEVEL = "silent";
