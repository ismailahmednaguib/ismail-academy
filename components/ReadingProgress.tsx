"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress({ contentId }: { contentId?: string }) {
  const [progress, setProgress] = useState(0);
  const [savedProgress, setSavedProgress] = useState(0);
  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    const storageKey = contentId ? `academy-reading-progress:${contentId}` : "";
    const initialTimer = window.setTimeout(() => {
      if (!storageKey) return;
      const stored = Number(window.localStorage.getItem(storageKey) ?? 0);
      if (stored > 8 && stored < 96) { setSavedProgress(stored); setShowResume(true); }
    }, 0);
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const next = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      const bounded = Math.min(100, Math.max(0, next));
      setProgress(bounded);
      if (storageKey && bounded > 4 && bounded < 99) window.localStorage.setItem(storageKey, String(Math.round(bounded)));
      if (window.scrollY > 160) setShowResume(false);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.clearTimeout(initialTimer);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [contentId]);

  function resume() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: scrollable * (savedProgress / 100), behavior: "smooth" });
    setShowResume(false);
  }

  return <><div className="reading-progress" aria-hidden="true"><i style={{ width: `${progress}%` }} /></div>{showResume && contentId && <button type="button" className="reading-resume" onClick={resume}>استئناف القراءة من {Math.round(savedProgress)}٪ <b>↗</b></button>}</>;
}
