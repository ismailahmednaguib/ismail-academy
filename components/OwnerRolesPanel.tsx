"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type AdminRow = { user_id: string; email: string; role: string; active: boolean; created_at: string };

export default function OwnerRolesPanel({ setNotice }: { setNotice: (value: string) => void }) {
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase.rpc("list_site_admins");
    setAdmins((data ?? []) as AdminRow[]);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function saveAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !email.trim()) return;
    setLoading(true);
    const { data, error } = await supabase.rpc("set_site_admin_role", { target_email: email.trim(), target_role: role, target_active: true });
    setLoading(false);
    if (error || data !== true) {
      setNotice("لم يتم العثور على هذا البريد. أنشئ الحساب أولًا من تسجيل الأعضاء ثم أضفه كمشرف.");
      return;
    }
    setEmail("");
    setNotice("تم حفظ صلاحية المشرف.");
    void load();
  }

  async function toggleAdmin(row: AdminRow) {
    if (!supabase) return;
    const { data, error } = await supabase.rpc("set_site_admin_role", { target_email: row.email, target_role: row.role === "viewer" ? "viewer" : "editor", target_active: !row.active });
    if (error || data !== true) setNotice("تعذر تحديث حالة المشرف.");
    else void load();
  }

  async function removeAdmin(row: AdminRow) {
    if (!supabase || !window.confirm(`حذف صلاحية ${row.email}؟`)) return;
    const { data, error } = await supabase.rpc("remove_site_admin", { target_id: row.user_id });
    if (error || data !== true) setNotice("تعذر حذف الصلاحية.");
    else { setNotice("تم حذف الصلاحية."); void load(); }
  }

  return <section className="owner-section owner-roles-panel">
    <div className="owner-section-head"><div><h3>صلاحيات المالك والمشرفين</h3><p className="admin-note">أضف بريدًا مسجلًا بالفعل، ثم اختر هل يستطيع التعديل أو المشاهدة فقط.</p></div><button type="button" className="ghost small-owner-button" onClick={() => void load()}>تحديث</button></div>
    <form className="owner-fields compact owner-role-form" onSubmit={saveAdmin}><label>بريد العضو<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="member@example.com" required /></label><label>الصلاحية<select value={role} onChange={(event) => setRole(event.target.value)}><option value="editor">مشرف محرر</option><option value="viewer">مشرف قارئ</option></select></label><button className="primary" disabled={loading}>{loading ? "جارٍ الحفظ..." : "إضافة الصلاحية"}</button></form>
    <div className="admin-roles-list">{admins.length ? admins.map((row) => <div className="admin-role-row" key={row.user_id}><div><b>{row.email || "حساب بدون بريد"}</b><small>{row.role === "owner" ? "مالك" : row.role === "viewer" ? "مشرف قارئ" : "مشرف محرر"} · {row.active ? "مفعّل" : "موقوف"}</small></div>{row.role !== "owner" && <div><button type="button" className="text-button" onClick={() => void toggleAdmin(row)}>{row.active ? "إيقاف" : "تفعيل"}</button><button type="button" className="danger-link" onClick={() => void removeAdmin(row)}>حذف</button></div>}</div>) : <p className="admin-note">شغّل owner_roles_drafts.sql ثم أعد تحديث اللوحة.</p>}</div>
  </section>;
}

