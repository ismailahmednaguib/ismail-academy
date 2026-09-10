"use client";

import type { Settings } from "@/lib/content";

type Props = { settings: Settings; setSettings: (value: Settings) => void };
type VisibilityKey = keyof Settings;

const options: [VisibilityKey, string, string][] = [
  ["showAnnouncement", "شريط الإعلان", "أعلى الموقع"],
  ["showHero", "الواجهة الرئيسية", "الهيرو"],
  ["showWorldGlobe", "الكرة الأرضية", "داخل الواجهة"],
  ["showSearch", "خانة البحث", "أسفل الواجهة"],
  ["showHomeSignals", "شريط المؤشرات", "أسفل البحث"],
  ["showHomeDirectory", "بوابة الأقسام", "روابط الدورات والدروس"],
  ["showSpotlight", "الاختيارات المميزة", "قسم Spotlight في الرئيسية"],
  ["showLearningShelf", "المحتوى المحفوظ", "للمستخدم المسجل"],
  ["showStudyMomentum", "زخم التعلم", "حساب الطالب"],
  ["showIntro", "قسم التعريف", "الرئيسية"],
  ["showCommunity", "مجتمع الدول", "الخريطة والقائمة"],
  ["showCourses", "الدورات", "في التنقل والمحتوى"],
  ["showLessons", "الدروس", "في التنقل والمحتوى"],
  ["showMajlis", "المجالس", "في التنقل والصفحة"],
  ["showArticles", "المقالات", "في التنقل والمحتوى"],
  ["showLibrary", "المكتبة", "في التنقل والمحتوى"],
  ["showNewsletter", "النشرة البريدية", "أسفل الرئيسية"],
  ["showContactLinks", "روابط التواصل", "الفوتر"],
  ["showFooter", "الفوتر", "أسفل كل الصفحات"],
  ["showBrandImage", "صورة الشعار", "بدل الحرف داخل الدائرة"],
  ["showMobileBar", "شريط الهاتف", "التنقل السريع"],
  ["showBackToTop", "زر أعلى الصفحة", "بعد التمرير"],
  ["showReadingProgress", "تقدم القراءة", "صفحات المحتوى"],
];

export default function OwnerVisibilityPanel({ settings, setSettings }: Props) {
  function toggle(key: VisibilityKey) {
    setSettings({ ...settings, [key]: !Boolean(settings[key]) });
  }

  return <section className="owner-visibility-card owner-control-page"><div className="owner-visibility-head"><div><p className="kicker">تحكم مباشر</p><h3>إظهار وإخفاء عناصر الموقع</h3><small>أزل علامة الصح من أي عنصر لإخفائه، ثم اضغط «حفظ ونشر للجميع».</small></div><span className="owner-control-badge">LIVE CONTROL</span></div><div className="owner-visibility-grid">{options.map(([key, label, hint]) => <label className={settings[key] ? "visibility-toggle is-on" : "visibility-toggle"} key={key}><input type="checkbox" checked={Boolean(settings[key])} onChange={() => toggle(key)} /><span className="visibility-switch" /><span><b>{label}</b><small>{hint}</small></span></label>)}</div></section>;
}
