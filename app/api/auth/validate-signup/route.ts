import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";
import type { ApiResponse } from "@/lib/api-response";
import { isDisposableEmail } from "@/lib/disposable-emails";
import { signupEmailSchema } from "@/lib/validations/auth";

export async function POST(
  request: Request,
): Promise<NextResponse<ApiResponse<{ allowed: boolean } | null>>> {
  try {
    const body = await request.json();
    const validated = signupEmailSchema.parse(body);

    if (isDisposableEmail(validated.email)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          data: null,
          error: {
            message: "Disposable emails are not allowed",
            code: "DISPOSABLE_EMAIL",
          },
        },
        { status: 400 },
      );
    }

    return NextResponse.json<ApiResponse<{ allowed: boolean }>>(
      {
        success: true,
        data: { allowed: true },
        error: null,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
