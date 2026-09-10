"use client";

import { useEffect, useState } from "react";
import { localeCopy, type Locale } from "@/lib/i18n";

export default function ThemeToggle({ defaultMode }: { defaultMode: "light" | "dark" }) {
  const [isDark, setIsDark] = useState(defaultMode === "dark");
  const [locale, setLocale] = useState<Locale>("ar");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem("academy-theme-mode");
      const mode = saved === "dark" || saved === "light" ? saved : defaultMode;
      document.body.dataset.theme = mode;
      setIsDark(mode === "dark");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [defaultMode]);

  useEffect(() => {
    const update = (event: Event) => {
      const next = (event as CustomEvent<Locale>).detail;
      if (next === "ar" || next === "en") setLocale(next);
    };
    window.addEventListener("academy-locale-change", update);
    return () => window.removeEventListener("academy-locale-change", update);
  }, []);

  function toggle() {
    const mode = isDark ? "light" : "dark";
    document.body.dataset.theme = mode;
    window.localStorage.setItem("academy-theme-mode", mode);
    setIsDark(mode === "dark");
  }

  const copy = localeCopy[locale];
  return <button type="button" className="theme-toggle" onClick={toggle} aria-label={isDark ? copy.enableLight : copy.enableDark} title={isDark ? copy.lightMode : copy.darkMode}><span className="theme-toggle-dot" aria-hidden="true" /><small>{isDark ? copy.lightMode : copy.darkMode}</small></button>;
}
