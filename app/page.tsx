"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { defaultSettings as defaults, initialArticles, initialBooks, initialCourses, initialLessons, slugify, type AcademyContent } from "@/lib/content";
import MajlisInterestModal from "@/components/MajlisInterestModal";
import OwnerContentEditor from "@/components/OwnerContentEditor";
import NexusHomepage from "@/components/NexusHomepage";

type AuthSessionLike = { user: { id: string } } | null;

async function getAdminAccess(session: AuthSessionLike) {
  if (!supabase || !session) return { allowed: false, role: "" };
  const { data: owner } = await supabase.rpc("is_site_owner");
  if (owner === true) return { allowed: true, role: "owner" };
  const { data: admin } = await supabase.rpc("is_site_admin");
  if (admin !== true) return { allowed: false, role: "" };
  const { data: role } = await supabase.rpc("site_admin_role");
  return { allowed: true, role: typeof role === "string" ? role : "editor" };
}

export default function Home() {
  const [settings, setSettings] = useState(defaults);
  const [courses, setCourses] = useState<string[][]>(initialCourses);
  const [articles, setArticles] = useState<string[][]>(initialArticles);
  const [books, setBooks] = useState<string[][]>(initialBooks);
  const [lessons, setLessons] = useState<string[][]>(initialLessons);
  const [admin, setAdmin] = useState(false);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [ownerSession, setOwnerSession] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [interestOpen, setInterestOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newsletterSending, setNewsletterSending] = useState(false);

  async function loadPublishedContent() {
    if (!supabase) return;
    const { data, error } = await supabase.from("site_content").select("payload").eq("id", "main").single();
    if (error) {
      setNotice("تعذر تحميل المحتوى المنشور حاليًا.");
      return;
    }
    const payload = data?.payload as Partial<AcademyContent> | undefined;
    if (!payload) return;
    if (payload.settings) {
      const publishedSettings = { ...defaults, ...payload.settings };
      if (publishedSettings.email === "hello@example.com") publishedSettings.email = "";
      if (publishedSettings.telegram.includes("your_username")) publishedSettings.telegram = "";
      if (!Object.prototype.hasOwnProperty.call(payload.settings, "homeLeadTitle")) publishedSettings.showHomeSignals = false;
      if (publishedSettings.homeLeadPrimaryCta === "أنشئ حسابك الآن" || publishedSettings.homeLeadPrimaryCta === "ابدأ رحلتك") publishedSettings.homeLeadPrimaryCta = "سجل الآن";
      if (publishedSettings.homeLeadSecondaryCta === "شاهد المجالس") publishedSettings.homeLeadSecondaryCta = "";
      setSettings(publishedSettings);
    }
    if (payload.courses) setCourses(payload.courses);
    if (payload.articles) setArticles(payload.articles);
    if (payload.books) setBooks(payload.books);
    if (payload.lessons) setLessons(payload.lessons);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadPublishedContent(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    const syncOwnerAccess = async () => {
      const { data: { session } } = await client.auth.getSession();
      const access = await getAdminAccess(session);
      setOwnerSession(access.allowed);
    };
    const listener = () => { void syncOwnerAccess(); };
    window.addEventListener("academy-auth-change", listener);
    void syncOwnerAccess();
    return () => window.removeEventListener("academy-auth-change", listener);
  }, []);

  async function openAdmin() {
    if (!supabase) {
      setNotice("أضف إعدادات Supabase في ملف .env.local أولًا.");
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    const access = await getAdminAccess(session);
    setOwnerSession(access.allowed);
    if (session && !access.allowed) setNotice("هذا الحساب عضو عادي. استخدم حساب المالك أو حساب مشرف مفعّل لفتح لوحة الإدارة.");
    setAdmin(true);
  }

  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("admin") === "1") {
      const timer = window.setTimeout(() => { void openAdmin(); }, 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!admin) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAdmin(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [admin]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--ink", settings.inkColor);
    root.style.setProperty("--gold", settings.goldColor);
    root.style.setProperty("--gold2", settings.goldSoftColor);
    root.style.setProperty("--accent", settings.accentColor);
    root.style.setProperty("--accent2", settings.accentSoftColor);
    root.style.setProperty("--paper", settings.paperColor);
    root.style.setProperty("--cream", settings.creamColor);
    root.style.setProperty("--sage", settings.sageColor);
    document.body.dataset.density = settings.siteDensity;
    document.body.dataset.corners = settings.cornerStyle;
    document.body.dataset.buttons = settings.buttonStyle;
    document.body.dataset.layout = settings.layoutStyle;
  }, [settings.inkColor, settings.goldColor, settings.goldSoftColor, settings.accentColor, settings.accentSoftColor, settings.paperColor, settings.creamColor, settings.sageColor, settings.siteDensity, settings.cornerStyle, settings.buttonStyle, settings.layoutStyle]);

  async function login(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    if (error) {
      setNotice("تعذر تسجيل الدخول. تأكد من البريد وكلمة المرور.");
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    const access = await getAdminAccess(session);
    if (!access.allowed) {
      await supabase.auth.signOut();
      setOwnerSession(false);
      setNotice("تم الدخول، لكن الحساب ليس مالكًا أو مشرفًا مفعّلًا.");
      return;
    }
    setOwnerSession(true);
    setNotice(access.role === "owner" ? "تم تسجيل الدخول كمالك للموقع." : "تم تسجيل الدخول كمشرف للموقع.");
  }

  const results = useMemo(() => {
    const items = [
      ...courses.map(([title]) => ({ title, href: `/courses/${encodeURIComponent(slugify(title))}` })),
      ...lessons.map(([title]) => ({ title, href: `/lessons/${encodeURIComponent(slugify(title))}` })),
      ...articles.map(([title]) => ({ title, href: `/articles/${encodeURIComponent(slugify(title))}` })),
      ...books.map(([title]) => ({ title, href: "/library" })),
    ];
    const query = search.trim().toLocaleLowerCase("ar");
    return query ? items.filter(({ title }) => title.toLocaleLowerCase("ar").includes(query)) : [];
  }, [search, courses, lessons, articles, books]);

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!supabase || !ownerSession) {
      setNotice("سجّل الدخول كمالك قبل الحفظ.");
      return;
    }
    const sections = [courses, lessons, articles, books];
    if (sections.some((rows) => rows.some((row) => !row[0]?.trim()))) {
      setNotice("أكمل عنوان كل عنصر قبل النشر.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("site_content").update({ payload: { settings, courses, lessons, articles, books } }).eq("id", "main");
    if (!error) {
      await supabase.from("site_content_drafts").delete().eq("id", "main");
      await supabase.rpc("write_site_audit", { action_name: "نشر المحتوى", target_name: "site_content", detail_text: "تم نشر نسخة جديدة من لوحة الإدارة" });
    }
    setSaving(false);
    setNotice(error ? "تعذر النشر. شغّل ملفات SQL الجديدة وتأكد من صلاحية حسابك." : "تم النشر بنجاح وسيظهر التحديث لكل الزوار.");
  }

  async function saveDraft() {
    if (!supabase || !ownerSession) {
      setNotice("سجّل الدخول كمالك أو مشرف قبل حفظ المسودة.");
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setNotice("انتهت جلسة الدخول. سجّل الدخول مرة أخرى.");
      return;
    }
    const { error } = await supabase.from("site_content_drafts").upsert({ id: "main", payload: { settings, courses, lessons, articles, books }, updated_by: session.user.id, updated_at: new Date().toISOString() }, { onConflict: "id" });
    setNotice(error ? "تعذر حفظ المسودة. شغّل owner_roles_drafts.sql أولًا." : "تم حفظ المسودة على الحساب ويمكن نشرها لاحقًا.");
  }

  async function loadDraft() {
    if (!supabase || !ownerSession) {
      setNotice("سجّل الدخول كمالك أو مشرف لتحميل المسودة.");
      return;
    }
    const { data, error } = await supabase.from("site_content_drafts").select("payload,updated_at").eq("id", "main").maybeSingle();
    if (error || !data?.payload) {
      setNotice(error ? "تعذر تحميل المسودة. شغّل owner_roles_drafts.sql أولًا." : "لا توجد مسودة محفوظة على الحساب.");
      return;
    }
    const payload = data.payload as Partial<AcademyContent>;
    if (payload.settings) setSettings({ ...defaults, ...payload.settings });
    if (payload.courses) setCourses(payload.courses);
    if (payload.lessons) setLessons(payload.lessons);
    if (payload.articles) setArticles(payload.articles);
    if (payload.books) setBooks(payload.books);
    setNotice(`تم تحميل المسودة المحفوظة بتاريخ ${new Date(data.updated_at).toLocaleString("ar-EG")}.`);
  }

  async function subscribeNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const honeypot = (form.elements.namedItem("website") as HTMLInputElement)?.value;
    if (honeypot) {
      setNotice("تم الاشتراك بنجاح، هنبعتلك كل جديد.");
      form.reset();
      return;
    }
    const email = (form.elements.namedItem("newsletter-email") as HTMLInputElement)?.value ?? "";
    if (!supabase) {
      setNotice("أضف إعدادات Supabase في ملف .env.local أولًا.");
      return;
    }
    setNewsletterSending(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    setNewsletterSending(false);
    if (error) {
      setNotice(error.code === "23505" ? "البريد ده مشترك بالفعل." : "تعذر الاشتراك، حاول تاني.");
      return;
    }
    setNotice("تم الاشتراك بنجاح، هنبعتلك كل جديد.");
    form.reset();
  }

  return <div className="academy-app">
    <NexusHomepage settings={settings} courses={courses} lessons={lessons} articles={articles} books={books} search={search} setSearch={setSearch} results={results} ownerSession={ownerSession} onOpenAdmin={openAdmin} onOpenInterest={() => setInterestOpen(true)} onSubscribeNewsletter={subscribeNewsletter} newsletterSending={newsletterSending} />
    {notice && <div className="toast">{notice}<button type="button" onClick={() => setNotice("")}>×</button></div>}
    {admin && <div className="modal" role="dialog" aria-modal="true"><div className={`admin${ownerSession ? " owner-dashboard" : " owner-login-gate"}`}><header><div><p className="kicker">{ownerSession ? "إدارة المحتوى" : "دخول خاص"}</p><h2>{ownerSession ? "لوحة المالك" : "تسجيل دخول المالك"}</h2></div><button type="button" aria-label="إغلاق لوحة المالك" onClick={() => setAdmin(false)}>×</button></header>{!ownerSession ? <form onSubmit={login}><p className="admin-note">سجّل الدخول بحساب المالك الذي أنشأته في Supabase. لن يستطيع أي حساب آخر نشر التغييرات.</p><label>البريد الإلكتروني<input type="email" required value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} /></label><label>كلمة المرور<input type="password" required value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} /></label><button className="primary">تسجيل الدخول</button></form> : <OwnerContentEditor settings={settings} courses={courses} lessons={lessons} articles={articles} books={books} setSettings={setSettings} setCourses={setCourses} setLessons={setLessons} setArticles={setArticles} setBooks={setBooks} onSave={save} onSaveDraft={saveDraft} onLoadDraft={loadDraft} onReset={() => { if (!window.confirm("استعادة المحتوى الافتراضي محليًا؟")) return; setSettings(defaults); setCourses(initialCourses); setLessons(initialLessons); setArticles(initialArticles); setBooks(initialBooks); setNotice("تمت استعادة المحتوى الافتراضي محليًا. اضغط حفظ ونشر لاعتماده."); }} onLogout={() => { void supabase?.auth.signOut(); setOwnerSession(false); setAdmin(false); }} busy={saving} setNotice={setNotice} />}</div></div>}
    <MajlisInterestModal open={interestOpen} onClose={() => setInterestOpen(false)} majlisTopic={settings.majlisTopic} />
  </div>;
}
