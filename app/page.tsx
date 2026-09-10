"use client";

import { FormEvent, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  defaultSettings as defaults,
  initialCourses,
  initialArticles,
  initialBooks,
  initialLessons,
  slugify,
  isFeatured,
  type AcademyContent,
} from "@/lib/content";
import MajlisInterestModal from "@/components/MajlisInterestModal";
import OwnerContentEditor from "@/components/OwnerContentEditor";
import { LearningShelf } from "@/components/LearningTools";
import SiteFooter from "@/components/SiteFooter";
import MemberAccount from "@/components/MemberAccount";
import WorldCommunity, { WorldGlobe } from "@/components/WorldCommunity";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import HomeSpotlight from "@/components/HomeSpotlight";
import ModernHomepage from "@/components/ModernHomepage";

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
  const [menu, setMenu] = useState(false);
  const [ownerSession, setOwnerSession] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [interestOpen, setInterestOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);
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
  async function openAdmin() {
    if (!supabase) { setNotice("أضف إعدادات Supabase في ملف .env.local أولًا."); return; }
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
    if (document.body) {
      document.body.dataset.density = settings.siteDensity;
      document.body.dataset.corners = settings.cornerStyle;
      document.body.dataset.buttons = settings.buttonStyle;
      document.body.dataset.layout = settings.layoutStyle;
    }
  }, [settings.inkColor, settings.goldColor, settings.goldSoftColor, settings.accentColor, settings.accentSoftColor, settings.paperColor, settings.creamColor, settings.sageColor, settings.siteDensity, settings.cornerStyle, settings.buttonStyle, settings.layoutStyle]);
  useEffect(() => {
    const onScroll = () => setShowTopButton(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  async function login(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    if (error) { setNotice("تعذر تسجيل الدخول. تأكد من البريد وكلمة المرور."); return; }
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
  async function save(e: FormEvent) {
    e.preventDefault();
    if (!supabase || !ownerSession) { setNotice("سجّل الدخول كمالك قبل الحفظ."); return; }
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
    if (!supabase || !ownerSession) { setNotice("سجّل الدخول كمالك أو مشرف قبل حفظ المسودة."); return; }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setNotice("انتهت جلسة الدخول. سجّل الدخول مرة أخرى."); return; }
    const { error } = await supabase.from("site_content_drafts").upsert({
      id: "main",
      payload: { settings, courses, lessons, articles, books },
      updated_by: session.user.id,
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" });
    setNotice(error ? "تعذر حفظ المسودة. شغّل owner_roles_drafts.sql أولًا." : "تم حفظ المسودة على الحساب ويمكن نشرها لاحقًا.");
  }
  async function loadDraft() {
    if (!supabase || !ownerSession) { setNotice("سجّل الدخول كمالك أو مشرف لتحميل المسودة."); return; }
    const { data, error } = await supabase.from("site_content_drafts").select("payload,updated_at").eq("id", "main").maybeSingle();
    if (error || !data?.payload) { setNotice(error ? "تعذر تحميل المسودة. شغّل owner_roles_drafts.sql أولًا." : "لا توجد مسودة محفوظة على الحساب."); return; }
    const payload = data.payload as Partial<AcademyContent>;
    if (payload.settings) setSettings({ ...defaults, ...payload.settings });
    if (payload.courses) setCourses(payload.courses);
    if (payload.lessons) setLessons(payload.lessons);
    if (payload.articles) setArticles(payload.articles);
    if (payload.books) setBooks(payload.books);
    setNotice(`تم تحميل المسودة المحفوظة بتاريخ ${new Date(data.updated_at).toLocaleString("ar-EG")}.`);
  }
  const [newsletterSending, setNewsletterSending] = useState(false);
  async function subscribeNewsletter(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const honeypot = (form.elements.namedItem("website") as HTMLInputElement)?.value;
    if (honeypot) {
      // اتعبى، غالبًا بوت — نعرض نجاح وهمي من غير ما نلمس القاعدة
      setNotice("تم الاشتراك بنجاح، هنبعتلك كل جديد.");
      form.reset();
      return;
    }
    const email = (form.elements.namedItem("newsletter-email") as HTMLInputElement)?.value ?? "";
    if (!supabase) { setNotice("أضف إعدادات Supabase في ملف .env.local أولًا."); return; }
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
  const homePageSections = new Set(["intro", "community", "newsletter"]);
  const homeSectionOrder = (Array.isArray(settings.homeSectionOrder) ? [...settings.homeSectionOrder, ...defaults.homeSectionOrder.filter((section) => !settings.homeSectionOrder.includes(section))] : defaults.homeSectionOrder).filter((section) => homePageSections.has(section));
  const homeSections: Record<string, ReactNode> = {
    intro: settings.showIntro && <section className="section intro"><div><p className="kicker">{settings.introEyebrow}</p><h2>{settings.introTitle}</h2></div><p>{settings.introText}</p></section>,
    community: settings.showCommunity && <WorldCommunity settings={settings} />,
    courses: settings.showCourses && <section className="section" id="courses"><div className="section-head"><div><p className="kicker">{settings.coursesEyebrow}</p><h2>{settings.coursesTitle}</h2></div><Link href="/courses" className="text-button">{settings.coursesLink} <b>←</b></Link></div><div className="course-grid">{courses.filter((row) => isFeatured(row, 5)).map(([title,desc,count,level]) => <article className="course-card" key={title}><div className="course-card-topline"><span className="course-card-symbol">✦</span><span className="badge">{level}</span></div><div className="course-card-body"><h3><Link href={`/courses/${encodeURIComponent(slugify(title))}`}>{title}</Link></h3><p>{desc}</p></div><footer><span>{count}</span><Link className="card-action" href={`/courses/${encodeURIComponent(slugify(title))}`} aria-label={`فتح ${title}`}>فتح المسار <b>←</b></Link></footer></article>)}</div></section>,
    lessons: settings.showLessons && <section className="section soft" id="lessons"><div className="section-head"><div><p className="kicker">{settings.lessonsEyebrow}</p><h2>{settings.lessonsTitle}</h2></div><Link href="/lessons" className="text-button">{settings.lessonsLink} <b>←</b></Link></div><div className="lesson-list">{lessons.filter((row) => isFeatured(row, 4)).map(([title,meta]) => <article key={title}><span className="lesson-row-icon">◌</span><div><b>{title}</b><small>{meta}</small></div><Link className="lesson-action" href={`/lessons/${encodeURIComponent(slugify(title))}`}>{settings.listenLabel} <b>←</b></Link></article>)}</div></section>,
    majlis: settings.showMajlis && <section className="section majlis" id="majalis"><div className="majlis-content"><p className="kicker">{settings.majlisEyebrow}</p><h2>{settings.majlisTitle}</h2><p>{settings.majlisText}</p><div className="event"><span>{settings.majlisDate.split("|").map((item, index) => <span key={index}>{index === 1 ? <b>{item.trim()}</b> : item.trim()}<br/></span>)}</span><div><b>{settings.majlisTopic}</b><small>{settings.majlisMeta}</small></div></div><button className="primary" onClick={() => setInterestOpen(true)}>{settings.majlisButton}</button></div><div className="majlis-quote">“{settings.majlisQuote}”<small>متفق عليه</small></div></section>,
    articles: settings.showArticles && <section className="section" id="articles"><div className="section-head"><div><p className="kicker">{settings.articlesEyebrow}</p><h2>{settings.articlesTitle}</h2></div><Link href="/articles" className="text-button">{settings.articlesLink} <b>←</b></Link></div><div className="article-grid">{articles.filter((row) => isFeatured(row, 5)).map(([title,cat,time,,cover],i) => <article className="article-card" key={title}><div className={`article-art art-${i % 3}${cover ? " has-cover" : ""}`} style={cover ? { backgroundImage: `url(${cover})` } : undefined} role={cover ? "img" : undefined} aria-label={cover ? title : undefined}>{cover ? null : <span className="article-placeholder" aria-hidden="true" />}</div><div className="article-card-copy"><small>{cat} · {time}</small><h3><Link href={`/articles/${encodeURIComponent(slugify(title))}`}>{title}</Link></h3><Link className="card-action" href={`/articles/${encodeURIComponent(slugify(title))}`}>{settings.readArticleLabel} <b>←</b></Link></div></article>)}</div></section>,
    library: settings.showLibrary && <section className="section library" id="library"><div className="library-intro"><p className="kicker">{settings.libraryEyebrow}</p><h2>{settings.libraryTitle}</h2><p>{settings.libraryText}</p><Link href="/library" className="primary">{settings.libraryButton} <b>←</b></Link></div><div className="book-list">{books.filter((row) => isFeatured(row, 3)).map(([title,meta,fileUrl]) => <article className="book-card" key={title}><span className="book-file-badge">PDF</span><div><b>{title}</b><small>{meta}</small></div>{fileUrl ? <a className="book-action" href={fileUrl} download aria-label={`تحميل ${title}`}>تحميل <b>↓</b></a> : <span className="coming-soon" title={settings.downloadSoonLabel}>قريبًا</span>}</article>)}</div></section>,
    newsletter: settings.showNewsletter && <section className="newsletter"><div><p className="kicker">{settings.newsletterEyebrow}</p><h2>{settings.newsletterTitle}</h2><p>{settings.newsletterText}</p></div><form onSubmit={subscribeNewsletter}><input type="email" name="newsletter-email" placeholder={settings.newsletterInputPlaceholder} required /><label className="hp-field" aria-hidden="true">الموقع الإلكتروني<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label><button className="primary" disabled={newsletterSending}>{newsletterSending ? "جارٍ الاشتراك..." : settings.newsletterButton}</button></form></section>,
  };
  const ownerAccessLabel = ownerSession ? settings.ownerPanelLabel : "دخول المالك";
  return <div className="redesign-site">
    <ModernHomepage settings={settings} courses={courses} lessons={lessons} articles={articles} books={books} search={search} setSearch={setSearch} results={results} ownerSession={ownerSession} onOpenAdmin={openAdmin} onOpenInterest={() => setInterestOpen(true)} onSubscribeNewsletter={subscribeNewsletter} newsletterSending={newsletterSending} />
    <div className="legacy-public" aria-hidden="true">
    <a href="#top" className="skip-link">تخطى إلى المحتوى</a>
    {settings.showAnnouncement && <div className="announcement"><span className="announcement-dot" aria-hidden="true" /> {settings.announcement} {settings.showMajlis && <Link className="announcement-link" href="/majalis">{settings.announcementButton}</Link>}</div>}
    <header className="nav"><div className="nav-identity"><a className="brand" href="#top"><i className={settings.showBrandImage && settings.brandImage ? "has-brand-image" : ""} style={settings.showBrandImage && settings.brandImage ? { backgroundImage: `url("${settings.brandImage}")` } : undefined} aria-hidden="true">{settings.showBrandImage && settings.brandImage ? "" : settings.mark}</i><span>{settings.name}<small>{settings.tagline}</small></span></a></div><div className="nav-center"><small className="nav-context">مكتبة معرفة · مجتمع · مجلس</small><nav className={menu ? "links open" : "links"}>{[[settings.navHome,"/"], ...(settings.showCourses ? [[settings.navCourses,"/courses"]] : []), ...(settings.showLessons ? [[settings.navLessons,"/lessons"]] : []), ...(settings.showMajlis ? [[settings.navMajlis,"/majalis"]] : []), ...(settings.showArticles ? [[settings.navArticles,"/articles"]] : []), ...(settings.showLibrary ? [[settings.navLibrary,"/library"]] : [])].map(([label,href]) => <Link key={href} href={href} onClick={() => setMenu(false)}>{label}</Link>)}<button className="mobile-owner" onClick={() => void openAdmin()}>{ownerAccessLabel}</button><span className="mobile-owner"><MemberAccount /></span></nav></div>
      <div className="nav-actions"><LanguageToggle /><ThemeToggle defaultMode={settings.colorMode} /><button className="search-button" aria-label="البحث" onClick={() => document.getElementById("site-search")?.focus()}>⌕</button><MemberAccount compact /><button className="owner-button" onClick={() => void openAdmin()}>{ownerAccessLabel}</button><button className="menu" aria-label="فتح القائمة" onClick={() => setMenu(!menu)}>☰</button></div>
    </header>
    <main id="top">
      {settings.showHero && <section className="hero"><div className="hero-copy"><div className="hero-topline"><span className="hero-index">01</span><i /><small>{settings.homeLeadKicker}</small><span className="hero-live"><b /> {settings.heroLiveLabel}</span></div><p className="kicker">{settings.homeLeadKicker}</p><h1><span>{settings.homeLeadTitle}</span></h1><div className="hero-story"><p>{settings.homeLeadText}</p><div className="hero-actions"><MemberAccount initialMode="signup" label={settings.homeLeadPrimaryCta || "سجل الآن"} hideWhenAuthenticated className="primary hero-account-cta" /></div><div className="hero-trust-line"><span>{settings.heroTrustOne}</span><i /> <span>{settings.heroTrustTwo}</span><i /> <span>{settings.heroTrustThree}</span></div></div></div><div className="hero-visual-column">{settings.showWorldGlobe && <WorldGlobe compact visualOnly showCountryLabels />}<div className="hero-stat-rail"><div><span>{settings.heroPathsLabel}</span><b>{courses.length}</b><small>{settings.heroPathsMeta}</small></div><div><span>{settings.heroMaterialsLabel}</span><b>{lessons.length + articles.length + books.length}</b><small>{settings.heroMaterialsMeta}</small></div><div><span>{settings.heroWorldLabel}</span><b>∞</b><small>{settings.heroWorldMeta}</small></div></div></div></section>}
      {settings.showSearch && <section className="search-wrap"><label htmlFor="site-search">⌕</label><input id="site-search" value={search} onChange={e => setSearch(e.target.value)} placeholder={settings.searchPlaceholder} aria-label="البحث في محتوى الموقع" />{search.trim() && <div className="search-results" role="listbox">{results.length ? results.map(r => <Link key={r.href + r.title} href={r.href} onClick={() => setSearch("")}>{r.title}</Link>) : <span>{settings.searchNoResults}</span>}</div>}</section>}
      {settings.showHomeSignals && <section className="home-signals" aria-label="مؤشرات الأكاديمية"><div className="home-signal"><span>{settings.homeSignalsCoursesLabel}</span><b>{courses.length}</b><small>{settings.homeSignalsCoursesText}</small></div><div className="home-signal featured"><span>{settings.homeSignalsContentLabel}</span><b>{lessons.length + articles.length}</b><small>{settings.homeSignalsContentText}</small></div><div className="home-signal"><span>{settings.homeSignalsCommunityLabel}</span><b>∞</b><small>{settings.homeSignalsCommunityText}</small></div></section>}
      {settings.showHomeDirectory && <section className="home-directory redesign-directory" aria-label="أقسام الأكاديمية"><div className="home-directory-heading"><span className="directory-serial">02 / EXPLORE</span><p className="kicker">{settings.homeExploreEyebrow}</p><h2>{settings.homeExploreTitle}</h2><p>{settings.homeExploreText}</p></div><div className="home-directory-grid">{[[settings.navCourses,"/courses",settings.homeExploreCoursesText,courses.length], [settings.navLessons,"/lessons",settings.homeExploreLessonsText,lessons.length], [settings.navArticles,"/articles",settings.homeExploreArticlesText,articles.length], [settings.navLibrary,"/library",settings.homeExploreLibraryText,books.length]].map(([label,href,description,count], index) => <Link className="directory-card" href={href as string} key={href as string}><span className="directory-icon">{["↗", "◌", "✦", "▣"][index]}</span><div><b>{label}</b><small>{description} · {count}</small></div><strong>←</strong></Link>)}</div></section>}
      {settings.showSpotlight && <HomeSpotlight settings={settings} course={courses.find((row) => isFeatured(row, 5))} lesson={lessons.find((row) => isFeatured(row, 4))} article={articles.find((row) => isFeatured(row, 5))} />}
      {settings.showLearningShelf && <div className="home-shelf-wrap"><LearningShelf items={[...courses.map(([title]) => ({ id: "course:" + slugify(title), title, href: "/courses/" + encodeURIComponent(slugify(title)), kind: "دورة" })), ...lessons.map(([title]) => ({ id: "lesson:" + slugify(title), title, href: "/lessons/" + encodeURIComponent(slugify(title)), kind: "درس" })), ...articles.map(([title]) => ({ id: "article:" + slugify(title), title, href: "/articles/" + encodeURIComponent(slugify(title)), kind: "مقال" }))]} /></div>}
      {homeSectionOrder.map((section) => <div key={section}>{homeSections[section]}</div>)}
    </main>
    {settings.showFooter && <SiteFooter settings={settings} />}
    {settings.showBackToTop && showTopButton && <button className="back-to-top" type="button" aria-label="العودة إلى أعلى الصفحة" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><span>↑</span><small>أعلى</small></button>}
    </div>
    {notice && <div className="toast">{notice}<button onClick={() => setNotice("")}>×</button></div>}
    {admin && (
      <div className="modal" role="dialog" aria-modal="true">
        <div className={`admin${ownerSession ? " owner-dashboard" : " owner-login-gate"}`}>
          <header><div><p className="kicker">{ownerSession ? "إدارة المحتوى" : "دخول خاص"}</p><h2>{ownerSession ? "لوحة المالك" : "تسجيل دخول المالك"}</h2></div><button aria-label="إغلاق لوحة المالك" onClick={() => setAdmin(false)}>×</button></header>
          {!ownerSession ? (
            <form onSubmit={login}>
              <p className="admin-note">سجّل الدخول بحساب المالك الذي أنشأته في Supabase. لن يستطيع أي حساب آخر نشر التغييرات.</p>
              <label>البريد الإلكتروني<input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} /></label>
              <label>كلمة المرور<input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} /></label>
              <button className="primary">تسجيل الدخول</button>
            </form>
          ) : (
            <OwnerContentEditor settings={settings} courses={courses} lessons={lessons} articles={articles} books={books} setSettings={setSettings} setCourses={setCourses} setLessons={setLessons} setArticles={setArticles} setBooks={setBooks} onSave={save} onSaveDraft={saveDraft} onLoadDraft={loadDraft} onReset={() => { if (!window.confirm("استعادة المحتوى الافتراضي محليًا؟")) return; setSettings(defaults); setCourses(initialCourses); setLessons(initialLessons); setArticles(initialArticles); setBooks(initialBooks); setNotice("تمت استعادة المحتوى الافتراضي محليًا. اضغط حفظ ونشر لاعتماده."); }} onLogout={() => { void supabase?.auth.signOut(); setOwnerSession(false); }} busy={saving} setNotice={setNotice} />
          )}
        </div>
      </div>
    )}
    <MajlisInterestModal open={interestOpen} onClose={() => setInterestOpen(false)} majlisTopic={settings.majlisTopic} />
  </div>;
}
