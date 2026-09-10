"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import MemberAccount from "@/components/MemberAccount";

type LearningStore = { saved: string[]; completed: string[] };
type LearningItem = { id: string; title: string; href: string; kind: string };
const storageKey = "academy-learning-v1";

function readLocal(): LearningStore {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) ?? "{}") as Partial<LearningStore>;
    return { saved: Array.isArray(parsed.saved) ? parsed.saved : [], completed: Array.isArray(parsed.completed) ? parsed.completed : [] };
  } catch { return { saved: [], completed: [] }; }
}

export default function MemberDashboard({ items }: { items: LearningItem[] }) {
  const [store, setStore] = useState<LearningStore>({ saved: [], completed: [] });
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
          if (active && data) setStore({ saved: Array.isArray(data.saved) ? data.saved : [], completed: Array.isArray(data.completed) ? data.completed : [] });
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
  const progress = items.length ? Math.round((completed.length / items.length) * 100) : 0;
  if (!ready) return <section className="member-dashboard"><div className="dashboard-loading">جارٍ تحميل مساحتك التعليمية...</div></section>;
  if (!email) return <section className="member-dashboard member-dashboard-empty"><p className="kicker">مساحة المتعلم</p><h1>خلّي رحلتك مترتبة.</h1><p>سجّل الدخول لحفظ الدروس ومتابعة الإنجاز من أي جهاز.</p><MemberAccount label="دخول / إنشاء حساب" /></section>;
  return <section className="member-dashboard"><div className="dashboard-heading"><div><p className="kicker">مساحتك التعليمية</p><h1>أهلًا بك في رحلتك.</h1><p>{email}</p></div><MemberAccount label="حسابي" /></div><div className="progress-card"><div><span>نسبة الإنجاز في مكتبة الأكاديمية</span><b>{progress}%</b></div><div className="progress-track"><i style={{ width: `${progress}%` }} /></div><small>كلما علّمت مادة كمكتملة، تتحدث النسبة تلقائيًا.</small></div><div className="dashboard-columns"><div className="dashboard-list"><div className="dashboard-list-head"><h2>محفوظ للمراجعة</h2><span>{saved.length}</span></div>{saved.length ? saved.map((item) => <Link href={item.href} className="dashboard-item" key={item.id}><span>↗</span><div><b>{item.title}</b><small>{item.kind}</small></div></Link>) : <p className="admin-note">لم تحفظ أي مادة بعد. افتح درسًا واضغط «حفظ للمراجعة».</p>}</div><div className="dashboard-list"><div className="dashboard-list-head"><h2>أنجزته</h2><span>{completed.length}</span></div>{completed.length ? completed.slice(0, 8).map((item) => <Link href={item.href} className="dashboard-item completed" key={item.id}><span>✓</span><div><b>{item.title}</b><small>{item.kind} · مكتمل</small></div></Link>) : <p className="admin-note">ابدأ بأول درس، ثم علّمه كمكتمل عند الانتهاء.</p>}</div></div></section>;
}
