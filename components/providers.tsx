"use client";

import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/lib/language-context";

export function Providers({
  children,
  language = "en",
}: {
  children: React.ReactNode;
  language?: "en" | "nl";
}) {
  return (
    <SessionProvider>
      <LanguageProvider language={language}>{children}</LanguageProvider>
    </SessionProvider>
  );
}