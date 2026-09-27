import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { POST } from "../route";

vi.mock("svix", () => ({
  Webhook: vi.fn().mockImplementation(() => ({
    verify: vi.fn().mockImplementation((body: string) => JSON.parse(body)),
  })),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

beforeEach(() => {
  vi.mocked(Webhook).mockImplementation(
    () =>
      ({
        verify: vi.fn().mockImplementation((body: string) => JSON.parse(body)),
      }) as unknown as Webhook,
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("POST /api/webhooks/clerk", () => {
  const url = "http://localhost:3000/api/webhooks/clerk";
  const defaultHeaders = {
    "svix-id": "msg_test_123",
    "svix-timestamp": "1234567890",
    "svix-signature": "v1,signature_test",
    "content-type": "application/json",
  };

  const validPayload = {
    type: "user.created",
    data: {
      id: "clerk_user_123",
      email_addresses: [
        {
          id: "email_1",
          email_address: "user@example.com",
        },
      ],
      primary_email_address_id: "email_1",
    },
  };

  it("handles valid user.created event and creates client user", async () => {
    vi.mocked(prisma.user.upsert).mockResolvedValueOnce({
      id: "db_user_123",
    } as never);

    const req = new Request(url, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({
      success: true,
      data: { userId: "db_user_123" },
      error: null,
    });
    expect(prisma.user.upsert).toHaveBeenCalledWith({
      where: { clerkId: "clerk_user_123" },
      update: {},
      create: {
        clerkId: "clerk_user_123",
        email: "user@example.com",
        role: "CLIENT",
      },
      select: { id: true },
    });
  });

  it("returns 400 INVALID_SIGNATURE on whitespace-only body", async () => {
    const req = new Request(url, {
      method: "POST",
      headers: defaultHeaders,
      body: "   \n\t  ",
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({
      success: false,
      data: null,
      error: {
        message: "Invalid signature",
        code: "INVALID_SIGNATURE",
      },
    });
  });

  it("returns 400 INVALID_SIGNATURE when svix headers are missing", async () => {
    const req = new Request(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({
      success: false,
      data: null,
      error: {
        message: "Invalid signature",
        code: "INVALID_SIGNATURE",
      },
    });
  });

  it("returns 400 INVALID_SIGNATURE when svix verification throws", async () => {
    vi.mocked(Webhook).mockImplementationOnce(
      () =>
        ({
          verify: () => {
            throw new Error("Invalid signature");
          },
        }) as unknown as Webhook,
    );

    const req = new Request(url, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({
      success: false,
      data: null,
      error: {
        message: "Invalid signature",
        code: "INVALID_SIGNATURE",
      },
    });
  });

  it("returns 400 INVALID_PAYLOAD when event type is missing", async () => {
    const req = new Request(url, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({ data: {} }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({
      success: false,
      data: null,
      error: {
        message: "Malformed payload",
        code: "INVALID_PAYLOAD",
      },
    });
  });

  it("returns 400 INVALID_PAYLOAD when email_addresses is not an array", async () => {
    const req = new Request(url, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        type: "user.created",
        data: {
          id: "clerk_user_123",
          email_addresses: null,
        },
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({
      success: false,
      data: null,
      error: {
        message: "Malformed payload",
        code: "INVALID_PAYLOAD",
      },
    });
  });

  it("returns 400 PRIMARY_EMAIL_MISSING when primary_email_address_id is null", async () => {
    const req = new Request(url, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        type: "user.created",
        data: {
          id: "clerk_user_123",
          email_addresses: [
            { id: "email_1", email_address: "user@example.com" },
          ],
          primary_email_address_id: null,
        },
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({
      success: false,
      data: null,
      error: {
        message: "Primary email missing",
        code: "PRIMARY_EMAIL_MISSING",
      },
    });
  });

  it("returns 400 PRIMARY_EMAIL_MISSING when email_addresses is empty", async () => {
    const req = new Request(url, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        type: "user.created",
        data: {
          id: "clerk_user_123",
          email_addresses: [],
          primary_email_address_id: "email_1",
        },
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json).toEqual({
      success: false,
      data: null,
      error: {
        message: "Primary email missing",
        code: "PRIMARY_EMAIL_MISSING",
      },
    });
  });

  it("returns 200 with ignored marker and logs on non-user.created event", async () => {
    const infoSpy = vi.spyOn(logger, "info");

    const req = new Request(url, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        type: "user.updated",
        data: {
          id: "clerk_user_123",
          email_addresses: [
            { id: "email_1", email_address: "user@example.com" },
          ],
        },
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({
      success: true,
      data: { ignored: true },
      error: null,
    });
    expect(infoSpy).toHaveBeenCalledWith(
      { type: "user.updated" },
      "Ignoring webhook event",
    );
  });

  it("handles P2002 error during concurrent upsert and resolves existing user", async () => {
    vi.mocked(prisma.user.upsert).mockRejectedValueOnce(
      Object.assign(new Error("Unique constraint failed"), {
        name: "PrismaClientKnownRequestError",
        code: "P2002",
      }),
    );
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: "db_user_existing",
    } as never);

    const req = new Request(url, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({
      success: true,
      data: { userId: "db_user_existing" },
      error: null,
    });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { clerkId: "clerk_user_123" },
      select: { id: true },
    });
  });
});
