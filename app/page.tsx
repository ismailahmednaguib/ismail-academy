"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
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
    if (payload.settings) setSettings({ ...defaults, ...payload.settings });
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
    const { data: isOwner } = session ? await supabase.rpc("is_site_owner") : { data: false };
    setOwnerSession(isOwner === true);
    if (session && isOwner !== true) setNotice("هذا الحساب عضو عادي. سجّل دخولك بحساب المالك لفتح لوحة الإدارة.");
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
    root.style.setProperty("--paper", settings.paperColor);
    root.style.setProperty("--cream", settings.creamColor);
    root.style.setProperty("--sage", settings.sageColor);
    if (document.body) {
      document.body.dataset.density = settings.siteDensity;
      document.body.dataset.corners = settings.cornerStyle;
    }
  }, [settings.inkColor, settings.goldColor, settings.goldSoftColor, settings.paperColor, settings.creamColor, settings.sageColor, settings.siteDensity, settings.cornerStyle]);
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
    const { data: isOwner } = await supabase.rpc("is_site_owner");
    if (isOwner !== true) {
      await supabase.auth.signOut();
      setOwnerSession(false);
      setNotice("تم الدخول، لكن الحساب ليس حساب المالك.");
      return;
    }
    setOwnerSession(true);
    setNotice("تم تسجيل الدخول كمالك للموقع.");
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
    setSaving(false);
    setNotice(error ? "تعذر الحفظ. تأكد أن بريدك مكتوب في سياسة قاعدة البيانات." : "تم النشر بنجاح وسيظهر التحديث لكل الزوار.");
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
  const scroll = (id: string) => { setMenu(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  return <>
    <a href="#top" className="skip-link">تخطى إلى المحتوى</a>
    {settings.showAnnouncement && <div className="announcement"><span className="announcement-dot" aria-hidden="true" /> {settings.announcement} {settings.showMajlis && <button onClick={() => scroll("majalis")}>{settings.announcementButton}</button>}</div>}
    <header className="nav"><a className="brand" href="#top"><i>{settings.mark}</i><span>{settings.name}<small>{settings.tagline}</small></span></a>
      <nav className={menu ? "links open" : "links"}>{[[settings.navHome,"top"], ...(settings.showCourses ? [[settings.navCourses,"courses"]] : []), ...(settings.showLessons ? [[settings.navLessons,"lessons"]] : []), ...(settings.showMajlis ? [[settings.navMajlis,"majalis"]] : []), ...(settings.showArticles ? [[settings.navArticles,"articles"]] : []), ...(settings.showLibrary ? [[settings.navLibrary,"library"]] : [])].map(([label,id]) => <button key={id} onClick={() => scroll(id)}>{label}</button>)}<button className="mobile-owner" onClick={() => void openAdmin()}>{settings.ownerPanelLabel}</button><span className="mobile-owner"><MemberAccount /></span></nav>
      <div className="nav-actions"><button className="search-button" aria-label="البحث" onClick={() => document.getElementById("site-search")?.focus()}>⌕</button><MemberAccount compact /><button className="owner-button" onClick={() => void openAdmin()}>{settings.ownerPanelLabel}</button><button className="menu" aria-label="فتح القائمة" onClick={() => setMenu(!menu)}>☰</button></div>
    </header>
    <main id="top">
      <section className="hero"><div className="hero-copy"><p className="kicker">{settings.heroKicker}</p><h1>{settings.heroTitle}</h1><p>{settings.heroText}</p><div className="hero-actions"><button className="primary" onClick={() => scroll("courses")}>{settings.heroPrimaryCta} <b>←</b></button><button className="ghost" onClick={() => scroll("majalis")}>{settings.heroSecondaryCta}</button></div><div className="hero-metrics"><span><b>+{lessons.length}</b> {settings.heroMetricLessonsLabel}</span><span><b>{courses.length}</b> {settings.heroMetricCoursesLabel}</span><span><b>{settings.heroMetricFreeValue}</b> {settings.heroMetricFreeLabel}</span></div></div><WorldGlobe compact /></section>
      <section className="search-wrap"><label htmlFor="site-search">⌕</label><input id="site-search" value={search} onChange={e => setSearch(e.target.value)} placeholder={settings.searchPlaceholder} aria-label="البحث في محتوى الموقع" />{search.trim() && <div className="search-results" role="listbox">{results.length ? results.map(r => <Link key={r.href + r.title} href={r.href} onClick={() => setSearch("")}>{r.title}</Link>) : <span>{settings.searchNoResults}</span>}</div>}</section>
      <LearningShelf items={[...courses.map(([title]) => ({ id: "course:" + slugify(title), title, href: "/courses/" + encodeURIComponent(slugify(title)), kind: "دورة" })), ...lessons.map(([title]) => ({ id: "lesson:" + slugify(title), title, href: "/lessons/" + encodeURIComponent(slugify(title)), kind: "درس" })), ...articles.map(([title]) => ({ id: "article:" + slugify(title), title, href: "/articles/" + encodeURIComponent(slugify(title)), kind: "مقال" }))]} />
      {settings.showIntro && <section className="section intro"><div><p className="kicker">{settings.introEyebrow}</p><h2>{settings.introTitle}</h2></div><p>{settings.introText}</p></section>}
      {settings.showCommunity && <WorldCommunity settings={settings} />}
      {settings.showCourses && <section className="section" id="courses"><div className="section-head"><div><p className="kicker">{settings.coursesEyebrow}</p><h2>{settings.coursesTitle}</h2></div><Link href="/courses" className="text-button">{settings.coursesLink}</Link></div><div className="course-grid">{courses.filter((row) => isFeatured(row, 5)).map(([title,desc,count,level,num]) => <article className="course-card" key={title}><div className="course-number">{num}</div><span className="badge">{level}</span><h3><Link href={`/courses/${encodeURIComponent(slugify(title))}`}>{title}</Link></h3><p>{desc}</p><footer><span>{count}</span><Link href={`/courses/${encodeURIComponent(slugify(title))}`} aria-label={`فتح ${title}`}>←</Link></footer></article>)}</div></section>}
      {settings.showLessons && <section className="section soft" id="lessons"><div className="section-head"><div><p className="kicker">{settings.lessonsEyebrow}</p><h2>{settings.lessonsTitle}</h2></div><Link href="/lessons" className="text-button">{settings.lessonsLink}</Link></div><div className="lesson-list">{lessons.filter((row) => isFeatured(row, 4)).map(([title,meta],i) => <article key={`${title}-${i}`}><span>0{i+1}</span><div><b>{title}</b><small>{meta}</small></div><Link href={`/lessons/${encodeURIComponent(slugify(title))}`}>{settings.listenLabel}</Link></article>)}</div></section>}
      {settings.showMajlis && <section className="section majlis" id="majalis"><div className="majlis-content"><p className="kicker">{settings.majlisEyebrow}</p><h2>{settings.majlisTitle}</h2><p>{settings.majlisText}</p><div className="event"><span>{settings.majlisDate.split("|").map((item, index) => <span key={index}>{index === 1 ? <b>{item.trim()}</b> : item.trim()}<br/></span>)}</span><div><b>{settings.majlisTopic}</b><small>{settings.majlisMeta}</small></div></div><button className="primary" onClick={() => setInterestOpen(true)}>{settings.majlisButton}</button></div><div className="majlis-quote">“{settings.majlisQuote}”<small>متفق عليه</small></div></section>}
      {settings.showArticles && <section className="section" id="articles"><div className="section-head"><div><p className="kicker">{settings.articlesEyebrow}</p><h2>{settings.articlesTitle}</h2></div><Link href="/articles" className="text-button">{settings.articlesLink}</Link></div><div className="article-grid">{articles.filter((row) => isFeatured(row, 5)).map(([title,cat,time,,cover],i) => <article key={title}><div className={`article-art art-${i % 3}${cover ? " has-cover" : ""}`} style={cover ? { backgroundImage: `url(${cover})` } : undefined} role={cover ? "img" : undefined} aria-label={cover ? title : undefined}>{cover ? null : <span className="article-placeholder" aria-hidden="true" />}</div><small>{cat} · {time}</small><h3><Link href={`/articles/${encodeURIComponent(slugify(title))}`}>{title}</Link></h3><Link href={`/articles/${encodeURIComponent(slugify(title))}`}>{settings.readArticleLabel}</Link></article>)}</div></section>}
      {settings.showLibrary && <section className="section library" id="library"><div><p className="kicker">{settings.libraryEyebrow}</p><h2>{settings.libraryTitle}</h2><p>{settings.libraryText}</p><Link href="/library" className="primary">{settings.libraryButton}</Link></div><div className="book-list">{books.filter((row) => isFeatured(row, 3)).map(([title,meta,fileUrl]) => <article key={title}><span>PDF</span><div><b>{title}</b><small>{meta}</small></div>{fileUrl ? <a href={fileUrl} download aria-label={`تحميل ${title}`}>↓</a> : <span className="coming-soon" title={settings.downloadSoonLabel}>↓</span>}</article>)}</div></section>}
      {settings.showNewsletter && <section className="newsletter"><div><p className="kicker">{settings.newsletterEyebrow}</p><h2>{settings.newsletterTitle}</h2><p>{settings.newsletterText}</p></div><form onSubmit={subscribeNewsletter}><input type="email" name="newsletter-email" placeholder={settings.newsletterInputPlaceholder} required /><label className="hp-field" aria-hidden="true">الموقع الإلكتروني<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label><button className="primary" disabled={newsletterSending}>{newsletterSending ? "جارٍ الاشتراك..." : settings.newsletterButton}</button></form></section>}
    </main>
    <SiteFooter settings={settings} />
    {settings.showBackToTop && showTopButton && <button className="back-to-top" type="button" aria-label="العودة إلى أعلى الصفحة" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><span>↑</span><small>أعلى</small></button>}
    {notice && <div className="toast">{notice}<button onClick={() => setNotice("")}>×</button></div>}
    {admin && (
      <div className="modal" role="dialog" aria-modal="true">
        <div className="admin">
          <header><div><p className="kicker">إدارة المحتوى</p><h2>لوحة المالك</h2></div><button aria-label="إغلاق لوحة المالك" onClick={() => setAdmin(false)}>×</button></header>
          {!ownerSession ? (
            <form onSubmit={login}>
              <p className="admin-note">سجّل الدخول بحساب المالك الذي أنشأته في Supabase. لن يستطيع أي حساب آخر نشر التغييرات.</p>
              <label>البريد الإلكتروني<input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} /></label>
              <label>كلمة المرور<input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} /></label>
              <button className="primary">تسجيل الدخول</button>
            </form>
          ) : (
            <OwnerContentEditor settings={settings} courses={courses} lessons={lessons} articles={articles} books={books} setSettings={setSettings} setCourses={setCourses} setLessons={setLessons} setArticles={setArticles} setBooks={setBooks} onSave={save} onReset={() => { if (!window.confirm("استعادة المحتوى الافتراضي محليًا؟")) return; setSettings(defaults); setCourses(initialCourses); setLessons(initialLessons); setArticles(initialArticles); setBooks(initialBooks); setNotice("تمت استعادة المحتوى الافتراضي محليًا. اضغط حفظ ونشر لاعتماده."); }} onLogout={() => { void supabase?.auth.signOut(); setOwnerSession(false); }} busy={saving} setNotice={setNotice} />
          )}
        </div>
      </div>
    )}
    <MajlisInterestModal open={interestOpen} onClose={() => setInterestOpen(false)} majlisTopic={settings.majlisTopic} />
  </>;
}
