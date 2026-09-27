import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { handleApiError } from "@/lib/api-error";
import type { ApiResponse } from "@/lib/api-response";

type ClerkUserCreatedEvent = {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{ id: string; email_address: string }>;
    primary_email_address_id: string | null | undefined;
  };
};

/**
 * Checks whether an error is a Prisma unique constraint violation (P2002).
 *
 * @param err - Unknown error object to inspect
 * @returns True if error is a Prisma P2002 known request error
 */
function isP2002(err: unknown): boolean {
  return (
    err instanceof Error &&
    err.name === "PrismaClientKnownRequestError" &&
    "code" in err &&
    (err as { code?: string }).code === "P2002"
  );
}

/**
 * Handles incoming Clerk webhook events.
 *
 * Validates Svix request signature, ignores non-`user.created` events, extracts
 * the primary email, and idempotently upserts the user into PostgreSQL.
 *
 * @param request - Next.js Request object containing Svix headers and raw JSON body
 * @returns Next.js JSON response with created/existing userId or structured error
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.text();
    if (!body.trim()) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          error: {
            message: "Invalid signature",
            code: "INVALID_SIGNATURE",
          },
        },
        { status: 400 },
      );
    }

    const svixId = request.headers.get("svix-id");
    const svixTimestamp = request.headers.get("svix-timestamp");
    const svixSignature = request.headers.get("svix-signature");

    if (
      !svixId ||
      !svixId.trim() ||
      !svixTimestamp ||
      !svixTimestamp.trim() ||
      !svixSignature ||
      !svixSignature.trim()
    ) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          error: {
            message: "Invalid signature",
            code: "INVALID_SIGNATURE",
          },
        },
        { status: 400 },
      );
    }

    let event: ClerkUserCreatedEvent;
    try {
      const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
      event = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as ClerkUserCreatedEvent;
    } catch {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          error: {
            message: "Invalid signature",
            code: "INVALID_SIGNATURE",
          },
        },
        { status: 400 },
      );
    }

    if (
      !event.data ||
      typeof event.type !== "string" ||
      typeof event.data.id !== "string" ||
      !event.data.id.trim() ||
      !Array.isArray(event.data.email_addresses) ||
      !event.data.email_addresses.every(
        (e) =>
          typeof e === "object" &&
          e !== null &&
          typeof e.id === "string" &&
          typeof e.email_address === "string",
      )
    ) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          error: {
            message: "Malformed payload",
            code: "INVALID_PAYLOAD",
          },
        },
        { status: 400 },
      );
    }

    if (event.type !== "user.created") {
      logger.info({ type: event.type }, "Ignoring webhook event");
      return NextResponse.json<ApiResponse<{ ignored: boolean }>>(
        {
          success: true,
          data: { ignored: true },
          error: null,
        },
        { status: 200 },
      );
    }

    const { id: clerkId, email_addresses, primary_email_address_id } =
      event.data;
    const primary = email_addresses.find(
      (e) => e.id === primary_email_address_id,
    );
    if (!primary_email_address_id || !primary) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          error: {
            message: "Primary email missing",
            code: "PRIMARY_EMAIL_MISSING",
          },
        },
        { status: 400 },
      );
    }
    const email = primary.email_address;

    let userId: string;
    try {
      const user = await prisma.user.upsert({
        where: { clerkId },
        update: {},
        create: { clerkId, email, role: "CLIENT" },
        select: { id: true },
      });
      userId = user.id;
    } catch (err) {
      if (isP2002(err)) {
        const existing = await prisma.user.findUnique({
          where: { clerkId },
          select: { id: true },
        });
        if (!existing) throw err;
        userId = existing.id;
      } else {
        throw err;
      }
    }

    return NextResponse.json<ApiResponse<{ userId: string }>>(
      {
        success: true,
        data: { userId },
        error: null,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
