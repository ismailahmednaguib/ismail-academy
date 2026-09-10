"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Settings } from "@/lib/content";
import OwnerNotifications from "@/components/OwnerNotifications";
import OwnerVisibilityPanel from "@/components/OwnerVisibilityPanel";
import OwnerBrandControl from "@/components/OwnerBrandControl";
import OwnerRolesPanel from "@/components/OwnerRolesPanel";

type SubmissionTab = "overview" | "visibility" | "identity" | "settings" | "courses" | "lessons" | "articles" | "books" | "submissions" | "backup";

type BackupPayload = {
  settings?: Partial<Settings>;
  courses?: unknown;
  lessons?: unknown;
  articles?: unknown;
  books?: unknown;
};

type Props = {
  settings: Settings;
  courses: string[][];
  lessons: string[][];
  articles: string[][];
  books: string[][];
  setSettings: (value: Settings) => void;
  setCourses: (value: string[][]) => void;
  setLessons: (value: string[][]) => void;
  setArticles: (value: string[][]) => void;
  setBooks: (value: string[][]) => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onSaveDraft: () => void | Promise<void>;
  onReset: () => void;
  onLogout: () => void;
  busy: boolean;
  setNotice: (value: string) => void;
};

const settingGroups: [keyof Settings, string, boolean][] = [
  ["mark", "رمز العلامة — حرف أو حرفان", false],
  ["brandImage", "رابط صورة الشعار", false],
  ["heroKicker", "العبارة الصغيرة فوق العنوان", false],
  ["heroVerse", "النص داخل التصميم الرئيسي", false],
  ["heroVerseSource", "مرجع النص داخل التصميم", false],
  ["inkColor", "اللون الأساسي", false],
  ["goldColor", "لون التمييز", false],
  ["goldSoftColor", "لون التمييز الفاتح", false],
  ["paperColor", "لون خلفية الموقع", false],
  ["creamColor", "لون الأقسام الهادئة", false],
  ["sageColor", "لون النشرة والبطاقات", false],
  ["colorMode", "الوضع الافتراضي للموقع", false],
  ["siteDensity", "كثافة وترفّق المساحات", false],
  ["cornerStyle", "شكل حواف البطاقات", false],
  ["showBackToTop", "إظهار زر الرجوع لأعلى", false],
  ["showReadingProgress", "إظهار تقدم القراءة داخل المحتوى", false],
  ["buttonStyle", "شكل الأزرار العامة", false],
  ["showMobileBar", "إظهار شريط التنقل في الهاتف", false],
  ["showAnnouncement", "إظهار شريط الإعلان", false],
  ["showIntro", "إظهار قسم التعريف", false],
  ["showCourses", "إظهار قسم الدورات", false],
  ["showLessons", "إظهار قسم الدروس", false],
  ["showMajlis", "إظهار قسم المجلس", false],
  ["showArticles", "إظهار قسم المقالات", false],
  ["showLibrary", "إظهار قسم المكتبة", false],
  ["showNewsletter", "إظهار النشرة البريدية", false],
  ["showCommunity", "إظهار خريطة مجتمع الدول", false],
  ["showHomeSignals", "إظهار شريط المؤشرات أسفل البحث", false],
  ["showHomeDirectory", "إظهار بوابة الأقسام الرئيسية", false],
  ["homeLeadKicker", "الشارة الصغيرة الجديدة في الهيرو", false],
  ["homeLeadTitle", "العنوان الرئيسي الجديد", false],
  ["homeLeadText", "وصف الهيرو الجديد", true],
  ["homeLeadPrimaryCta", "زر إنشاء الحساب في الهيرو", false],
  ["homeMapEyebrow", "العنوان الصغير بجانب الخريطة", false],
  ["homeMapTitle", "عنوان الخريطة في الهيرو", false],
  ["homeMapText", "وصف الخريطة في الهيرو", true],
  ["homeExploreEyebrow", "العنوان الصغير لبوابة البداية", false],
  ["homeExploreTitle", "عنوان بوابة البداية", false],
  ["homeExploreText", "وصف بوابة البداية", true],
  ["homeExploreCoursesText", "وصف خانة الدورات الجديدة", false],
  ["homeExploreLessonsText", "وصف خانة الدروس الجديدة", false],
  ["homeExploreArticlesText", "وصف خانة المقالات الجديدة", false],
  ["homeExploreLibraryText", "وصف خانة المكتبة الجديدة", false],
  ["navHome", "اسم زر الرئيسية", false],
  ["navCourses", "اسم زر الدورات", false],
  ["navLessons", "اسم زر الدروس", false],
  ["navMajlis", "اسم زر المجالس", false],
  ["navArticles", "اسم زر المقالات", false],
  ["navLibrary", "اسم زر المكتبة", false],
  ["announcementButton", "زر شريط الإعلان", false],
  ["heroPrimaryCta", "زر الهيرو الأساسي", false],
  ["heroSecondaryCta", "زر الهيرو الثاني", false],
  ["heroMetricLessonsLabel", "وصف عداد الدروس", false],
  ["heroMetricCoursesLabel", "وصف عداد الدورات", false],
  ["heroMetricFreeValue", "قيمة العداد الثالث", false],
  ["heroMetricFreeLabel", "وصف العداد الثالث", false],
  ["homeSignalsCoursesLabel", "اسم مؤشر المسارات", false],
  ["homeSignalsCoursesText", "وصف مؤشر المسارات", false],
  ["homeSignalsContentLabel", "اسم مؤشر الاستماع والقراءة", false],
  ["homeSignalsContentText", "وصف مؤشر الاستماع والقراءة", false],
  ["homeSignalsCommunityLabel", "اسم مؤشر المجتمع", false],
  ["homeSignalsCommunityText", "وصف مؤشر المجتمع", false],
  ["homeDirectoryEyebrow", "العنوان الصغير لبوابة الاستكشاف", false],
  ["homeDirectoryTitle", "عنوان بوابة الاستكشاف", false],
  ["homeDirectoryText", "وصف بوابة الاستكشاف", true],
  ["homeDirectoryCoursesText", "وصف خانة الدورات", false],
  ["homeDirectoryLessonsText", "وصف خانة الدروس", false],
  ["homeDirectoryArticlesText", "وصف خانة المقالات", false],
  ["homeDirectoryLibraryText", "وصف خانة المكتبة", false],
  ["floatingCardTitle", "عنوان البطاقة العائمة", false],
  ["floatingCardText", "نص البطاقة العائمة", false],
  ["floatingCardStatus", "حالة البطاقة العائمة", false],
  ["searchPlaceholder", "نص خانة البحث", false],
  ["coursesEyebrow", "العنوان الصغير لقسم الدورات", false],
  ["coursesTitle", "عنوان قسم الدورات", false],
  ["coursesLink", "رابط قسم الدورات", false],
  ["lessonsEyebrow", "العنوان الصغير لقسم الدروس", false],
  ["lessonsTitle", "عنوان قسم الدروس", false],
  ["lessonsLink", "رابط قسم الدروس", false],
  ["majlisEyebrow", "العنوان الصغير لقسم المجلس", false],
  ["majlisButton", "زر قسم المجلس", false],
  ["articlesEyebrow", "العنوان الصغير لقسم المقالات", false],
  ["articlesTitle", "عنوان قسم المقالات", false],
  ["articlesLink", "رابط قسم المقالات", false],
  ["libraryEyebrow", "العنوان الصغير لقسم المكتبة", false],
  ["libraryTitle", "عنوان قسم المكتبة", false],
  ["libraryText", "وصف قسم المكتبة", true],
  ["libraryButton", "زر قسم المكتبة", false],
  ["newsletterEyebrow", "العنوان الصغير للنشرة", false],
  ["newsletterInputPlaceholder", "نص خانة البريد", false],
  ["newsletterButton", "زر الاشتراك", false],
  ["communityEyebrow", "العنوان الصغير للمجتمع", false],
  ["communityTitle", "عنوان مجتمع الدول", false],
  ["communityText", "وصف مجتمع الدول", true],
  ["footerCopyright", "نص حقوق النشر", false],
  ["ownerPanelLabel", "اسم زر لوحة المالك", false],
  ["emailLabel", "اسم رابط البريد", false],
  ["telegramLabel", "اسم رابط تيليجرام", false],
  ["whatsappLabel", "اسم رابط واتساب", false],
  ["instagramLabel", "اسم رابط إنستجرام", false],
  ["youtubeLabel", "اسم رابط يوتيوب", false],
  ["searchNoResults", "رسالة عدم وجود نتائج", false],
  ["listenLabel", "رابط الاستماع", false],
  ["readArticleLabel", "رابط قراءة المقال", false],
  ["downloadSoonLabel", "رسالة الملف غير المضاف", false],
  ["name", "اسم الموقع", false],
  ["tagline", "الشعار المختصر", false],
  ["heroTitle", "عنوان الواجهة", false],
  ["heroText", "وصف الواجهة", true],
  ["announcement", "شريط الإعلان", true],
  ["email", "البريد الإلكتروني", false],
  ["telegram", "رابط تيليجرام أو اسم المستخدم", false],
  ["whatsapp", "رقم واتساب أو الرابط", false],
  ["instagram", "رابط إنستجرام", false],
  ["youtube", "رابط يوتيوب", false],
  ["showContactLinks", "إظهار روابط التواصل في الفوتر", false],
  ["introEyebrow", "العنوان الصغير لقسم التعريف", false],
  ["introTitle", "عنوان قسم التعريف", false],
  ["introText", "وصف قسم التعريف", true],
  ["newsletterTitle", "عنوان النشرة البريدية", false],
  ["newsletterText", "وصف النشرة البريدية", true],
  ["majlisTitle", "عنوان قسم المجالس", false],
  ["majlisText", "وصف قسم المجالس", true],
  ["majlisDate", "تاريخ المجلس — افصل الأجزاء بعلامة |", false],
  ["majlisTopic", "عنوان المجلس", false],
  ["majlisMeta", "تفاصيل المجلس", false],
  ["majlisQuote", "اقتباس المجلس", true],
];

