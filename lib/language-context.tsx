"use client";

import { createContext, useContext, ReactNode } from "react";
import { TRANSLATIONS } from "@/lib/constants";

type Language = "en" | "nl";
type TranslationKeys = keyof typeof TRANSLATIONS.en;
type Translations = Record<TranslationKeys, string>;

interface LanguageContextType {
  language: Language;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  language,
}: {
  children: ReactNode;
  language: Language;
}) {
  const t = TRANSLATIONS[language] as Translations;

  return (
    <LanguageContext.Provider value={{ language, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}