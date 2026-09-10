"use client";

import type { CSSProperties } from "react";
import type { Settings } from "@/lib/content";

export default function OwnerLivePreview({ settings, counts }: { settings: Settings; counts: { courses: number; lessons: number; articles: number; books: number } }) {
  const previewStyle = { "--preview-ink": settings.inkColor, "--preview-gold": settings.goldColor, "--preview-paper": settings.paperColor, "--preview-cream": settings.creamColor } as CSSProperties;
  return <section className="owner-live-preview" style={previewStyle}><div className="preview-browser-bar"><span /><span /><span /><small>معاينة غير منشورة · تظهر لك فقط</small></div><div className="preview-nav"><b>{settings.showBrandImage && settings.brandImage ? "▣" : settings.mark}</b><strong>{settings.name}</strong><i>{settings.navCourses}　 {settings.navLessons}　 {settings.navArticles}</i></div><div className="preview-hero"><small>{settings.homeLeadKicker}</small><h3>{settings.homeLeadTitle}</h3><p>{settings.homeLeadText}</p><button>{settings.homeLeadPrimaryCta}</button><div className="preview-orbit" /></div><div className="preview-cards">{[[counts.courses, settings.navCourses], [counts.lessons, settings.navLessons], [counts.articles, settings.navArticles], [counts.books, settings.navLibrary]].map(([value, label]) => <div key={String(label)}><b>{value}</b><span>{label}</span></div>)}</div><p className="preview-note">هذه معاينة لحظية من الإعدادات الحالية. لا يراها الزوار إلا بعد «حفظ ونشر للجميع».</p></section>;
}

