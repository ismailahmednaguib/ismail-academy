"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type NotificationRow = { id: number; kind: string; title: string; detail: string; created_at: string; read_at: string | null };
type MemberRow = { id: string; email: string; full_name: string; created_at: string };

const icons: Record<string, string> = { account: "♙", newsletter: "✉", majlis: "✦" };

export default function OwnerNotifications() {
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(true);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const [{ data: notificationRows, error: notificationError }, { data: memberRows }] = await Promise.all([
      supabase.from("site_notifications").select("id,kind,title,detail,created_at,read_at").order("created_at", { ascending: false }).limit(80),
      supabase.from("site_members").select("id,email,full_name,created_at").order("created_at", { ascending: false }).limit(100),
    ]);
    setAvailable(!notificationError);
    setNotifications((notificationRows ?? []) as NotificationRow[]);
    setMembers((memberRows ?? []) as MemberRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(() => { void load(); }, 0);
    const timer = window.setInterval(() => { void load(); }, 30000);
    return () => { window.clearTimeout(initial); window.clearInterval(timer); };
  }, [load]);

  async function markRead(id: number) {
    if (!supabase) return;
    await supabase.from("site_notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
    setNotifications((rows) => rows.map((row) => row.id === id ? { ...row, read_at: new Date().toISOString() } : row));
  }

  async function markAllRead() {
    if (!supabase) return;
    await supabase.from("site_notifications").update({ read_at: new Date().toISOString() }).is("read_at", null);
    setNotifications((rows) => rows.map((row) => ({ ...row, read_at: row.read_at ?? new Date().toISOString() })));
  }

  const unread = useMemo(() => notifications.filter((row) => !row.read_at).length, [notifications]);

  return <section className="owner-notification-center">
    <div className="owner-section-head"><div><h3>الإشعارات والحسابات</h3><p className="admin-note">تتحدث تلقائيًا كل 30 ثانية عند فتح لوحة المالك.</p></div><div className="notification-actions"><button type="button" className="ghost small-owner-button" onClick={() => void load()}>{loading ? "جارٍ التحديث..." : "تحديث"}</button>{unread > 0 && <button type="button" className="text-button" onClick={() => void markAllRead()}>تعليم الكل كمقروء</button>}</div></div>
    {!available && <div className="owner-alert">شغّل ملف <b>member_accounts_notifications.sql</b> في Supabase لتفعيل الحسابات وإشعارات التسجيل.</div>}
    <div className="notification-layout">
      <div className="notification-box"><div className="notification-box-head"><h4>آخر النشاط <span>{unread ? `${unread} جديد` : "لا يوجد جديد"}</span></h4></div>{notifications.length ? notifications.map((row) => <article className={`notification-item${row.read_at ? " is-read" : ""}`} key={row.id}><i>{icons[row.kind] ?? "•"}</i><div><b>{row.title}</b><span>{row.detail}</span><small>{new Date(row.created_at).toLocaleString("ar-EG")}</small></div>{!row.read_at && <button type="button" onClick={() => void markRead(row.id)}>قرأته</button>}</article>) : <p className="admin-note">لا توجد إشعارات بعد.</p>}</div>
      <div className="notification-box"><div className="notification-box-head"><h4>حسابات الأعضاء <span>{members.length}</span></h4></div>{members.length ? members.map((member) => <article className="member-row" key={member.id}><i>♙</i><div><b>{member.full_name || "عضو جديد"}</b><span>{member.email}</span><small>{new Date(member.created_at).toLocaleDateString("ar-EG")}</small></div></article>) : <p className="admin-note">لا توجد حسابات مسجلة بعد.</p>}</div>
    </div>
  </section>;
}
