"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle({ defaultMode }: { defaultMode: "light" | "dark" }) {
  const [isDark, setIsDark] = useState(defaultMode === "dark");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem("academy-theme-mode");
      const mode = saved === "dark" || saved === "light" ? saved : defaultMode;
      document.body.dataset.theme = mode;
      setIsDark(mode === "dark");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [defaultMode]);

  function toggle() {
    const mode = isDark ? "light" : "dark";
    document.body.dataset.theme = mode;
    window.localStorage.setItem("academy-theme-mode", mode);
    setIsDark(mode === "dark");
  }

  return <button type="button" className="theme-toggle" onClick={toggle} aria-label={isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"} title={isDark ? "الوضع النهاري" : "الوضع الليلي"}><span className="theme-toggle-dot" aria-hidden="true" /><small>{isDark ? "نهاري" : "ليلي"}</small></button>;
}
