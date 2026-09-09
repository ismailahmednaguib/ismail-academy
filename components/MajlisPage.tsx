"use client";

import { useState } from "react";
import type { Settings } from "@/lib/content";
import MajlisInterestModal from "@/components/MajlisInterestModal";

export default function MajlisPage({ settings }: { settings: Settings }) {
  const [interestOpen, setInterestOpen] = useState(false);
  return <main className="section majlis-page">
    <div className="majlis-page-header"><div><p className="kicker">{settings.majlisEyebrow}</p><h1 className="page-title">{settings.majlisTitle}</h1><p>{settings.majlisText}</p></div><span className="majlis-page-mark">م</span></div>
    <div className="majlis-page-grid"><section className="majlis-event-card"><span className="event-date">{settings.majlisDate.split("|").map((item, index) => <span key={index}>{index === 1 ? <b>{item.trim()}</b> : item.trim()}<br /></span>)}</span><div><p className="kicker">المجلس القادم</p><h2>{settings.majlisTopic}</h2><p>{settings.majlisMeta}</p><button className="primary" onClick={() => setInterestOpen(true)}>{settings.majlisButton} <b>←</b></button></div></section><aside className="majlis-page-quote"><span>“</span><p>{settings.majlisQuote}</p><small>مساحة للحضور والاستماع والسؤال</small></aside></div>
    <MajlisInterestModal open={interestOpen} onClose={() => setInterestOpen(false)} majlisTopic={settings.majlisTopic} />
  </main>;
}
