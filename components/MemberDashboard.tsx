"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import MemberAccount from "@/components/MemberAccount";
import StudyMomentum from "@/components/StudyMomentum";
import type { Settings } from "@/lib/content";

type LearningStore = { saved: string[]; completed: string[]; recent: string[] };
type LearningItem = { id: string; title: string; href: string; kind: string };
const storageKey = "academy-learning-v1";

function readLocal(): LearningStore {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) ?? "{}") as Partial<LearningStore>;
    return { saved: Array.isArray(parsed.saved) ? parsed.saved : [], completed: Array.isArray(parsed.completed) ? parsed.completed : [], recent: Array.isArray(parsed.recent) ? parsed.recent : [] };
  } catch { return { saved: [], completed: [], recent: [] }; }
}

export default function MemberDashboard({ items, settings, showMomentum = true }: { items: LearningItem[]; settings: Settings; showMomentum?: boolean }) {
  const [store, setStore] = useState<LearningStore>({ saved: [], completed: [], recent: [] });
  const [email, setEmail] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    const load = async () => {
      const local = readLocal();
      if (active) setStore(local);
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (active) setEmail(session?.user.email ?? "");
        if (session) {
          const { data } = await supabase.from("member_learning").select("saved,completed").eq("user_id", session.user.id).maybeSingle();
          if (active && data) setStore({ saved: Array.isArray(data.saved) ? data.saved : [], completed: Array.isArray(data.completed) ? data.completed : [], recent: local.recent });
        }
      }
      if (active) setReady(true);
    };
    void load();
    window.addEventListener("academy-auth-change", load);
    window.addEventListener("academy-learning-change", load);
    return () => { active = false; window.removeEventListener("academy-auth-change", load); window.removeEventListener("academy-learning-change", load); };
  }, []);
  const saved = useMemo(() => items.filter((item) => store.saved.includes(item.id)), [items, store.saved]);
  const completed = useMemo(() => items.filter((item) => store.completed.includes(item.id)), [items, store.completed]);
  const unfinished = useMemo(() => items.filter((item) => !store.completed.includes(item.id)), [items, store.completed]);
  const recent = useMemo(() => store.recent.map((id) => items.find((item) => item.id === id)).filter((item): item is LearningItem => Boolean(item)).filter((item) => !store.completed.includes(item.id)), [items, store.completed, store.recent]);
  const nextItem = useMemo(() => recent[0] ?? saved.find((item) => !store.completed.includes(item.id)) ?? unfinished[0], [recent, saved, store.completed, unfinished]);
  const queue = useMemo(() => unfinished.filter((item) => item.id !== nextItem?.id).slice(0, 3), [nextItem?.id, unfinished]);
  const progress = items.length ? Math.round((completed.length / items.length) * 100) : 0;
  if (!ready) return <section className="member-dashboard"><div className="dashboard-loading">جارٍ تحميل مساحتك التعليمية...</div></section>;
  if (!email) return <section className="member-dashboard member-dashboard-empty"><p className="kicker">{settings.dashboardKicker}</p><h1>خلّي رحلتك مترتبة.</h1><p>سجّل الدخول لحفظ الدروس ومتابعة الإنجاز من أي جهاز.</p><MemberAccount label="دخول / إنشاء حساب" /></section>;
  return <section className="member-dashboard"><div className="dashboard-heading"><div><p className="kicker">{settings.dashboardKicker}</p><h1>{settings.dashboardTitle}</h1><p>{email}</p></div><MemberAccount label="حسابي" /></div><div className="progress-card"><div><span>{settings.dashboardProgressLabel}</span><b>{progress}%</b></div><div className="progress-track"><i style={{ width: `${progress}%` }} /></div><small>{settings.dashboardProgressHelp}</small></div>{nextItem ? <section className="dashboard-next" aria-labelledby="dashboard-next-title"><div className="dashboard-next-copy"><p className="kicker">{settings.dashboardQueueKicker}</p><h2 id="dashboard-next-title">{settings.dashboardQueueTitle}</h2><p>{settings.dashboardQueueText}</p><Link href={nextItem.href} className="dashboard-next-action">{settings.dashboardStartLabel} <b>←</b></Link></div><div className="dashboard-next-card"><span>{recent.some((item) => item.id === nextItem.id) ? settings.dashboardRecentLabel : saved.some((item) => item.id === nextItem.id) ? settings.dashboardSavedLabel : settings.dashboardSuggestedLabel}</span><b>{nextItem.title}</b><small>{nextItem.kind} · {unfinished.length} {settings.dashboardRemainingLabel}</small>{queue.length > 0 && <div className="dashboard-queue">{queue.map((item, index) => <Link href={item.href} key={item.id}><i>0{index + 2}</i><span>{item.title}</span><b>↗</b></Link>)}</div>}</div></section> : <section className="dashboard-finished" aria-live="polite"><span>✓</span><div><p className="kicker">{settings.dashboardFinishedKicker}</p><h2>{settings.dashboardFinishedTitle}</h2><p>{settings.dashboardFinishedText}</p></div><Link href="/search">{settings.dashboardExploreLabel}</Link></section>}{showMomentum && <StudyMomentum completedCount={completed.length} />}<div className="dashboard-columns"><div className="dashboard-list"><div className="dashboard-list-head"><h2>{settings.dashboardSavedTitle}</h2><span>{saved.length}</span></div>{saved.length ? saved.map((item) => <Link href={item.href} className="dashboard-item" key={item.id}><span>↗</span><div><b>{item.title}</b><small>{item.kind}</small></div></Link>) : <p className="admin-note">{settings.dashboardSavedEmpty}</p>}</div><div className="dashboard-list"><div className="dashboard-list-head"><h2>{settings.dashboardCompletedTitle}</h2><span>{completed.length}</span></div>{completed.length ? completed.slice(0, 8).map((item) => <Link href={item.href} className="dashboard-item completed" key={item.id}><span>✓</span><div><b>{item.title}</b><small>{item.kind} · مكتمل</small></div></Link>) : <p className="admin-note">{settings.dashboardCompletedEmpty}</p>}</div></div></section>;
}