const colorKeys = new Set<keyof Settings>(["inkColor", "goldColor", "goldSoftColor", "paperColor", "creamColor", "sageColor"]);
const toggleKeys = new Set<keyof Settings>(["showAnnouncement", "showIntro", "showCourses", "showLessons", "showMajlis", "showArticles", "showLibrary", "showNewsletter", "showCommunity", "showHomeSignals", "showHomeDirectory", "showHero", "showSearch", "showWorldGlobe", "showLearningShelf", "showFooter", "showBrandImage", "showBackToTop", "showReadingProgress", "showMobileBar", "showContactLinks"]);
const selectOptions: Partial<Record<keyof Settings, { value: string; label: string }[]>> = {
  siteDensity: [{ value: "airy", label: "واسع وهادئ" }, { value: "balanced", label: "متوازن" }, { value: "compact", label: "مضغوط وعملي" }],
  cornerStyle: [{ value: "soft", label: "ناعم" }, { value: "rounded", label: "مستدير" }, { value: "sharp", label: "حاد وأكاديمي" }],
  buttonStyle: [{ value: "classic", label: "كلاسيكي" }, { value: "pill", label: "بيضاوي" }, { value: "outline", label: "إطار خفيف" }],
  colorMode: [{ value: "light", label: "نهاري" }, { value: "dark", label: "ليلي" }],
};

