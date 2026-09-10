"use client";

import { useEffect, useState } from "react";
import { localeCopy, type Locale } from "@/lib/i18n";

const storageKey = "academy-locale";

function applyLocale(locale: Locale) {
  const root = document.documentElement;
  root.lang = locale;
  root.dir = locale === "ar" ? "rtl" : "ltr";
  root.dataset.locale = locale;
  document.body.dataset.locale = locale;
  window.localStorage.setItem(storageKey, locale);
  window.dispatchEvent(new CustomEvent("academy-locale-change", { detail: locale }));
}

export default function LanguageToggle() {
  const [locale, setLocale] = useState<Locale>("ar");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem(storageKey);
      const next: Locale = saved === "en" ? "en" : "ar";
      setLocale(next);
      applyLocale(next);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function toggle() {
    const next: Locale = locale === "ar" ? "en" : "ar";
    setLocale(next);
    applyLocale(next);
  }

  return <button type="button" className="language-toggle" onClick={toggle} aria-label={`Switch language to ${localeCopy[locale].switchLabel}`} title={localeCopy[locale].switchLabel}><span aria-hidden="true">文</span><b>{locale === "ar" ? "EN" : "ع"}</b></button>;
}
