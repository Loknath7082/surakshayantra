import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/auth/validate-signup/route";

describe("POST /api/auth/validate-signup", () => {
  const url = "http://localhost:3000/api/auth/validate-signup";

  it("returns 400 for empty body", async () => {
    const req = new Request(url, {
      method: "POST",
      body: "",
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
  });

  it("returns 400 for empty email", async () => {
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify({ email: "" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toBeDefined();
  });

  it("returns 400 with DISPOSABLE_EMAIL code for disposable email", async () => {
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify({ email: "tester@mailinator.com" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.data).toBeNull();
    expect(json.error).toEqual({
      message: "Disposable emails are not allowed",
      code: "DISPOSABLE_EMAIL",
    });
  });

  it("returns 200 with data.allowed === true for allowed email", async () => {
    const req = new Request(url, {
      method: "POST",
      body: JSON.stringify({ email: "tester@example.com" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.error).toBeNull();
    expect(json.data).toEqual({ allowed: true });
  });
});
