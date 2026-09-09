"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type LearningStore = {
  saved: string[];
  completed: string[];
};

type LearningItem = {
  id: string;
  title: string;
  href: string;
  kind: string;
};

const storageKey = "academy-learning-v1";

function readStore(): LearningStore {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) ?? "{}") as Partial<LearningStore>;
    return {
      saved: Array.isArray(value.saved) ? value.saved : [],
      completed: Array.isArray(value.completed) ? value.completed : [],
    };
  } catch {
    return { saved: [], completed: [] };
  }
}

function writeStore(store: LearningStore) {
  localStorage.setItem(storageKey, JSON.stringify(store));
  window.dispatchEvent(new CustomEvent("academy-learning-change"));
}

export function LearningActions({ id, title }: { id: string; title: string }) {
  const [store, setStore] = useState<LearningStore>({ saved: [], completed: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setStore(readStore());
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [id]);

  function updateStore(bucket: "saved" | "completed") {
    const current = readStore();
    const exists = current[bucket].includes(id);
    const next = {
      ...current,
      [bucket]: exists ? current[bucket].filter((item) => item !== id) : [...current[bucket], id],
    };
    writeStore(next);
    setStore(next);
  }

  if (!ready) return <div className="learning-actions placeholder" aria-hidden="true" />;

  const isSaved = store.saved.includes(id);
  const isCompleted = store.completed.includes(id);
  return (
    <div className="learning-actions" aria-label={"أدوات " + title}>
      <button type="button" className={isSaved ? "active" : ""} onClick={() => updateStore("saved")}>
        {isSaved ? "محفوظ للمراجعة ✓" : "حفظ للمراجعة"}
      </button>
      <button type="button" className={isCompleted ? "active complete" : ""} onClick={() => updateStore("completed")}>
        {isCompleted ? "تم الإنجاز ✓" : "علّمه كمكتمل"}
      </button>
    </div>
  );
}

export function LearningShelf({ items }: { items: LearningItem[] }) {
  const [store, setStore] = useState<LearningStore>({ saved: [], completed: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => {
      setStore(readStore());
      setReady(true);
    };
    const timer = window.setTimeout(load, 0);
    window.addEventListener("academy-learning-change", load);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("academy-learning-change", load);
    };
  }, []);

  const savedItems = useMemo(() => items.filter((item) => store.saved.includes(item.id)), [items, store.saved]);
  if (!ready || savedItems.length === 0) return null;

  return (
    <section className="learning-shelf" aria-label="متابعة رحلتك">
      <div>
        <p className="kicker">مساحتك الخاصة</p>
        <h2>تابع من حيث توقفت.</h2>
        <p>العناصر المحفوظة على هذا الجهاز تظهر هنا لتعود إليها بسهولة.</p>
      </div>
      <div className="learning-shelf-list">
        {savedItems.slice(0, 4).map((item) => {
          const completed = store.completed.includes(item.id);
          return (
            <Link href={item.href} className={completed ? "learning-shelf-item completed" : "learning-shelf-item"} key={item.id}>
              <span>{completed ? "✓" : "↗"}</span>
              <div><b>{item.title}</b><small>{item.kind}{completed ? " · مكتمل" : " · محفوظ للمراجعة"}</small></div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
