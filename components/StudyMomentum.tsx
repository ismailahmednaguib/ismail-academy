"use client";

import { useEffect, useMemo, useState } from "react";

const storageKey = "academy-study-momentum-v1";

type MomentumStore = { sessions: string[] };

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function readStore(): MomentumStore {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) ?? "{}") as Partial<MomentumStore>;
    return { sessions: Array.isArray(value.sessions) ? value.sessions.filter((item): item is string => typeof item === "string") : [] };
  } catch {
    return { sessions: [] };
  }
}

function dayOffset(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() - offset);
  return date.toISOString().slice(0, 10);
}

export default function StudyMomentum({ completedCount }: { completedCount: number }) {
  const [store, setStore] = useState<MomentumStore>({ sessions: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => { setStore(readStore()); setReady(true); }, 0);
    const refresh = () => setStore(readStore());
    window.addEventListener("academy-momentum-change", refresh);
    return () => { window.clearTimeout(timer); window.removeEventListener("academy-momentum-change", refresh); };
  }, []);

  const streak = useMemo(() => {
    let count = 0;
    for (let index = 0; index < 365; index += 1) {
      if (!store.sessions.includes(dayOffset(index))) break;
      count += 1;
    }
    return count;
  }, [store.sessions]);

  const weeklySessions = useMemo(() => Array.from({ length: 7 }, (_, index) => store.sessions.includes(dayOffset(index))).filter(Boolean).length, [store.sessions]);
  if (!ready) return null;
  const today = todayKey();
  const checkedIn = store.sessions.includes(today);
  function markSession() {
    if (checkedIn) return;
    const next = { sessions: [...new Set([...store.sessions, today])].slice(-365) };
    setStore(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  return <section className="study-momentum" aria-labelledby="momentum-title">
    <div className="momentum-main"><span className="momentum-orbit" aria-hidden="true">✦</span><div><p className="kicker">إيقاعك هذا الأسبوع</p><h2 id="momentum-title">استمرار صغير، أثر كبير.</h2><p>ثبّت حضورك كل يوم حتى لو بخمس دقائق. المنصة تحفظ إيقاعك على جهازك.</p></div></div>
    <div className="momentum-stats"><div><b>{streak}</b><small>يوم متتالي</small></div><div><b>{weeklySessions}/7</b><small>هذا الأسبوع</small></div><div><b>{completedCount}</b><small>مادة مكتملة</small></div></div>
    <button type="button" className={checkedIn ? "momentum-check checked" : "momentum-check"} onClick={markSession}>{checkedIn ? "✓ سجلت جلسة اليوم" : "سجل جلسة اليوم"}</button>
  </section>;
}
