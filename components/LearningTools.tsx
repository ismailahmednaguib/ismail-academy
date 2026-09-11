"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type LearningStore = { saved: string[]; completed: string[]; recent: string[] };
type LearningItem = { id: string; title: string; href: string; kind: string };
const storageKey = "academy-learning-v1";
const momentumKey = "academy-study-momentum-v1";

function emptyStore(): LearningStore { return { saved: [], completed: [], recent: [] }; }

function readStore(): LearningStore {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) ?? "{}") as Partial<LearningStore>;
    return { saved: Array.isArray(value.saved) ? value.saved : [], completed: Array.isArray(value.completed) ? value.completed : [], recent: Array.isArray(value.recent) ? value.recent : [] };
  } catch { return emptyStore(); }
}

function writeStore(store: LearningStore) {
  localStorage.setItem(storageKey, JSON.stringify(store));
  window.dispatchEvent(new CustomEvent("academy-learning-change"));
}

async function getRemoteStore(): Promise<LearningStore | null> {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const { data, error } = await supabase.from("member_learning").select("saved,completed").eq("user_id", session.user.id).maybeSingle();
  if (error || !data) return null;
  return { saved: Array.isArray(data.saved) ? data.saved : [], completed: Array.isArray(data.completed) ? data.completed : [], recent: [] };
}

async function saveRemoteStore(store: LearningStore) {
  if (!supabase) return;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;
  await supabase.from("member_learning").upsert({ user_id: session.user.id, saved: store.saved, completed: store.completed, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
}

async function hydrateStore(apply: (store: LearningStore) => void) {
  const local = readStore();
  apply(local);
  const remote = await getRemoteStore();
  if (remote) { const merged = { ...remote, recent: local.recent }; writeStore(merged); apply(merged); }
  else void saveRemoteStore(local);
}

function rememberItem(id: string) {
  const current = readStore();
  const next = { ...current, recent: [id, ...current.recent.filter((item) => item !== id)].slice(0, 8) };
  localStorage.setItem(storageKey, JSON.stringify(next));
}

function markStudySession() {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const value = JSON.parse(localStorage.getItem(momentumKey) ?? "{}") as { sessions?: unknown };
    const sessions = Array.isArray(value.sessions) ? value.sessions.filter((item): item is string => typeof item === "string") : [];
    if (!sessions.includes(today)) {
      localStorage.setItem(momentumKey, JSON.stringify({ sessions: [...sessions, today].slice(-365) }));
      window.dispatchEvent(new CustomEvent("academy-momentum-change"));
    }
  } catch {
    localStorage.setItem(momentumKey, JSON.stringify({ sessions: [today] }));
  }
}

export function LearningActions({ id, title }: { id: string; title: string }) {
  const [store, setStore] = useState<LearningStore>(emptyStore());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    rememberItem(id);
    const timer = window.setTimeout(() => { void hydrateStore((next) => { setStore(next); setReady(true); }); }, 0);
    const refresh = () => { void hydrateStore((next) => setStore(next)); };
    window.addEventListener("academy-learning-change", refresh);
    window.addEventListener("academy-auth-change", refresh);
    return () => { window.clearTimeout(timer); window.removeEventListener("academy-learning-change", refresh); window.removeEventListener("academy-auth-change", refresh); };
  }, [id]);

  function updateStore(bucket: "saved" | "completed") {
    markStudySession();
    const current = readStore();
    const exists = current[bucket].includes(id);
    const next = { ...current, [bucket]: exists ? current[bucket].filter((item) => item !== id) : [...current[bucket], id] };
    writeStore(next);
    setStore(next);
    void saveRemoteStore(next);
  }

  if (!ready) return <div className="learning-actions placeholder" aria-hidden="true" />;
  const isSaved = store.saved.includes(id);
  const isCompleted = store.completed.includes(id);
  return <div className="learning-actions" aria-label={"أدوات " + title}>
    <button type="button" className={isSaved ? "active" : ""} onClick={() => updateStore("saved")}>{isSaved ? "محفوظ للمراجعة ✓" : "حفظ للمراجعة"}</button>
    <button type="button" className={isCompleted ? "active complete" : ""} onClick={() => updateStore("completed")}>{isCompleted ? "تم الإنجاز ✓" : "علّمه كمكتمل"}</button>
  </div>;
}

export function LearningShelf({ items }: { items: LearningItem[] }) {
  const [store, setStore] = useState<LearningStore>(emptyStore());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => { void hydrateStore((next) => { setStore(next); setReady(true); }); };
    const timer = window.setTimeout(load, 0);
    window.addEventListener("academy-learning-change", load);
    window.addEventListener("academy-auth-change", load);
    return () => { window.clearTimeout(timer); window.removeEventListener("academy-learning-change", load); window.removeEventListener("academy-auth-change", load); };
  }, []);

  const savedItems = useMemo(() => items.filter((item) => store.saved.includes(item.id)), [items, store.saved]);
  if (!ready || savedItems.length === 0) return null;
  return <section className="learning-shelf" id="learning-shelf" aria-label="متابعة رحلتك">
    <div><p className="kicker">مساحتك الخاصة</p><h2>تابع من حيث توقفت.</h2><p>تتم مزامنة العناصر المحفوظة مع حسابك، وتظل متاحة محليًا عند الحاجة.</p></div>
    <div className="learning-shelf-list">{savedItems.slice(0, 4).map((item) => { const completed = store.completed.includes(item.id); return <Link href={item.href} className={completed ? "learning-shelf-item completed" : "learning-shelf-item"} key={item.id}><span>{completed ? "✓" : "↗"}</span><div><b>{item.title}</b><small>{item.kind}{completed ? " · مكتمل" : " · محفوظ للمراجعة"}</small></div></Link>; })}</div>
  </section>;
}
