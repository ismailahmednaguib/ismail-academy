"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type AnalyticsRow = { metric: string; value: number; label: string };

export default function OwnerAnalyticsPanel() {
  const [rows, setRows] = useState<AnalyticsRow[]>([]);
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase.rpc("get_site_analytics", { p_days: 30 });
    setRows((data ?? []) as AnalyticsRow[]);
    setLoading(false);
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => { void load(); }, 0); return () => window.clearTimeout(timer); }, [load]);
  const cards = useMemo(() => rows.filter((row) => row.metric !== "top_path"), [rows]);
  const paths = useMemo(() => rows.filter((row) => row.metric === "top_path"), [rows]);
  return <section className="owner-analytics"><div className="owner-section-head"><div><h3>نبض الأكاديمية</h3><p className="admin-note">إحصائيات آخر 30 يومًا، بدون كشف بيانات الزوار الشخصية.</p></div><button type="button" className="ghost small-owner-button" onClick={() => void load()}>{loading ? "جارٍ التحديث..." : "تحديث الإحصائيات"}</button></div><div className="analytics-cards">{cards.map((row) => <div className="analytics-card" key={row.metric}><span>{row.label}</span><b>{row.value.toLocaleString("ar-EG")}</b></div>)}</div>{paths.length > 0 && <div className="analytics-paths"><b>أكثر الصفحات زيارة</b>{paths.map((row) => <div key={row.label}><span>{row.label || "/"}</span><strong>{row.value.toLocaleString("ar-EG")}</strong></div>)}</div>}{rows.length === 0 && <p className="admin-note">شغّل ملف <b>site_analytics.sql</b> لتفعيل الإحصائيات.</p>}</section>;
}

