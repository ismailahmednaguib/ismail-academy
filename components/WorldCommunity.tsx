"use client";

import { useEffect, useMemo, useState } from "react";
import type { Settings } from "@/lib/content";
import { countryName } from "@/lib/countries";
import { supabase } from "@/lib/supabase";

type CountryStat = { country_code: string; country_name: string; member_count: number };

const positions: Record<string, [number, number]> = {
  EG: [61, 53], SA: [67, 59], AE: [72, 57], QA: [70, 54], KW: [68, 50], JO: [64, 48],
  PS: [62, 47], IQ: [67, 45], TR: [60, 37], MA: [42, 51], DZ: [37, 52], TN: [45, 46],
  SD: [57, 66], GB: [48, 27], FR: [49, 34], DE: [54, 31], IT: [55, 39], ES: [43, 37],
  US: [23, 39], CA: [24, 25], MY: [82, 72], ID: [87, 76], PK: [76, 49], IN: [79, 56], NG: [49, 69],
};

function positionFor(code: string, index: number): [number, number] {
  if (positions[code]) return positions[code];
  return [28 + ((index * 17) % 58), 27 + ((index * 23) % 48)];
}

function useCountryStats() {
  const [stats, setStats] = useState<CountryStat[]>([]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!supabase) return;
      void supabase.rpc("get_site_country_stats").then(({ data }) => {
        if (Array.isArray(data)) setStats(data as CountryStat[]);
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  return stats;
}

export function WorldGlobe({ compact = false }: { compact?: boolean }) {
  const stats = useCountryStats();
  const total = stats.reduce((sum, item) => sum + Number(item.member_count || 0), 0);
  const nodes = useMemo(() => stats.slice(0, compact ? 5 : 8).map((item, index) => ({ ...item, point: positionFor(item.country_code, index) })), [stats, compact]);
  const featured = stats.slice(0, compact ? 3 : 6);

  return <div className={`world-globe-card${compact ? " compact" : ""}`}>
    <div className="world-globe-visual">
      <div className="world-globe-sphere" aria-label="كرة أرضية لمجتمع الأكاديمية">
        <span className="world-latitude latitude-one" /><span className="world-latitude latitude-two" /><span className="world-meridian meridian-one" /><span className="world-meridian meridian-two" />
        <svg className="world-connections" viewBox="0 0 100 100" aria-hidden="true">{nodes.slice(1).map((node, index) => <line key={node.country_code} x1={nodes[0]?.point[0] ?? 52} y1={nodes[0]?.point[1] ?? 52} x2={node.point[0]} y2={node.point[1]} style={{ animationDelay: `${index * 180}ms` }} />)}</svg>
        {nodes.map((node) => <span className="world-node" key={node.country_code} style={{ left: `${node.point[0]}%`, top: `${node.point[1]}%` }} title={`${node.country_name || countryName(node.country_code)} · ${node.member_count}`}><i /></span>)}
        <div className="world-core"><b>{total}</b><small>عضو متصل</small></div>
      </div>
      <div className="world-orbit orbit-one" /><div className="world-orbit orbit-two" />
    </div>
    <div className="world-globe-info"><p className="world-overline">شبكة معرفة هادئة</p><h3>{stats.length ? `${stats.length} دول متصلة` : "العالم يفتح بابه"}</h3><p>{stats.length ? "كل نقطة تمثل بلدًا اختار منه أحد أعضاء الأكاديمية أن يبدأ رحلته." : "اختر دولتك عند إنشاء الحساب لتظهر أول نقطة على الخريطة."}</p><div className="world-country-list">{featured.length ? featured.map((item, index) => <div className="world-country" key={item.country_code}><span>{String(index + 1).padStart(2, "0")}</span><b>{item.country_name || countryName(item.country_code)}</b><small>{item.member_count} {item.member_count === 1 ? "عضو" : "أعضاء"}</small></div>) : <div className="world-country empty"><span>+</span><b>كن أول عضو</b><small>من بلدك</small></div>}</div></div>
  </div>;
}

export default function WorldCommunity({ settings }: { settings: Settings }) {
  const stats = useCountryStats();
  const total = stats.reduce((sum, item) => sum + Number(item.member_count || 0), 0);
  const maxCount = Math.max(...stats.map((item) => Number(item.member_count || 0)), 1);

  return <section className="section world-community" id="community">
    <div className="world-community-copy">
      <p className="kicker">{settings.communityEyebrow}</p>
      <h2>{settings.communityTitle}</h2>
      <p>{settings.communityText}</p>
      <div className="world-community-note"><span className="announcement-dot" /> <span>كل تسجيل جديد يضيف نقطة إلى شبكة التعلّم.</span></div>
    </div>
    <div className="world-country-dashboard">
      <div className="world-dashboard-head">
        <div><span className="world-overline">الخريطة الحية</span><h3>أين يبدأ أعضاؤنا؟</h3></div>
        <strong>{total} <small>عضو</small></strong>
      </div>
      <div className="world-dashboard-meta"><span>{stats.length ? `${stats.length} دول متصلة` : "بانتظار أول نقطة"}</span><span className="world-dashboard-line" /></div>
      <div className="world-dashboard-list">
        {stats.length ? stats.map((item, index) => {
          const count = Number(item.member_count || 0);
          const label = item.country_name || countryName(item.country_code);
          return <div className="world-dashboard-country" key={item.country_code}>
            <span className="world-dashboard-index">{String(index + 1).padStart(2, "0")}</span>
            <div className="world-dashboard-country-main"><div><b>{label}</b><small>{item.country_code}</small></div><em>{count} {count === 1 ? "عضو" : "أعضاء"}</em><div className="world-dashboard-bar"><i style={{ width: `${Math.max(10, (count / maxCount) * 100)}%` }} /></div></div>
          </div>;
        }) : <div className="world-dashboard-empty"><span className="article-placeholder" /><div><b>الخريطة تنتظر أول تسجيل</b><small>اختر دولتك عند إنشاء الحساب لتظهر هنا.</small></div></div>}
      </div>
    </div>
  </section>;
}
