"use client";

import { useEffect, useMemo, useState } from "react";
import type { Settings } from "@/lib/content";
import { countryName } from "@/lib/countries";
import { supabase } from "@/lib/supabase";

type CountryStat = { country_code: string; country_name: string; member_count: number };
type PositionedCountry = CountryStat & { point: [number, number]; label: string };
type GlobeLabels = { eyebrow?: string; title?: string; text?: string };

// إحداثيات تقريبية داخل إسقاط الخريطة حتى تظهر نقاط الأعضاء فوق بلدهم بدل ترتيب عشوائي.
const positions: Record<string, [number, number]> = {
  CA: [23, 24], US: [22, 39], MX: [25, 48],
  GB: [48, 27], FR: [49, 34], ES: [44, 38], IT: [55, 39], DE: [54, 31], TR: [61, 37],
  MA: [42, 49], DZ: [39, 54], TN: [45, 46], LY: [50, 53], EG: [61, 53], SD: [57, 65], NG: [49, 69],
  SA: [67, 59], AE: [72, 57], QA: [70, 54], KW: [68, 50], BH: [70, 51], OM: [74, 61],
  JO: [64, 48], PS: [62, 47], IQ: [67, 45], SY: [64, 41], YE: [68, 68],
  PK: [76, 49], IN: [79, 56], MY: [82, 72], ID: [87, 76],
};

function positionFor(code: string, index: number): [number, number] {
  if (positions[code]) return positions[code];
  return [28 + ((index * 17) % 58), 27 + ((index * 23) % 48)];
}

function countryFlag(code: string) {
  const normalized = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) return "◎";
  return String.fromCodePoint(...normalized.split("").map((letter) => 127397 + letter.charCodeAt(0)));
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

