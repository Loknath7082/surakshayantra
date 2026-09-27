import "server-only";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { User, UserRole } from "@prisma/client";
import {
  AuthenticationError,
  ForbiddenError,
  ProgrammerError,
  ProvisioningError,
} from "@/lib/errors";

export type AuthUser = Pick<
  User,
  "id" | "clerkId" | "email" | "role" | "createdAt" | "updatedAt"
>;

export type AuthResult =
  | { status: "authenticated"; user: AuthUser }
  | { status: "unauthenticated"; user: null }
  | { status: "unprovisioned"; user: null };

// Note for callers: Server Components catch AuthenticationError -> redirect('/sign-in');
// ForbiddenError/ProvisioningError -> 403 UI or notFound();
// direct route-handler callers must return 403 for unprovisioned, not 401.

export async function getCurrentUser(): Promise<AuthResult> {
  const { userId } = await auth();
  if (!userId) {
    return { status: "unauthenticated", user: null };
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      clerkId: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return { status: "unprovisioned", user: null };
  }

  return { status: "authenticated", user };
}

export async function requireRole(
  allowedRoles: UserRole[] | readonly UserRole[]
): Promise<AuthUser> {
  if (!allowedRoles || allowedRoles.length === 0) {
    throw new ProgrammerError(
      "requireRole called with an empty allowedRoles array"
    );
  }

  const authResult = await getCurrentUser();

  if (authResult.status === "unauthenticated") {
    throw new AuthenticationError();
  }

  if (authResult.status === "unprovisioned") {
    throw new ProvisioningError();
  }

  if (!allowedRoles.includes(authResult.user.role)) {
    throw new ForbiddenError();
  }

  return authResult.user;
}