const themePresets = [
  { label: "أكاديمي أخضر", inkColor: "#173a35", goldColor: "#b8893e", goldSoftColor: "#e4c888", paperColor: "#fbfaf5", creamColor: "#f3f0e6", sageColor: "#dce9df" },
  { label: "ليلي هادئ", inkColor: "#20283d", goldColor: "#a889d8", goldSoftColor: "#d9c7f2", paperColor: "#f8f7fb", creamColor: "#ecebf3", sageColor: "#e1e5f0" },
  { label: "ترابي دافئ", inkColor: "#4b3028", goldColor: "#b56e3c", goldSoftColor: "#edc28f", paperColor: "#fffaf3", creamColor: "#f5e9d8", sageColor: "#e9dfd0" },
] as const;

const homeSectionLabels: Record<string, string> = { intro: "التعريف", community: "مجتمع الدول", courses: "الدورات", lessons: "الدروس", majlis: "المجلس", articles: "المقالات", library: "المكتبة", newsletter: "النشرة البريدية" };
const fallbackHomeOrder = ["intro", "community", "newsletter"];

function normaliseHomeOrder(value: unknown): string[] {
  const source = Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  return [...source.filter((item, index) => fallbackHomeOrder.includes(item) && source.indexOf(item) === index), ...fallbackHomeOrder.filter((item) => !source.includes(item))];
}

function updateRow(setter: (value: string[][]) => void, rows: string[][], index: number, column: number, value: string) {
  setter(rows.map((row, rowIndex) => rowIndex === index ? row.map((cell, cellIndex) => cellIndex === column ? value : cell) : row));
}

function removeRow(setter: (value: string[][]) => void, rows: string[][], index: number) {
  setter(rows.filter((_, rowIndex) => rowIndex !== index));
}

function moveRow(setter: (value: string[][]) => void, rows: string[][], index: number, direction: -1 | 1) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= rows.length) return;
  const next = [...rows];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  setter(next);
}

function duplicateRow(setter: (value: string[][]) => void, rows: string[][], index: number) {
  setter([...rows.slice(0, index + 1), [...rows[index]], ...rows.slice(index + 1)]);
}

function normaliseRows(value: unknown): string[][] {
  if (!Array.isArray(value) || !value.every((row) => Array.isArray(row))) return [];
  return value.map((row) => (row as unknown[]).map((cell) => String(cell ?? "")));
}

function UploadButton({ label, accept, uploading, currentUrl, onChange }: { label: string; accept: string; uploading: boolean; currentUrl?: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void }) {
  return <div className="upload-control"><label className="upload-button"><input type="file" accept={accept} onChange={onChange} />{uploading ? "جارٍ الرفع..." : label}</label>{currentUrl ? <a className="upload-link" href={currentUrl} target="_blank" rel="noreferrer">فتح الملف الحالي ↗</a> : <span className="upload-empty">لم يتم رفع ملف بعد</span>}</div>;
}

