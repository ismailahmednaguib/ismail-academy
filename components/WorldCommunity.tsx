"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
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

export function WorldMap({ compact, nodes, connections, showLabels = true }: { compact: boolean; nodes: PositionedCountry[]; connections: [PositionedCountry, PositionedCountry, number][]; showLabels?: boolean }) {
  const arrowId = `world-arrow-${compact ? "hero" : "community"}`;
  const [rotation, setRotation] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ active: false, startX: 0, startRotation: 0 });
  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    dragRef.current = { active: true, startX: event.clientX, startRotation: rotation };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  }
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.active) return;
    setRotation(dragRef.current.startRotation + (event.clientX - dragRef.current.startX) * 0.62);
  }
  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }
  return <div className={`world-globe-sphere${dragging ? " is-dragging" : ""}`} aria-label="خريطة عالمية تفاعلية لأعضاء الأكاديمية" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
    <div className="world-globe-surface" style={{ transform: `perspective(900px) rotateY(${rotation}deg)` }}>
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
    </div>
  </div>;
}

const countryCoordinates: Record<string, [number, number]> = {
  CA: [-106, 56], US: [-100, 39], MX: [-102, 23], GB: [-3, 55], FR: [2, 46], ES: [-4, 40], IT: [12, 42], DE: [10, 51], TR: [35, 39],
  MA: [-6, 32], DZ: [2, 28], TN: [9, 34], LY: [17, 27], EG: [31, 27], SD: [30, 13], NG: [8, 9], SA: [45, 24], AE: [54, 24], QA: [51, 25], KW: [47, 29], BH: [50, 26], OM: [57, 21],
  JO: [36, 31], PS: [35, 32], IQ: [44, 33], SY: [38, 35], YE: [48, 15], PK: [69, 30], IN: [79, 22], MY: [102, 4], ID: [117, -2],
};

const earthLand: [number, number][][] = [
  [[-168, 72], [-145, 70], [-130, 58], [-115, 52], [-105, 48], [-96, 30], [-82, 8], [-66, 10], [-53, 25], [-60, 45], [-78, 55], [-100, 65], [-130, 73]],
  [[-82, 12], [-72, 8], [-60, -8], [-52, -25], [-58, -45], [-70, -55], [-80, -34], [-78, -10]],
  [[-18, 36], [8, 37], [30, 43], [48, 52], [72, 58], [105, 68], [145, 62], [178, 52], [160, 38], [142, 28], [125, 20], [105, 7], [86, 9], [72, 22], [54, 27], [40, 15], [20, 22], [8, 35]],
  [[-18, 35], [8, 36], [30, 30], [42, 10], [35, -5], [26, -34], [12, -35], [2, -20], [-8, 4]],
  [[112, -10], [154, -12], [153, -30], [128, -27], [114, -22]],
  [[-52, 72], [-20, 82], [-12, 70], [-35, 60]],
];

function fallbackCoordinates(node: PositionedCountry): [number, number] {
  return [(node.point[0] / 100) * 360 - 180, 90 - (node.point[1] / 100) * 180];
}

