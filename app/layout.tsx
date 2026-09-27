import "@/lib/env";
import { env } from "@/lib/env";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { parseTheme } from "@/lib/theme";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Surakshayantra",
  description: "Cybersecurity services, client portal, and admin workspace.",
};

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const theme = parseTheme(cookieStore.get("theme")?.value);

  return (
    <ClerkProvider
      publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl={env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
      signUpUrl={env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
    >
      <html
        lang="en"
        className={`${theme} ${geistSans.variable} ${jetBrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <body className="min-h-screen bg-base text-primary">{children}</body>
      </html>
    </ClerkProvider>
  );
}