export default function OwnerContentEditor({ settings, courses, lessons, articles, books, setSettings, setCourses, setLessons, setArticles, setBooks, onSave, onSaveDraft, onReset, onLogout, busy, setNotice }: Props) {
  const [tab, setTab] = useState<SubmissionTab>("overview");
  const [uploading, setUploading] = useState<string | null>(null);
  const [localDraftAvailable, setLocalDraftAvailable] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);
  const autosaveReady = useRef(false);
  const [subscribers, setSubscribers] = useState<{ id: number; email: string; created_at: string }[]>([]);
  const [interests, setInterests] = useState<{ id: number; name: string; contact: string; created_at: string }[]>([]);
  const localDraftKey = "ismail-academy-owner-draft-v1";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const timer = window.setTimeout(() => setLocalDraftAvailable(Boolean(window.localStorage.getItem(localDraftKey))), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!autosaveReady.current) {
      autosaveReady.current = true;
      return;
    }
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(localDraftKey, JSON.stringify({ version: 1, savedAt: new Date().toISOString(), settings, courses, lessons, articles, books }));
        setLocalDraftAvailable(true);
      } catch {
        // التخزين المحلي اختياري؛ لا نعطل لوحة المالك إذا امتلأت المساحة.
      }
    }, 700);
    return () => window.clearTimeout(timer);
  }, [settings, courses, lessons, articles, books]);

  function restoreLocalDraft() {
    try {
      const raw = window.localStorage.getItem(localDraftKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as BackupPayload;
      if (parsed.settings && typeof parsed.settings === "object") setSettings({ ...settings, ...parsed.settings });
      if (parsed.courses !== undefined) setCourses(normaliseRows(parsed.courses));
      if (parsed.lessons !== undefined) setLessons(normaliseRows(parsed.lessons));
      if (parsed.articles !== undefined) setArticles(normaliseRows(parsed.articles));
      if (parsed.books !== undefined) setBooks(normaliseRows(parsed.books));
      setNotice("تم استرجاع آخر مسودة محلية. راجع التغييرات ثم احفظها أو انشرها.");
    } catch {
      setNotice("تعذر قراءة المسودة المحلية.");
    }
  }

  async function loadSubmissions() {
    if (!supabase) return;
    const [{ data: subscriberRows }, { data: interestRows }] = await Promise.all([
      supabase.from("newsletter_subscribers").select("id,email,created_at").order("created_at", { ascending: false }).limit(100),
      supabase.from("majlis_interest").select("id,name,contact,created_at").order("created_at", { ascending: false }).limit(100),
    ]);
    setSubscribers((subscriberRows ?? []) as { id: number; email: string; created_at: string }[]);
    setInterests((interestRows ?? []) as { id: number; name: string; contact: string; created_at: string }[]);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadSubmissions(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function deleteSubmission(kind: "newsletter_subscribers" | "majlis_interest", id: number) {
    if (!supabase || !window.confirm("حذف هذا السجل؟")) return;
    const { error } = await supabase.from(kind).delete().eq("id", id);
    if (error) setNotice("تعذر حذف السجل. تأكد من سياسة الحذف للمالك.");
    else {
      if (kind === "newsletter_subscribers") setSubscribers((rows) => rows.filter((row) => row.id !== id));
      else setInterests((rows) => rows.filter((row) => row.id !== id));
    }
  }

  function updateSetting(key: keyof Settings, value: string) {
    setSettings({ ...settings, [key]: value });
  }

  function toggleSetting(key: keyof Settings) {
    setSettings({ ...settings, [key]: !Boolean(settings[key]) });
  }

  function applyTheme(theme: typeof themePresets[number]) {
    setSettings({ ...settings, ...theme });
    setNotice("تم تطبيق ثيم " + theme.label + " محليًا. اضغط حفظ ونشر لاعتماده.");
  }

  function moveHomeSection(index: number, direction: -1 | 1) {
    const order = normaliseHomeOrder(settings.homeSectionOrder);
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= order.length) return;
    [order[index], order[nextIndex]] = [order[nextIndex], order[index]];
    setSettings({ ...settings, homeSectionOrder: order });
  }

  const contentWarnings = [
    ...lessons.filter((row) => !row[2]?.trim() && !row[5]?.trim()).map((row) => `وسائط ناقصة: ${row[0] || "درس بلا عنوان"}`),
    ...books.filter((row) => !row[2]?.trim()).map((row) => `PDF ناقص: ${row[0] || "ملف بلا عنوان"}`),
    ...articles.filter((row) => !row[3]?.trim()).map((row) => `نص ناقص: ${row[0] || "مقال بلا عنوان"}`),
  ];

  async function uploadFile(kind: "lesson" | "video" | "book" | "article", index: number, file: File) {
    if (!supabase) {
      setNotice("إعدادات Supabase غير موجودة.");
      return;
    }
    const maxBytes = kind === "lesson" ? 50 * 1024 * 1024 : kind === "video" ? 200 * 1024 * 1024 : kind === "book" ? 20 * 1024 * 1024 : 5 * 1024 * 1024;
    const validType = kind === "lesson" ? file.type.startsWith("audio/") : kind === "video" ? file.type.startsWith("video/") : kind === "book" ? file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf") : file.type.startsWith("image/");
    if (!validType) {
      setNotice(kind === "lesson" ? "اختار ملفًا صوتيًا فقط." : kind === "video" ? "اختار ملف فيديو فقط." : kind === "book" ? "اختار ملف PDF فقط." : "اختار صورة فقط لغلاف المقال.");
      return;
    }
    if (file.size > maxBytes) {
      setNotice(kind === "lesson" ? "الحد الأقصى للصوت 50 ميجابايت." : kind === "video" ? "الحد الأقصى للفيديو 200 ميجابايت." : kind === "book" ? "الحد الأقصى لملف PDF هو 20 ميجابايت." : "الحد الأقصى لصورة المقال 5 ميجابايت.");
      return;
    }
    const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
    const path = `${kind}s/${crypto.randomUUID()}.${extension}`;
    const key = `${kind}-${index}`;
    setUploading(key);
    const { error } = await supabase.storage.from("academy-media").upload(path, file, { upsert: false, contentType: file.type || undefined, cacheControl: "3600" });
    if (error) {
      setUploading(null);
      setNotice("تعذر رفع الملف. تأكد من تشغيل سياسة academy_media.sql.");
      return;
    }
    const { data } = supabase.storage.from("academy-media").getPublicUrl(path);
    if (kind === "lesson") updateRow(setLessons, lessons, index, 2, data.publicUrl);
    else if (kind === "video") updateRow(setLessons, lessons, index, 5, data.publicUrl);
    else if (kind === "book") updateRow(setBooks, books, index, 2, data.publicUrl);
    else updateRow(setArticles, articles, index, 4, data.publicUrl);
    setUploading(null);
    setNotice("تم رفع الملف. اضغط حفظ ونشر لاعتماد الرابط.");
  }

  function exportBackup() {
    const backup = { version: 1, exportedAt: new Date().toISOString(), settings, courses, lessons, articles, books };
    const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `academy-content-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice("تم تنزيل نسخة احتياطية من المحتوى الحالي.");
  }

  async function importBackup(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as BackupPayload;
      if (!parsed || typeof parsed !== "object") throw new Error("invalid");
      if (parsed.settings && typeof parsed.settings === "object") setSettings({ ...settings, ...parsed.settings });
      if (parsed.courses !== undefined) setCourses(normaliseRows(parsed.courses));
      if (parsed.lessons !== undefined) setLessons(normaliseRows(parsed.lessons));
      if (parsed.articles !== undefined) setArticles(normaliseRows(parsed.articles));
      if (parsed.books !== undefined) setBooks(normaliseRows(parsed.books));
      setNotice("تم استيراد النسخة محليًا. راجعها ثم اضغط حفظ ونشر لاعتمادها.");
    } catch {
      setNotice("ملف النسخة الاحتياطية غير صالح أو لا يمكن قراءته.");
    }
  }

  const tabs: [SubmissionTab, string][] = [["overview", "نظرة عامة"], ["visibility", "التحكم والظهور"], ["identity", "هوية الموقع"], ["settings", "كل الكلمات والألوان"], ["courses", "الدورات"], ["lessons", "الدروس والصوتيات"], ["articles", "المقالات"], ["books", "الكتب والملفات"], ["submissions", "الإشعارات والأعضاء"], ["backup", "النسخ الاحتياطي"]];

  return <form onSubmit={onSave} className="owner-editor">
    <div className="owner-toolbar"><p className="admin-note">أنت داخل لوحة الإدارة. يتم حفظ نسخة محلية تلقائيًا أثناء التعديل؛ استخدم المسودة للمراجعة ثم انشر للزوار عند الجاهزية.</p><div className="owner-toolbar-actions">{localDraftAvailable && <button type="button" className="ghost small-owner-button" onClick={restoreLocalDraft}>استعادة المسودة المحلية</button>}<a className="ghost small-owner-button" href="/" target="_blank" rel="noreferrer">معاينة الموقع ↗</a><button type="button" className="text-button" onClick={onLogout}>تسجيل الخروج</button></div></div>
    <div className="owner-layout">
      <nav className="owner-tabs">{tabs.map(([value, label]) => <button type="button" key={value} className={tab === value ? "active" : ""} onClick={() => setTab(value)}>{label}</button>)}</nav>
      <div className="owner-panel">
        {tab === "overview" && <div className="owner-overview"><div className="owner-stat"><b>{courses.length}</b><span>دورات</span></div><div className="owner-stat"><b>{lessons.length}</b><span>دروس</span></div><div className="owner-stat"><b>{articles.length}</b><span>مقالات</span></div><div className="owner-stat"><b>{books.length}</b><span>ملفات</span></div><div className={`owner-health ${contentWarnings.length ? "has-warnings" : "is-ready"}`}><div><b>{contentWarnings.length ? `${contentWarnings.length} عناصر تحتاج مراجعة` : "المحتوى جاهز للنشر"}</b><p>{contentWarnings.length ? "راجع الملفات التالية قبل النشر النهائي:" : "لا توجد ملفات أساسية ناقصة في الدروس والكتب والمقالات."}</p></div>{contentWarnings.length > 0 && <ul>{contentWarnings.slice(0, 6).map((warning) => <li key={warning}>{warning}</li>)}</ul>}</div><div className="owner-help"><b>طريقة العمل</b><p>أضف العناصر من تبويبها، ارفع الصوت أو PDF من نفس البطاقة، ثم احفظ مرة واحدة. الروابط تُحفظ داخل المحتوى المنشور ولا تحتاج تعديل كود.</p></div></div>}

        {tab === "visibility" && <OwnerVisibilityPanel settings={settings} setSettings={setSettings} />}

        {tab === "identity" && <OwnerBrandControl settings={settings} setSettings={setSettings} setNotice={setNotice} />}

        {tab === "settings" && <section className="owner-section"><h3>كل الكلمات والألوان</h3><p className="admin-note">كل كلمة محفوظة في إعدادات الموقع والألوان وترتيب الصفحة الرئيسية قابلة للتعديل من هنا. عدّل أي نص ثم اضغط «حفظ ونشر للجميع» ليظهر التغيير للزوار بدون لمس الكود.</p><div className="owner-fields">{settingGroups.map(([key, label, multiline]) => { const options = selectOptions[key]; return <label key={key}>{label}{toggleKeys.has(key) ? <input className="owner-toggle" type="checkbox" checked={Boolean(settings[key])} onChange={() => toggleSetting(key)} /> : options ? <select value={String(settings[key])} onChange={(event) => updateSetting(key, event.target.value)}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select> : multiline ? <textarea value={String(settings[key])} onChange={(event) => updateSetting(key, event.target.value)} /> : <input type={colorKeys.has(key) ? "color" : "text"} value={String(settings[key])} onChange={(event) => updateSetting(key, event.target.value)} />}</label>; })}</div><div className="homepage-order"><b>ترتيب أقسام الصفحة الرئيسية</b><span className="admin-note">حرّك الأقسام لأعلى أو لأسفل، ثم اضغط «حفظ ونشر للجميع». القسم المخفي يظل محفوظًا ويعود عند تفعيله.</span><div>{normaliseHomeOrder(settings.homeSectionOrder).map((section, index) => <div className="homepage-order-row" key={section}><span>{String(index + 1).padStart(2, "0")}</span><b>{homeSectionLabels[section]}</b><button type="button" disabled={index === 0} onClick={() => moveHomeSection(index, -1)} aria-label={`تحريك ${homeSectionLabels[section]} لأعلى`}>↑</button><button type="button" disabled={index === normaliseHomeOrder(settings.homeSectionOrder).length - 1} onClick={() => moveHomeSection(index, 1)} aria-label={`تحريك ${homeSectionLabels[section]} لأسفل`}>↓</button></div>)}</div></div><div className="theme-presets"><b>ثيمات جاهزة</b><span className="admin-note">اختار شكلًا كبداية، ثم عدّل الألوان والمظهر يدويًا لو تحب.</span><div>{themePresets.map((theme) => <button type="button" className="theme-preset" key={theme.label} onClick={() => applyTheme(theme)}><i style={{ background: theme.inkColor }} /><i style={{ background: theme.goldColor }} /><span>{theme.label}</span></button>)}</div></div></section>}

        {tab === "courses" && <section className="owner-section"><div className="owner-section-head"><div><h3>الدورات</h3><p className="admin-note">العنوان | الوصف | عدد الدروس | المستوى | الرقم</p></div><button type="button" className="ghost small-owner-button" onClick={() => setCourses([...courses, ["دورة جديدة", "أضف وصف الدورة هنا.", "0 دروس", "مبتدئ", String(courses.length + 1).padStart(2, "0"), "true"]])}>+ إضافة دورة</button></div>{courses.map((row, index) => <div className="owner-card" key={`course-${index}`}><div className="owner-card-head"><b>{row[0] || "دورة بلا عنوان"}</b><div className="owner-card-controls"><button type="button" disabled={index === 0} onClick={() => moveRow(setCourses, courses, index, -1)} aria-label="تحريك لأعلى">↑</button><button type="button" disabled={index === courses.length - 1} onClick={() => moveRow(setCourses, courses, index, 1)} aria-label="تحريك لأسفل">↓</button><button type="button" onClick={() => duplicateRow(setCourses, courses, index)}>نسخ</button><button type="button" className="danger-link" onClick={() => removeRow(setCourses, courses, index)}>حذف</button></div></div><div className="owner-fields compact"><label>العنوان<input value={row[0] ?? ""} onChange={(event) => updateRow(setCourses, courses, index, 0, event.target.value)} /></label><label>الوصف<textarea value={row[1] ?? ""} onChange={(event) => updateRow(setCourses, courses, index, 1, event.target.value)} /></label><label>عدد الدروس<input value={row[2] ?? ""} onChange={(event) => updateRow(setCourses, courses, index, 2, event.target.value)} /></label><label>المستوى<input value={row[3] ?? ""} onChange={(event) => updateRow(setCourses, courses, index, 3, event.target.value)} /></label><label>الرقم<input value={row[4] ?? ""} onChange={(event) => updateRow(setCourses, courses, index, 4, event.target.value)} /></label><label className="owner-featured"><input type="checkbox" checked={row[5] !== "false"} onChange={(event) => updateRow(setCourses, courses, index, 5, event.target.checked ? "true" : "false")} /> يظهر في الرئيسية</label></div></div>)}</section>}

        {tab === "lessons" && <section className="owner-section"><div className="owner-section-head"><div><h3>الدروس والصوتيات والفيديو</h3><p className="admin-note">العنوان | التفاصيل والمدة | رابط الصوت | المسار المرتبط | رابط الفيديو</p></div><button type="button" className="ghost small-owner-button" onClick={() => setLessons([...lessons, ["درس جديد", "أضف تفاصيل الدرس", "", "", "true", ""]])}>+ إضافة درس</button></div>{lessons.map((row, index) => <div className="owner-card" key={`lesson-${index}`}><div className="owner-card-head"><b>{row[0] || "درس بلا عنوان"}</b><div className="owner-card-controls"><button type="button" disabled={index === 0} onClick={() => moveRow(setLessons, lessons, index, -1)} aria-label="تحريك لأعلى">↑</button><button type="button" disabled={index === lessons.length - 1} onClick={() => moveRow(setLessons, lessons, index, 1)} aria-label="تحريك لأسفل">↓</button><button type="button" onClick={() => duplicateRow(setLessons, lessons, index)}>نسخ</button><button type="button" className="danger-link" onClick={() => removeRow(setLessons, lessons, index)}>حذف</button></div></div><div className="owner-fields compact"><label>العنوان<input value={row[0] ?? ""} onChange={(event) => updateRow(setLessons, lessons, index, 0, event.target.value)} /></label><label>التفاصيل والمدة<input value={row[1] ?? ""} onChange={(event) => updateRow(setLessons, lessons, index, 1, event.target.value)} /></label><label className="wide-field">رابط الصوت<input value={row[2] ?? ""} placeholder="https://... أو ارفع ملفًا من الزر" onChange={(event) => updateRow(setLessons, lessons, index, 2, event.target.value)} /></label><label className="wide-field">رابط الفيديو<input value={row[5] ?? ""} placeholder="https://... أو ارفع فيديو من الزر" onChange={(event) => updateRow(setLessons, lessons, index, 5, event.target.value)} /></label><label className="wide-field">المسار المرتبط<input value={row[3] ?? ""} placeholder="اكتب اسم الدورة كما هو" onChange={(event) => updateRow(setLessons, lessons, index, 3, event.target.value)} /></label><label className="owner-featured"><input type="checkbox" checked={row[4] !== "false"} onChange={(event) => updateRow(setLessons, lessons, index, 4, event.target.checked ? "true" : "false")} /> يظهر في الرئيسية</label></div><div className="lesson-upload-pair"><UploadButton label="رفع ملف صوتي" accept="audio/*" uploading={uploading === `lesson-${index}`} currentUrl={row[2]} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadFile("lesson", index, file); event.currentTarget.value = ""; }} /><UploadButton label="رفع فيديو" accept="video/*" uploading={uploading === `video-${index}`} currentUrl={row[5]} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadFile("video", index, file); event.currentTarget.value = ""; }} /></div></div>)}</section>}

        {tab === "articles" && <section className="owner-section"><div className="owner-section-head"><div><h3>المقالات</h3><p className="admin-note">العنوان | التصنيف | زمن القراءة | نص المقال | صورة الغلاف الاختيارية</p></div><button type="button" className="ghost small-owner-button" onClick={() => setArticles([...articles, ["مقال جديد", "عام", "5 دقائق", "اكتب نص المقال هنا.", "", "true"]])}>+ إضافة مقال</button></div>{articles.map((row, index) => <div className="owner-card" key={`article-${index}`}><div className="owner-card-head"><b>{row[0] || "مقال بلا عنوان"}</b><div className="owner-card-controls"><button type="button" disabled={index === 0} onClick={() => moveRow(setArticles, articles, index, -1)} aria-label="تحريك لأعلى">↑</button><button type="button" disabled={index === articles.length - 1} onClick={() => moveRow(setArticles, articles, index, 1)} aria-label="تحريك لأسفل">↓</button><button type="button" onClick={() => duplicateRow(setArticles, articles, index)}>نسخ</button><button type="button" className="danger-link" onClick={() => removeRow(setArticles, articles, index)}>حذف</button></div></div><div className="owner-fields compact"><label>العنوان<input value={row[0] ?? ""} onChange={(event) => updateRow(setArticles, articles, index, 0, event.target.value)} /></label><label>التصنيف<input value={row[1] ?? ""} onChange={(event) => updateRow(setArticles, articles, index, 1, event.target.value)} /></label><label>زمن القراءة<input value={row[2] ?? ""} onChange={(event) => updateRow(setArticles, articles, index, 2, event.target.value)} /></label><label className="wide-field">نص المقال<textarea value={(row[3] ?? "").replaceAll("\\n", "\n")} onChange={(event) => updateRow(setArticles, articles, index, 3, event.target.value.replace(/\r?\n/g, "\\n"))} /></label><label className="wide-field">رابط صورة الغلاف<input value={row[4] ?? ""} placeholder="https://... أو ارفع صورة من الزر" onChange={(event) => updateRow(setArticles, articles, index, 4, event.target.value)} /></label><label className="owner-featured"><input type="checkbox" checked={row[5] !== "false"} onChange={(event) => updateRow(setArticles, articles, index, 5, event.target.checked ? "true" : "false")} /> يظهر في الرئيسية</label></div><UploadButton label="رفع صورة غلاف" accept="image/*" uploading={uploading === `article-${index}`} currentUrl={row[4]} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadFile("article", index, file); event.currentTarget.value = ""; }} /></div>)}</section>}

        {tab === "books" && <section className="owner-section"><div className="owner-section-head"><div><h3>الكتب والملفات</h3><p className="admin-note">اسم الملف | الوصف والحجم | رابط PDF</p></div><button type="button" className="ghost small-owner-button" onClick={() => setBooks([...books, ["ملف جديد", "PDF", "", "true"]])}>+ إضافة ملف</button></div>{books.map((row, index) => <div className="owner-card" key={`book-${index}`}><div className="owner-card-head"><b>{row[0] || "ملف بلا عنوان"}</b><div className="owner-card-controls"><button type="button" disabled={index === 0} onClick={() => moveRow(setBooks, books, index, -1)} aria-label="تحريك لأعلى">↑</button><button type="button" disabled={index === books.length - 1} onClick={() => moveRow(setBooks, books, index, 1)} aria-label="تحريك لأسفل">↓</button><button type="button" onClick={() => duplicateRow(setBooks, books, index)}>نسخ</button><button type="button" className="danger-link" onClick={() => removeRow(setBooks, books, index)}>حذف</button></div></div><div className="owner-fields compact"><label>اسم الملف<input value={row[0] ?? ""} onChange={(event) => updateRow(setBooks, books, index, 0, event.target.value)} /></label><label>الوصف والحجم<input value={row[1] ?? ""} onChange={(event) => updateRow(setBooks, books, index, 1, event.target.value)} /></label><label className="wide-field">رابط PDF<input value={row[2] ?? ""} placeholder="https://... أو ارفع ملفًا من الزر" onChange={(event) => updateRow(setBooks, books, index, 2, event.target.value)} /></label><label className="owner-featured"><input type="checkbox" checked={row[3] !== "false"} onChange={(event) => updateRow(setBooks, books, index, 3, event.target.checked ? "true" : "false")} /> يظهر في الرئيسية</label></div><UploadButton label="رفع ملف PDF" accept="application/pdf" uploading={uploading === `book-${index}`} currentUrl={row[2]} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadFile("book", index, file); event.currentTarget.value = ""; }} /></div>)}</section>}

        {tab === "submissions" && <OwnerNotifications />}
        {tab === "submissions" && <OwnerRolesPanel setNotice={setNotice} />}
        {tab === "submissions" && <section className="owner-section"><div className="owner-section-head"><div><h3>المشتركون وطلبات الاهتمام</h3><p className="admin-note">بيانات خاصة بالمالك فقط، ويتم تحميل آخر 100 سجل.</p></div><button type="button" className="ghost small-owner-button" onClick={() => void loadSubmissions()}>تحديث</button></div><div className="submission-grid"><div className="submission-box"><h4>النشرة البريدية ({subscribers.length})</h4>{subscribers.length ? subscribers.map((row) => <div className="submission-row" key={row.id}><span>{row.email}<small>{new Date(row.created_at).toLocaleDateString("ar-EG")}</small></span><button type="button" className="danger-link" onClick={() => void deleteSubmission("newsletter_subscribers", row.id)}>حذف</button></div>) : <p className="admin-note">لا توجد اشتراكات ظاهرة أو لم يتم تشغيل جدول النشرة بعد.</p>}</div><div className="submission-box"><h4>اهتمام بالمجلس ({interests.length})</h4>{interests.length ? interests.map((row) => <div className="submission-row" key={row.id}><span>{row.name}<small>{row.contact} · {new Date(row.created_at).toLocaleDateString("ar-EG")}</small></span><button type="button" className="danger-link" onClick={() => void deleteSubmission("majlis_interest", row.id)}>حذف</button></div>) : <p className="admin-note">لا توجد طلبات ظاهرة أو لم يتم تشغيل جدول المجلس بعد.</p>}</div></div></section>}
        {tab === "backup" && <section className="owner-section"><div className="owner-section-head"><div><h3>النسخ الاحتياطي</h3><p className="admin-note">احتفظ بنسخة من كل محتوى الموقع قبل أي تعديل كبير، واستوردها عند الحاجة.</p></div></div><div className="backup-actions"><button type="button" className="primary" onClick={exportBackup}>تنزيل نسخة احتياطية</button><button type="button" className="ghost" onClick={() => importInputRef.current?.click()}>استيراد نسخة JSON</button><input ref={importInputRef} type="file" accept="application/json,.json" hidden onChange={(event) => void importBackup(event)} /></div><p className="admin-note">الاستيراد يحمّل البيانات محليًا فقط. راجع المحتوى أولًا ثم اضغط «حفظ ونشر للجميع».</p></section>}
      </div>
    </div>
    <div className="owner-actions"><button type="button" className="ghost" onClick={onReset}>استعادة الافتراضي</button><button type="button" className="ghost" onClick={() => void onSaveDraft()}>حفظ مسودة على الحساب</button><button className="primary" disabled={busy}>{busy ? "جارٍ النشر..." : "حفظ ونشر للجميع"}</button></div>
  </form>;
}
