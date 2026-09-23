"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "si" | "en";

const LanguageContext = createContext<{language: Language; setLanguage:(value:Language)=>void}>({
  language: "si",
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("si");

  useEffect(() => {
    const saved = window.localStorage.getItem("mangalamm_language");
    if (saved === "en" || saved === "si") setLanguageState(saved);
  }, []);

  const setLanguage = (value: Language) => {
    setLanguageState(value);
    window.localStorage.setItem("mangalamm_language", value);
    document.documentElement.lang = value === "si" ? "si" : "en";
  };

  const value = useMemo(() => ({ language, setLanguage }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
