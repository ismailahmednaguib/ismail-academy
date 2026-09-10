"use client";

import type { Settings } from "@/lib/content";

type Props = { settings: Settings; setSettings: (value: Settings) => void };
type VisibilityKey = keyof Settings;

const options: [VisibilityKey, string, string][] = [
  ["showAnnouncement", "شريط الإعلان", "أعلى الموقع"],
  ["showSearch", "خانة البحث", "أسفل الواجهة"],
  ["showLearningShelf", "المحتوى المحفوظ", "للمستخدم المسجل"],
  ["showStudyMomentum", "زخم التعلم", "حساب الطالب"],
  ["showCourses", "الدورات", "في التنقل والمحتوى"],
  ["showLessons", "الدروس", "في التنقل والمحتوى"],
  ["showMajlis", "المجالس", "في التنقل والصفحة"],
  ["showArticles", "المقالات", "في التنقل والمحتوى"],
  ["showLibrary", "المكتبة", "في التنقل والمحتوى"],
  ["showNewsletter", "النشرة البريدية", "أسفل الرئيسية"],
  ["showContactLinks", "روابط التواصل", "الفوتر"],
  ["showFooter", "الفوتر", "أسفل كل الصفحات"],
  ["showBrandImage", "صورة الشعار", "بدل الحرف داخل الدائرة"],
  ["showNexusHeader", "رأس الموقع الجديد", "الشعار والتنقل والحساب"],
  ["showNexusSearch", "البحث السريع", "الزر ونافذة البحث"],
  ["showNexusLanguage", "مبدّل اللغة", "داخل رأس الموقع"],
  ["showNexusTheme", "مبدّل الوضع الليلي", "داخل رأس الموقع"],
  ["showNexusHero", "الواجهة الرئيسية", "العنوان والدعوة الأولى"],
  ["showNexusHeroPanel", "لوحة جلسة اليوم", "بطاقة التعلم داخل الواجهة"],
  ["showNexusRail", "شريط المؤشرات", "إحصائيات مختصرة أسفل الواجهة"],
  ["showNexusAccount", "دخول وحساب الزائر", "أزرار تسجيل الدخول وإنشاء الحساب"],
  ["showNexusHeroSecondary", "الزر الثانوي في الواجهة", "استكشف المحتوى"],
  ["showNexusStart", "بوابات البداية", "اختيارات الدورات والدروس والمكتبة"],
  ["showNexusFeatured", "المحتوى المميز", "بطاقات مختارة بدون تكرار"],
  ["showNexusFlow", "طريقة استخدام الأكاديمية", "ثلاث خطوات مختصرة"],
  ["showNexusDesk", "مكتب الطالب", "المحفوظات والإكمال من حيث توقفت"],
  ["showNexusEvent", "بطاقة المجلس", "الدعوة والاقتباس في الرئيسية"],
  ["showNexusNewsletter", "النشرة الجديدة", "نموذج الاشتراك"],
  ["showNexusFooter", "فوتر النسخة الجديدة", "حقوق النشر وروابط التواصل"],
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
