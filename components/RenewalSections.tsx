"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Settings } from "@/lib/content";

function parseTripleList(raw: string): { name: string; text: string; role: string }[] {
  return raw
    .split("///")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((chunk) => {
      const parts = chunk.split("||").map((p) => p.trim());
      return { name: parts[0] || "طالب", text: parts[1] || "", role: parts[2] || "عضو" };
    })
    .filter((x) => x.text);
}

function parseFaq(raw: string): { q: string; a: string }[] {
  return raw
    .split("///")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((chunk) => {
      const parts = chunk.split("||").map((p) => p.trim());
      return { q: parts[0] || "", a: parts[1] || "" };
    })
    .filter((x) => x.q && x.a);
}

export function RenewalStats({ settings }: { settings: Settings }) {
  if (!settings.showStats) return null;
  const items = [
    { v: settings.statsOneValue, l: settings.statsOneLabel },
    { v: settings.statsTwoValue, l: settings.statsTwoLabel },
    { v: settings.statsThreeValue, l: settings.statsThreeLabel },
    { v: settings.statsFourValue, l: settings.statsFourLabel },
  ];
  return (
    <section className="renewal-stats" aria-label="إحصائيات الأكاديمية">
      <div className="renewal-stats-grid">
        {items.map((s, i) => (
          <div key={i} className="renewal-stat">
            <b>{s.v}</b>
            <span>{s.l}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function RenewalTestimonials({ settings }: { settings: Settings }) {
  if (!settings.showTestimonials) return null;
  const list = parseTripleList(settings.testimonialsData);
  if (!list.length) return null;
  return (
    <section className="renewal-section renewal-testimonials">
      <div className="renewal-head">
        <p className="nexus-eyebrow">{settings.communityEyebrow}</p>
        <h2>{settings.testimonialsTitle}</h2>
        <p>{settings.testimonialsText}</p>
      </div>
      <div className="renewal-cards">
        {list.map((t, i) => (
          <article key={i} className="renewal-card">
            <div className="renewal-stars" aria-hidden="true">★★★★★</div>
            <p>“{t.text}”</p>
            <footer>
              <b>{t.name}</b>
              <small>{t.role}</small>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RenewalFaq({ settings }: { settings: Settings }) {
  const [open, setOpen] = useState<number | null>(0);
  if (!settings.showFaqHome) return null;
  const list = parseFaq(settings.faqHomeData);
  if (!list.length) return null;
  return (
    <section className="renewal-section renewal-faq">
      <div className="renewal-head">
        <p className="nexus-eyebrow">أسئلة شائعة</p>
        <h2>{settings.faqHomeTitle}</h2>
        <p>{settings.faqHomeText}</p>
      </div>
      <div className="renewal-accordion">
        {list.map((f, i) => (
          <div key={i} className={open === i ? "renewal-acc open" : "renewal-acc"}>
            <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
              <span>{f.q}</span>
              <b>{open === i ? "−" : "+"}</b>
            </button>
            {open === i && <p>{f.a}</p>}
          </div>
        ))}
      </div>
      <div className="renewal-center">
        <Link href="/faq" className="nexus-text-link">كل الأسئلة الشائعة ←</Link>
      </div>
    </section>
  );
}

export function RenewalCta({ settings }: { settings: Settings }) {
  if (!settings.showCtaBanner) return null;
  return (
    <section className="renewal-cta">
      <div className="renewal-cta-inner">
        <div>
          <h2>{settings.ctaTitle}</h2>
          <p>{settings.ctaText}</p>
        </div>
        <div className="renewal-cta-actions">
          <Link href="/account" className="nexus-dark-button">{settings.ctaPrimary}</Link>
          <Link href="/courses" className="nexus-light-button">{settings.ctaSecondary}</Link>
        </div>
      </div>
    </section>
  );
}

export function RenewalPopup({ settings, onInterest }: { settings: Settings; onInterest?: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!settings.showPopup) return;
    const seen = sessionStorage.getItem("renewal-popup-seen");
    if (seen) return;
    const delay = Math.max(1, Math.min(60, Number(settings.popupDelay) || 8)) * 1000;
    const t = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(t);
  }, [settings.showPopup, settings.popupDelay]);
  if (!settings.showPopup || !visible) return null;
  return (
    <div className="renewal-popup-wrap" role="dialog" aria-modal="true">
      <div className="renewal-popup">
        <button type="button" aria-label="إغلاق" className="renewal-popup-x" onClick={() => { setVisible(false); sessionStorage.setItem("renewal-popup-seen", "1"); }}>×</button>
        <p className="nexus-eyebrow">تنبيه سريع</p>
        <h3>{settings.popupTitle}</h3>
        <p>{settings.popupText}</p>
        <button type="button" className="nexus-dark-button" onClick={() => { setVisible(false); sessionStorage.setItem("renewal-popup-seen", "1"); onInterest?.(); }}>{settings.popupCta}</button>
      </div>
    </div>
  );
}

export function RenewalMaintenance({ settings }: { settings: Settings }) {
  if (!settings.enableMaintenance) return null;
  return (
    <div className="renewal-maintenance">
      <div className="renewal-maintenance-card">
        <span className="renewal-maintenance-icon">🛠</span>
        <h2>{settings.maintenanceTitle}</h2>
        <p>{settings.maintenanceText}</p>
        <small>{settings.name} · {settings.tagline}</small>
      </div>
    </div>
  );
}

export function RenewalGlobalStyle({ settings }: { settings: Settings }) {
  const fonts: Record<string, string> = {
    cairo: "'Cairo', 'Segoe UI', Tahoma, sans-serif",
    tajawal: "'Tajawal', 'Segoe UI', Tahoma, sans-serif",
    ibm: "'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif",
    amiri: "'Amiri', 'Traditional Arabic', serif",
    system: "system-ui, 'Segoe UI', Tahoma, sans-serif",
  };
  const font = fonts[settings.fontChoice] || fonts.cairo;
  const css = `
    :root { --renewal-font: ${font}; }
    body, .nexus-site { font-family: var(--renewal-font); }
    ${settings.customCss || ""}
  `;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

export default function RenewalHomeBlocks({ settings }: { settings: Settings }) {
  return (
    <>
      <RenewalStats settings={settings} />
      <RenewalTestimonials settings={settings} />
      <RenewalFaq settings={settings} />
      <RenewalCta settings={settings} />
    </>
  );
}