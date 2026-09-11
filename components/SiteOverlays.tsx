"use client";

import { useEffect, useState } from "react";
import type { Settings } from "@/lib/content";

export function SitePopup({ settings, onInterest }: { settings: Settings; onInterest?: () => void }) {
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

export function SiteMaintenance({ settings }: { settings: Settings }) {
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

export function SiteGlobalStyle({ settings }: { settings: Settings }) {
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
