import "server-only";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import type { ApiResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import {
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ProgrammerError,
  ProvisioningError,
  ValidationError,
} from "@/lib/errors";

export function handleApiError(
  error: unknown,
): NextResponse<ApiResponse<null>> {
  if (error instanceof ZodError) {
    const flattened = z.flattenError(error);
    const message =
      flattened.formErrors && flattened.formErrors.length > 0
        ? flattened.formErrors.join("; ")
        : "Validation failed";

    const fieldErrors: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(flattened.fieldErrors)) {
      if (Array.isArray(value) && value.length > 0) {
        fieldErrors[key] = value.map(String);
      }
    }

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        data: null,
        error: {
          message,
          fieldErrors,
        },
      },
      { status: 400 },
    );
  }

  if (error instanceof ValidationError) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        data: null,
        error: {
          message: error.message,
          ...(error.fieldErrors ? { fieldErrors: error.fieldErrors } : {}),
        },
      },
      { status: 400 },
    );
  }

  if (error instanceof AuthenticationError) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        data: null,
        error: {
          message: error.message,
        },
      },
      { status: 401 },
    );
  }

  if (error instanceof ForbiddenError || error instanceof ProvisioningError) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        data: null,
        error: {
          message: error.message,
        },
      },
      { status: 403 },
    );
  }

  if (error instanceof NotFoundError) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        data: null,
        error: {
          message: error.message,
        },
      },
      { status: 404 },
    );
  }

  if (error instanceof SyntaxError && /JSON/i.test(error.message)) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        data: null,
        error: {
          message: "Invalid JSON in request body",
        },
      },
      { status: 400 },
    );
  }

  if (error && typeof error === "object" && "name" in error) {
    const errorName = String(error.name);
    if (
      errorName === "PrismaClientKnownRequestError" ||
      errorName === "PrismaClientInitializationError"
    ) {
      const code =
        "code" in error && typeof error.code === "string"
          ? error.code
          : undefined;

      if (
        code === "P1001" ||
        code === "P1002" ||
        code === "P1008" ||
        code === "P1017" ||
        code === "P2024"
      ) {
        logger.error({ err: error, code }, "Database availability error");
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            data: null,
            error: {
              message: "Internal server error",
            },
          },
          { status: 500 },
        );
      }

      if (code === "P2025") {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            data: null,
            error: {
              message: "Record not found",
              code: "P2025",
            },
          },
          { status: 404 },
        );
      }

      if (code === "P2002") {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            data: null,
            error: {
              message: "Unique constraint violation",
              code: "P2002",
            },
          },
          { status: 409 },
        );
      }

      if (code === "P2003") {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            data: null,
            error: {
              message: "Foreign key constraint violation",
              code: "P2003",
            },
          },
          { status: 400 },
        );
      }

      // Schema / migration errors are server-side faults, not client errors.
      if (code === "P2021" || code === "P2022" || code === "P2023") {
        logger.error({ err: error, code }, "Database schema error");
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            data: null,
            error: {
              message: "Internal server error",
            },
          },
          { status: 500 },
        );
      }

      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          error: {
            message: "Database request error",
            ...(code ? { code } : {}),
          },
        },
        { status: 400 },
      );
    }

    if (errorName === "PrismaClientValidationError") {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          error: {
            message: "Invalid database query payload",
          },
        },
        { status: 400 },
      );
    }
  }

  if (error instanceof ProgrammerError) {
    logger.error({ err: error }, "Programmer error");
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        data: null,
        error: {
          message: "Internal server error",
        },
      },
      { status: 500 },
    );
  }

  logger.error({ err: error }, "Unhandled API error");
  return NextResponse.json<ApiResponse<null>>(
    {
      success: false,
      data: null,
      error: {
        message: "Internal server error",
      },
    },
    { status: 500 },
  );
}
