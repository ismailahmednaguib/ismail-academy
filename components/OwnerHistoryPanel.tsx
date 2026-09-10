"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Version = { id: number; changed_by: string | null; change_note: string; created_at: string };
type Audit = { id: number; action: string; target: string; detail: string; created_at: string };

export default function OwnerHistoryPanel({ setNotice }: { setNotice: (value: string) => void }) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [audit, setAudit] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const [{ data: versionRows }, { data: auditRows }] = await Promise.all([supabase.rpc("list_site_content_versions", { limit_count: 20 }), supabase.rpc("list_site_audit", { limit_count: 30 })]);
    setVersions((versionRows ?? []) as Version[]);
    setAudit((auditRows ?? []) as Audit[]);
    setLoading(false);
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => { void load(); }, 0); return () => window.clearTimeout(timer); }, [load]);
  async function restore(id: number) {
    if (!supabase || !window.confirm("استرجاع هذه النسخة؟ سيتم أخذ نسخة من الحالة الحالية أولًا.")) return;
    const { data, error } = await supabase.rpc("restore_site_content_version", { version_id: id });
    if (error || data !== true) setNotice("تعذر استرجاع النسخة. تأكد من تشغيل final_platform.sql.");
    else { setNotice("تم الاسترجاع. سيتم تحديث الصفحة بالمحتوى المستعاد."); window.setTimeout(() => window.location.reload(), 700); }
  }
  return <section className="owner-history"><div className="owner-section-head"><div><h3>النسخ وسجل العمليات</h3><p className="admin-note">كل نشر يترك نقطة رجوع، وكل عملية مشرف تظهر في السجل.</p></div><button type="button" className="ghost small-owner-button" onClick={() => void load()}>{loading ? "جارٍ التحديث..." : "تحديث"}</button></div><div className="history-grid"><div className="history-box"><h4>نسخ المحتوى</h4>{versions.length ? versions.map((row) => <div className="history-row" key={row.id}><span><b>نسخة #{row.id}</b><small>{new Date(row.created_at).toLocaleString("ar-EG")}</small></span><button type="button" className="text-button" onClick={() => void restore(row.id)}>استرجاع</button></div>) : <p className="admin-note">ستظهر النسخ هنا بعد أول نشر جديد.</p>}</div><div className="history-box"><h4>آخر العمليات</h4>{audit.length ? audit.slice(0, 10).map((row) => <div className="history-row" key={row.id}><span><b>{row.action}</b><small>{row.target} · {new Date(row.created_at).toLocaleString("ar-EG")}</small></span></div>) : <p className="admin-note">لا توجد عمليات مسجلة بعد.</p>}</div></div></section>;
}