function WorldMap({ compact, nodes, connections, showLabels = true }: { compact: boolean; nodes: PositionedCountry[]; connections: [PositionedCountry, PositionedCountry, number][]; showLabels?: boolean }) {
  const arrowId = `world-arrow-${compact ? "hero" : "community"}`;
  return <div className="world-globe-sphere" aria-label="خريطة عالمية تفاعلية لأعضاء الأكاديمية">
    <span className="world-latitude latitude-one" /><span className="world-latitude latitude-two" />
    <span className="world-meridian meridian-one" /><span className="world-meridian meridian-two" />
    <svg className="world-land" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id={`land-${compact ? "hero" : "community"}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d6edbd" /><stop offset="0.55" stopColor="#8fbd86" /><stop offset="1" stopColor="#477f70" />
        </linearGradient>
      </defs>
      <ellipse className="world-ocean-shine" cx="34" cy="23" rx="22" ry="11" />
      <g className="world-continents" fill={`url(#land-${compact ? "hero" : "community"})`}>
        <path className="continent" d="M7 27C11 21 17 17 24 15l9 2 4 5-6 5-5 1-4 8-7 2-7-5z" />
        <path className="continent" d="M35 9l7-2 7 4-2 6-6 4-6-5z" />
        <path className="continent" d="M30 46c5-5 10-2 12 5l-3 10-5 12-6 7-5-8 2-11 3-7z" />
        <path className="continent" d="M46 26l6-4 7 2 3 5-5 5-8 1-5-4z" />
        <path className="continent" d="M57 26c8-5 19-4 29 1l8 8-3 9-10 1-8 7-8-4-4-8-7-5z" />
        <path className="continent" d="M48 39c5-4 12-2 15 5l-2 11-5 13-6 5-6-8-1-11 3-7z" />
        <path className="continent" d="M77 67c6-3 13 0 17 5l-4 8-9-1-7-6z" />
        <path className="continent" d="M67 55l4 1-1 4-4-1zM42 36l3-3 3 3-2 3zM89 52l2 2-2 3-2-2z" />
      </g>
      <path className="world-land-highlight" d="M10 27C18 18 29 16 39 19M51 29c12-6 27-2 37 6M51 42c3 10 1 18-4 26" />
      <g className="world-boundaries" aria-hidden="true">
        <path d="M17 20l3 11-4 7M25 17l2 10-5 9M31 19l-4 10 7 4M12 29l12 1M19 37l12 1" />
        <path d="M49 27l5 7-4 8M57 25l1 9 8 5M67 26l-1 12 9 5M77 29l-2 13 10 2M86 34l-7 10 5 9" />
        <path d="M51 43l8 3-4 9M62 42l-4 12 7 8M50 58l8 2-5 10M56 69l7-7" />
        <path d="M34 48l-2 8 6 5M31 60l6 4-4 9" />
      </g>
      <g className="world-terrain" aria-hidden="true">
        <path d="M10 24c6-3 11-3 17 0s10 2 15-1M12 28c5-2 10-1 15 2s9 2 14-1M14 32c4-1 8 1 12 3s8 1 11-1" />
        <path d="M50 29c5-3 10-2 14 1s9 2 14-1 9-2 14 2M51 33c6-2 10 1 15 3s8 0 13-2 8-1 12 2M50 37c5-1 9 2 13 4s9 1 14-1 8 0 12 2" />
        <path d="M50 45c4-2 8 0 11 3s5 7 4 11M53 43c3 2 5 5 5 9s-2 8-4 12M55 57c2 3 3 6 1 10" />
        <path d="M32 52c3 1 5 4 5 7s-2 6-4 9M35 50c3 2 6 5 6 8s-2 7-4 10" />
      </g>
    </svg>
    <svg className="world-connections" viewBox="0 0 100 100" aria-hidden="true">
      <defs><marker id={arrowId} markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0 0L5 2.5L0 5z" /></marker></defs>
      {connections.map(([from, to, index]) => {
        const bend = ((from.point[0] + to.point[0]) / 2) + (index % 3 === 0 ? 5 : -4);
        const bendY = ((from.point[1] + to.point[1]) / 2) - 5;
        return <path key={`${from.country_code}-${to.country_code}-${index}`} d={`M${from.point[0]} ${from.point[1]} Q${bend} ${bendY} ${to.point[0]} ${to.point[1]}`} markerEnd={`url(#${arrowId})`} style={{ animationDelay: `${index * 120}ms` }} />;
      })}
    </svg>
    {nodes.map((node) => <span className="world-node" key={node.country_code} style={{ left: `${node.point[0]}%`, top: `${node.point[1]}%` }} title={showLabels ? node.label : undefined}>
      <i />{showLabels && <span className="world-node-label">{node.label}</span>}
    </span>)}
  </div>;
}

export function WorldGlobe({ compact = false, labels, visualOnly = false }: { compact?: boolean; labels?: GlobeLabels; visualOnly?: boolean }) {
  const stats = useCountryStats();
  const nodes = useMemo(() => stats.map((item, index) => ({ ...item, label: item.country_name || countryName(item.country_code), point: positionFor(item.country_code, index) })), [stats]);
  const connections = useMemo(() => nodes.flatMap((node, index) => {
    const next = nodes[index + 1];
    const skip = nodes[index + 2];
    return [next ? [node, next, index] as const : null, skip && index % 2 === 0 ? [node, skip, index + 30] as const : null].filter(Boolean) as [PositionedCountry, PositionedCountry, number][];
  }), [nodes]);
  const featured = stats.slice(0, compact ? 6 : 12);

  return <div className={`world-globe-card${compact ? " compact" : ""}${visualOnly ? " visual-only" : ""}`}>
    <div className="world-globe-visual"><WorldMap compact={compact} nodes={nodes} connections={connections} showLabels={!visualOnly} /><div className="world-orbit orbit-one" /><div className="world-orbit orbit-two" /></div>
    {!visualOnly && <div className="world-globe-info"><p className="world-overline">{labels?.eyebrow ?? "شبكة معرفة حقيقية"}</p><h3>{labels?.title ?? (stats.length ? (compact ? "أسماء على الخريطة" : `${stats.length} دول حول العالم`) : "العالم يفتح بابه")}</h3><p>{labels?.text ?? (stats.length ? "تظهر هنا أسماء الدول المسجلة فقط، فوق مواقعها التقريبية على الكرة." : "اختر دولتك عند إنشاء الحساب لتظهر أول نقطة على الخريطة.")}</p><div className="world-country-list">{featured.length ? featured.map((item) => <div className="world-country" key={item.country_code}><span className="country-flag">{countryFlag(item.country_code)}</span><b>{item.country_name || countryName(item.country_code)}</b><small>{compact ? "على الخريطة" : `${item.member_count} عضو`}</small></div>) : <div className="world-country empty"><span>◎</span><b>كن أول عضو</b><small>من بلدك</small></div>}</div></div>}
  </div>;
}

export default function WorldCommunity({ settings }: { settings: Settings }) {
  const stats = useCountryStats();
  const total = stats.reduce((sum, item) => sum + Number(item.member_count || 0), 0);
  const maxCount = Math.max(...stats.map((item) => Number(item.member_count || 0)), 1);

  return <section className="section world-community" id="community">
    <div className="world-community-copy"><p className="kicker">{settings.communityEyebrow}</p><h2>{settings.communityTitle}</h2><p>{settings.communityText}</p><div className="world-community-note"><span className="announcement-dot" /> <span>كل تسجيل جديد يضيف بلدًا ووصلة جديدة إلى شبكة التعلّم.</span></div></div>
    <div className="world-country-dashboard"><div className="world-dashboard-head"><div><span className="world-overline">الخريطة الحية</span><h3>أسماء بلادنا</h3></div><strong>{total} <small>عضو</small></strong></div><div className="world-dashboard-meta"><span>{stats.length ? `${stats.length} دول متصلة` : "بانتظار أول نقطة"}</span><span className="world-dashboard-line" /></div><div className="world-dashboard-list">{stats.length ? stats.map((item) => { const count = Number(item.member_count || 0); const label = item.country_name || countryName(item.country_code); return <div className="world-dashboard-country" key={item.country_code}><span className="world-dashboard-flag">{countryFlag(item.country_code)}</span><div className="world-dashboard-country-main"><div><b>{label}</b></div><em>{count} عضو</em><div className="world-dashboard-bar"><i style={{ width: `${Math.max(10, (count / maxCount) * 100)}%` }} /></div></div></div>; }) : <div className="world-dashboard-empty"><span className="article-placeholder" /><div><b>الخريطة تنتظر أول تسجيل</b><small>اختر دولتك عند إنشاء الحساب لتظهر هنا.</small></div></div>}</div></div>
  </section>;
}
