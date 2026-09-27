import { SignIn } from "@clerk/nextjs";
import { validateReturnTo } from "@/lib/return-to";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { returnTo } = await searchParams;
  const validated = validateReturnTo(returnTo);

  return (
    <div className="flex min-h-screen items-center justify-center">
      {validated ? (
        <SignIn forceRedirectUrl={validated} />
      ) : (
        <SignIn fallbackRedirectUrl="/" />
      )}
    </div>
  );
}
