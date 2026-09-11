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
  ["showNexusHeroTag", "وسم الواجهة", "Academy والوقت المتاح"],
  ["showNexusHeroProof", "شواهد الواجهة", "دروس مركزة ومجتمع وتعلم مستمر"],
  ["showNexusHeroPanel", "لوحة جلسة اليوم", "بطاقة التعلم داخل الواجهة"],
  ["showNexusPanelStats", "إحصائيات جلسة اليوم", "المسارات والمواد والتوفر"],
  ["showNexusAnnouncementAction", "زر الإعلان", "زر تفاصيل المجلس في الشريط العلوي"],
  ["showNexusRail", "شريط المؤشرات", "إحصائيات مختصرة أسفل الواجهة"],
  ["showNexusIntent", "اختيار هدف التعلم", "أبدأ من الصفر أو درس سريع أو قراءة"],
  ["showNexusAccount", "دخول وحساب الزائر", "أزرار تسجيل الدخول وإنشاء الحساب"],
  ["showNexusHeroSecondary", "الزر الثانوي في الواجهة", "استكشف المحتوى"],
  ["showNexusStart", "بوابات البداية", "اختيارات الدورات والدروس والمكتبة"],
  ["showNexusFeatured", "المحتوى المميز", "بطاقات مختارة بدون تكرار"],
  ["showNexusFeatureMeta", "تفاصيل المحتوى المميز", "نوع المسار والمستوى داخل البطاقة"],
  ["showNexusFlow", "طريقة استخدام الأكاديمية", "ثلاث خطوات مختصرة"],
  ["showNexusFlowSteps", "خطوات طريقة الاستخدام", "بطاقات اختر وتعمق واستمر"],
  ["showNexusDesk", "مكتب الطالب", "المحفوظات والإكمال من حيث توقفت"],
  ["showNexusDeskList", "قائمة مكتب الطالب", "المواد المحفوظة والمكتملة"],
  ["showNexusEvent", "بطاقة المجلس", "الدعوة والاقتباس في الرئيسية"],
  ["showNexusEventQuote", "اقتباس المجلس", "الاقتباس داخل بطاقة المجلس"],
  ["showNexusNewsletter", "النشرة الجديدة", "نموذج الاشتراك"],
  ["showNexusNewsletterForm", "نموذج النشرة", "حقل البريد وزر الاشتراك"],
  ["showNexusFooter", "فوتر النسخة الجديدة", "حقوق النشر وروابط التواصل"],
  ["showMobileBar", "شريط الهاتف", "التنقل السريع"],
  ["showBackToTop", "زر أعلى الصفحة", "بعد التمرير"],
  ["showReadingProgress", "تقدم القراءة", "صفحات المحتوى"],
];

export default function OwnerVisibilityPanel({ settings, setSettings }: Props) {
  function toggle(key: VisibilityKey) {
    setSettings({ ...settings, [key]: !Boolean(settings[key]) });
  }

  function setAll(value: boolean) {
    const next = { ...settings };
    options.forEach(([key]) => { next[key] = value as never; });
    setSettings(next);
  }

  function showPublicEssentials() {
    const next = { ...settings };
    options.forEach(([key]) => { next[key] = false as never; });
    ["showNexusHeader", "showNexusHero", "showNexusHeroPanel", "showNexusStart", "showNexusFeatured", "showNexusAccount", "showFooter", "showMobileBar"].forEach((key) => { next[key as VisibilityKey] = true as never; });
    setSettings(next);
  }

  return <section className="owner-visibility-card owner-control-page"><div className="owner-visibility-head"><div><p className="kicker">تحكم مباشر</p><h3>إظهار وإخفاء عناصر الموقع</h3><small>أزل علامة الصح من أي عنصر لإخفائه، ثم اضغط «حفظ ونشر للجميع».</small></div><span className="owner-control-badge">LIVE CONTROL</span></div><div className="owner-visibility-actions"><button type="button" className="ghost small-owner-button" onClick={() => setAll(true)}>إظهار الكل</button><button type="button" className="ghost small-owner-button" onClick={showPublicEssentials}>الواجهة الأساسية فقط</button><button type="button" className="text-button" onClick={() => setAll(false)}>إخفاء الكل</button></div><div className="owner-visibility-grid">{options.map(([key, label, hint]) => <label className={settings[key] ? "visibility-toggle is-on" : "visibility-toggle"} key={key}><input type="checkbox" checked={Boolean(settings[key])} onChange={() => toggle(key)} /><span className="visibility-switch" /><span><b>{label}</b><small>{hint}</small></span></label>)}</div></section>;
}