function RealGlobeCanvas({ nodes, connections, showLabels }: { nodes: PositionedCountry[]; connections: [PositionedCountry, PositionedCountry, number][]; showLabels: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ active: false, startX: 0, startRotation: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * ratio);
      canvas.height = Math.floor(rect.height * ratio);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2 - 5;
      const rotationValue = ((rotation % 360) + 360) % 360;
      const project = (longitude: number, latitude: number): [number, number, number] | null => {
        const longitudeRadians = ((longitude - rotationValue) * Math.PI) / 180;
        const latitudeRadians = (latitude * Math.PI) / 180;
        const depth = Math.cos(latitudeRadians) * Math.cos(longitudeRadians);
        if (depth < -0.03) return null;
        return [centerX + radius * Math.cos(latitudeRadians) * Math.sin(longitudeRadians), centerY - radius * Math.sin(latitudeRadians), depth];
      };
      const drawProjectedPath = (points: [number, number][], close: boolean) => {
        let open = false;
        points.forEach(([longitude, latitude]) => {
          const projected = project(longitude, latitude);
          if (!projected) { open = false; return; }
          if (!open) { ctx.moveTo(projected[0], projected[1]); open = true; } else ctx.lineTo(projected[0], projected[1]);
        });
        if (close && open) ctx.closePath();
      };

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();
      const ocean = ctx.createRadialGradient(centerX - radius * .34, centerY - radius * .4, radius * .05, centerX + radius * .38, centerY + radius * .45, radius * 1.08);
      ocean.addColorStop(0, "#4b9d8a"); ocean.addColorStop(.35, "#17645d"); ocean.addColorStop(.78, "#0b3840"); ocean.addColorStop(1, "#041e2b");
      ctx.fillStyle = ocean; ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

      ctx.lineWidth = .55; ctx.strokeStyle = "rgba(186,235,218,.22)";
      for (let latitude = -60; latitude <= 60; latitude += 30) { ctx.beginPath(); drawProjectedPath(Array.from({ length: 73 }, (_, index) => [-180 + index * 5, latitude] as [number, number]), false); ctx.stroke(); }
      for (let longitude = -150; longitude <= 180; longitude += 30) { ctx.beginPath(); drawProjectedPath(Array.from({ length: 37 }, (_, index) => [longitude, -90 + index * 5] as [number, number]), false); ctx.stroke(); }

      const land = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
      land.addColorStop(0, "#dceeb5"); land.addColorStop(.45, "#8bbf83"); land.addColorStop(1, "#3b786d");
      earthLand.forEach((polygon) => { ctx.beginPath(); drawProjectedPath(polygon, true); ctx.fillStyle = land; ctx.fill(); ctx.strokeStyle = "rgba(226,244,199,.68)"; ctx.lineWidth = .8; ctx.stroke(); });

      ctx.strokeStyle = "rgba(238,255,220,.22)"; ctx.lineWidth = .55;
      for (let latitude = -30; latitude <= 45; latitude += 15) { ctx.beginPath(); drawProjectedPath(Array.from({ length: 73 }, (_, index) => [-180 + index * 5, latitude] as [number, number]), false); ctx.stroke(); }

      const nodePoints = new Map<string, [number, number, number]>();
      nodes.forEach((node) => {
        const [longitude, latitude] = countryCoordinates[node.country_code] ?? fallbackCoordinates(node);
        const projected = project(longitude, latitude);
        if (projected) nodePoints.set(node.country_code, projected);
      });
      connections.forEach(([from, to]) => { const start = nodePoints.get(from.country_code); const end = nodePoints.get(to.country_code); if (!start || !end) return; ctx.beginPath(); ctx.moveTo(start[0], start[1]); ctx.quadraticCurveTo((start[0] + end[0]) / 2, Math.min(start[1], end[1]) - radius * .12, end[0], end[1]); ctx.strokeStyle = "rgba(248,216,143,.75)"; ctx.lineWidth = 1.1; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]); });
      nodePoints.forEach(([x, y], code) => { const node = nodes.find((item) => item.country_code === code); if (!node) return; ctx.beginPath(); ctx.arc(x, y, 4.5, 0, Math.PI * 2); ctx.fillStyle = "#ffe19d"; ctx.shadowColor = "rgba(255,215,119,.95)"; ctx.shadowBlur = 13; ctx.fill(); ctx.shadowBlur = 0; if (showLabels) { const text = node.label; ctx.font = "700 11px Cairo, sans-serif"; const textWidth = ctx.measureText(text).width; const labelX = x + (x > centerX ? -textWidth - 15 : 15); const labelY = y + 4; ctx.fillStyle = "rgba(2,25,30,.88)"; ctx.fillRect(labelX - 6, labelY - 12, textWidth + 12, 18); ctx.fillStyle = "#fff0c2"; ctx.textAlign = x > centerX ? "right" : "left"; ctx.fillText(text, labelX, labelY + 1); } });
      ctx.restore();
      const atmosphere = ctx.createRadialGradient(centerX - radius * .45, centerY - radius * .5, radius * .2, centerX, centerY, radius * 1.04);
      atmosphere.addColorStop(0, "rgba(255,255,255,.12)"); atmosphere.addColorStop(.78, "rgba(120,226,207,.08)"); atmosphere.addColorStop(1, "rgba(104,219,200,.38)");
      ctx.beginPath(); ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); ctx.strokeStyle = atmosphere; ctx.lineWidth = 6; ctx.stroke();
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [connections, nodes, rotation, showLabels]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) { dragRef.current = { active: true, startX: event.clientX, startRotation: rotation }; event.currentTarget.setPointerCapture(event.pointerId); setDragging(true); }
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) { if (dragRef.current.active) setRotation(dragRef.current.startRotation + (event.clientX - dragRef.current.startX) * .62); }
  function handlePointerUp(event: PointerEvent<HTMLDivElement>) { if (!dragRef.current.active) return; dragRef.current.active = false; setDragging(false); if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }

  return <div className={`world-globe-sphere real-globe${dragging ? " is-dragging" : ""}`} aria-label="كرة أرضية تفاعلية لأعضاء الأكاديمية" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}><canvas ref={canvasRef} className="real-globe-canvas" /></div>;
}

export function WorldGlobe({ compact = false, labels, visualOnly = false, showCountryLabels = true }: { compact?: boolean; labels?: GlobeLabels; visualOnly?: boolean; showCountryLabels?: boolean }) {
  const stats = useCountryStats();
  const nodes = useMemo(() => stats.map((item, index) => ({ ...item, label: item.country_name || countryName(item.country_code), point: positionFor(item.country_code, index) })), [stats]);
  const connections = useMemo(() => nodes.flatMap((node, index) => {
    const next = nodes[index + 1];
    const skip = nodes[index + 2];
    return [next ? [node, next, index] as const : null, skip && index % 2 === 0 ? [node, skip, index + 30] as const : null].filter(Boolean) as [PositionedCountry, PositionedCountry, number][];
  }), [nodes]);
  const featured = stats.slice(0, compact ? 6 : 12);

  return <div className={`world-globe-card${compact ? " compact" : ""}${visualOnly ? " visual-only" : ""}`}>
    <div className="world-globe-visual"><RealGlobeCanvas nodes={nodes} connections={connections} showLabels={showCountryLabels} /><div className="world-orbit orbit-one" /><div className="world-orbit orbit-two" /></div>
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
