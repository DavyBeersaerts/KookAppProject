import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { households } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KookApp - Meal Planning Made Easy",
  description: "Plan your meals, manage recipes, and generate shopping lists",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  let language: "en" | "nl" = "en";

  if (session?.user?.householdId) {
    const household = await db
      .select()
      .from(households)
      .where(eq(households.id, session.user.householdId))
      .then((h) => h[0]);

    language = household?.settings?.language || "en";
  }

  return (
    <html lang={language}>
      <body className={inter.className}>
        <Providers language={language}>{children}</Providers>
      </body>
    </html>
  );
}