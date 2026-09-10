"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Settings } from "@/lib/content";
import { isFeatured, slugify } from "@/lib/content";
import { LearningActions } from "@/components/LearningTools";
import MemberAccount from "@/components/MemberAccount";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import SiteFooter from "@/components/SiteFooter";

type Result = { title: string; href: string };
type Props = {
  settings: Settings;
  courses: string[][];
  lessons: string[][];
  articles: string[][];
  books: string[][];
  search: string;
  setSearch: (value: string) => void;
  results: Result[];
  ownerSession: boolean;
  onOpenAdmin: () => void | Promise<void>;
  onOpenInterest: () => void;
  onSubscribeNewsletter: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  newsletterSending: boolean;
};

export default function PulseHomepage({ settings, courses, lessons, articles, books, search, setSearch, results, ownerSession, onOpenAdmin, onOpenInterest, onSubscribeNewsletter, newsletterSending }: Props) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 680);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const focusSearch = () => window.setTimeout(() => document.querySelector<HTMLInputElement>(".pulse-search-panel input")?.focus(), 0);
    const onShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.matches("input, textarea, select");
      const key = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && key === "k") {
        event.preventDefault();
        if (settings.showPulseSearch && settings.showSearch) {
          setSearchOpen(true);
          focusSearch();
        }
      }
      if (!isTyping && event.key === "/" && settings.showPulseSearch && settings.showSearch) {
        event.preventDefault();
        setSearchOpen(true);
        focusSearch();
      }
    };
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, [settings.showPulseSearch, settings.showSearch]);

  const selectedCourses = courses.filter((row) => isFeatured(row, 5));
  const selectedLessons = lessons.filter((row) => isFeatured(row, 4));
  const selectedArticles = articles.filter((row) => isFeatured(row, 5));
  const selectedBooks = books.filter((row) => isFeatured(row, 3));
  const route = selectedCourses[0] ?? courses[0];
  const nextLesson = selectedLessons[0] ?? lessons[0];
  const featureArticle = selectedArticles[0] ?? articles[0];
  const learningItems = useMemo(() => [
    ...courses.map(([title]) => ({ id: `course:${slugify(title)}`, title, href: `/courses/${encodeURIComponent(slugify(title))}`, kind: "دورة" })),
    ...lessons.map(([title]) => ({ id: `lesson:${slugify(title)}`, title, href: `/lessons/${encodeURIComponent(slugify(title))}`, kind: "درس" })),
  ], [courses, lessons]);
  const navigation = [[settings.navHome, "#pulse-top"], ...(settings.showCourses ? [[settings.navCourses, "/courses"]] : []), ...(settings.showLessons ? [[settings.navLessons, "/lessons"]] : []), ...(settings.showArticles ? [[settings.navArticles, "/articles"]] : []), ...(settings.showLibrary ? [[settings.navLibrary, "/library"]] : [])] as [string, string][];

  const openSearch = () => {
    setSearchOpen((value) => !value);
    window.setTimeout(() => document.querySelector<HTMLInputElement>(".pulse-search-panel input")?.focus(), 0);
  };

  return <div className="pulse-site" id="pulse-top">
    <a href="#pulse-main" className="skip-link">تخطى إلى المحتوى</a>

    {settings.showPulseHeader && <header className="pulse-header">
      <Link href="#pulse-main" className="pulse-brand"><span>{settings.showBrandImage && settings.brandImage ? <i style={{ backgroundImage: `url(\"${settings.brandImage}\")` }} /> : settings.mark}</span><div><b>{settings.name}</b><small>{settings.tagline}</small></div></Link>
      <nav className={menuOpen ? "pulse-nav open" : "pulse-nav"}>{navigation.map(([label, href]) => <Link href={href} key={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}</nav>
      <div className="pulse-actions">
        {settings.showPulseSearch && settings.showSearch && <button type="button" className="pulse-search-button" onClick={openSearch} aria-expanded={searchOpen}>⌕ <span>بحث</span><kbd>⌘K</kbd></button>}
        {settings.showPulseLanguage && <LanguageToggle />}
        {settings.showPulseTheme && <ThemeToggle defaultMode={settings.colorMode} />}
        {settings.showPulseAccount && <MemberAccount compact />}
        {ownerSession && <button type="button" className="pulse-owner" onClick={() => void onOpenAdmin()}>{settings.ownerPanelLabel}</button>}
        <button type="button" className="pulse-menu" onClick={() => setMenuOpen((value) => !value)} aria-label="القائمة">☰</button>
      </div>
    </header>}

    {settings.showAnnouncement && <div className="pulse-alert"><span><i /> {settings.announcement}</span>{settings.showPulseEvent && settings.showMajlis && <button type="button" onClick={onOpenInterest}>{settings.announcementButton} ↗</button>}</div>}
    {settings.showPulseSearch && settings.showSearch && searchOpen && <div className="pulse-search-panel"><div><span>⌕</span><input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder={settings.searchPlaceholder} aria-label="البحث" />{search && <button type="button" onClick={() => setSearch("")}>×</button>}</div>{search.trim() && <section>{results.length ? results.slice(0, 8).map((result) => <Link href={result.href} key={result.href + result.title} onClick={() => { setSearch(""); setSearchOpen(false); }}><span>{result.title}</span><b>↗</b></Link>) : <small>{settings.searchNoResults}</small>}</section>}</div>}

    <main id="pulse-main">
      {settings.showHero && <section className="pulse-hero"><div className="pulse-hero-copy"><div className="pulse-kicker"><span>01</span><i /> <small>{settings.heroLiveLabel}</small></div><p className="pulse-overline">{settings.homeLeadKicker}</p><h1>{settings.homeLeadTitle}</h1><p className="pulse-hero-text">{settings.homeLeadText}</p><div className="pulse-hero-buttons">{settings.showPulseAccount && <MemberAccount initialMode="signup" label={settings.homeLeadPrimaryCta || "سجل الآن"} hideWhenAuthenticated className="pulse-dark-button" />}{settings.showPulseHeroSecondaryCta && <Link href="#pulse-entries" className="pulse-text-button">استكشف المواد <b>↓</b></Link>}</div>{settings.showPulseHeroTrust && <div className="pulse-proof"><span>{settings.heroTrustOne}</span><span>{settings.heroTrustTwo}</span><span>{settings.heroTrustThree}</span></div>}</div>{settings.showPulseHeroRoute && <div className="pulse-route"><div className="pulse-route-head"><span>YOUR NEXT STEP</span><span>01 / 03</span></div><div className="pulse-route-body"><span className="pulse-route-mark">✦</span><p className="pulse-overline">مسار مقترح لك</p><h2>{route?.[0] || settings.coursesTitle}</h2><p>{route?.[1] || settings.homeExploreCoursesText}</p><Link href={route ? `/courses/${encodeURIComponent(slugify(route[0]))}` : "/courses"}>ابدأ المسار <b>↗</b></Link></div><div className="pulse-route-bottom"><span>المادة التالية</span><b>{nextLesson?.[0] || settings.lessonsTitle}</b><small>{nextLesson?.[1] || "درس قصير"}</small></div></div>}</section>}
      {settings.showPulseStrip && <div className="pulse-strip"><span>ACADEMY / OPEN KNOWLEDGE</span><i /><span>تعلّم بهدوء · اقرأ بوعي · استمر بأثر</span><i /><span>2026</span></div>}
      {settings.showPulseIntro && <section className="pulse-intro"><span className="pulse-number">02</span><div><p className="pulse-overline">{settings.homeExploreEyebrow}</p><h2>{settings.homeExploreTitle}</h2></div><p>{settings.homeExploreText}</p></section>}
      {settings.showHomeDirectory && settings.showPulseDirectory && <section className="pulse-entries" id="pulse-entries"><div className="pulse-heading"><div><span>START HERE</span><h2>اختر نقطة البداية.</h2></div><p>أربع طرق مختلفة للدخول إلى الأكاديمية. لا تحتاج إلى خطة مثالية؛ تحتاج إلى خطوة مناسبة لوقتك.</p></div><div className="pulse-entry-grid"><Link href="/courses" className="pulse-entry entry-course"><span>01</span><div><small>{settings.navCourses}</small><h3>{selectedCourses.length} مسارات مرتبة</h3><p>{settings.homeExploreCoursesText}</p></div><b>↗</b></Link><Link href="/lessons" className="pulse-entry entry-lesson"><span>02</span><div><small>{settings.navLessons}</small><h3>{selectedLessons.length} جرعات قصيرة</h3><p>{settings.homeExploreLessonsText}</p></div><b>↗</b></Link><Link href="/articles" className="pulse-entry entry-article"><span>03</span><div><small>{settings.navArticles}</small><h3>قراءات تفتح الأسئلة</h3><p>{settings.homeExploreArticlesText}</p></div><b>↗</b></Link><Link href="/library" className="pulse-entry entry-library"><span>04</span><div><small>{settings.navLibrary}</small><h3>{selectedBooks.length} ملفات للرجوع</h3><p>{settings.homeExploreLibraryText}</p></div><b>↗</b></Link></div></section>}
      {settings.showCourses && settings.showPulsePrograms && <section className="pulse-programs"><div className="pulse-programs-intro"><span>PROGRAMS / 03</span><h2>{settings.coursesTitle}</h2><p>مسارات مصممة لتبقى قابلة للاستمرار، لا لتملأ يومك دفعة واحدة.</p><Link href="/courses">{settings.coursesLink} ↗</Link></div><div className="pulse-program-list">{selectedCourses.slice(0, 4).map(([title, description, count, level], index) => <article key={title}><span className="pulse-program-index">0{index + 1}</span><div><Link href={`/courses/${encodeURIComponent(slugify(title))}`}><h3>{title}</h3></Link><p>{description}</p><small>{level || "مسار"} · {count || "مفتوح"}</small></div><LearningActions id={`course:${slugify(title)}`} title={title} /></article>)}</div></section>}
      {settings.showPulseJournal && settings.showArticles && settings.showLessons && <section className="pulse-journal"><div className="pulse-journal-feature"><span>READ / 04</span><div className="pulse-art-mark">✦</div><p className="pulse-overline">{featureArticle?.[1] || settings.articlesEyebrow}</p><h2>{featureArticle?.[0] || settings.articlesTitle}</h2><p>{featureArticle?.[3]?.split("\\n")[0] || settings.articlesEyebrow}</p><Link href={featureArticle ? `/articles/${encodeURIComponent(slugify(featureArticle[0]))}` : "/articles"}>{settings.readArticleLabel} ↗</Link></div><div className="pulse-journal-list"><div className="pulse-heading"><div><span>LISTEN / 05</span><h2>{settings.lessonsTitle}</h2></div><Link href="/lessons">{settings.lessonsLink} ↗</Link></div>{selectedLessons.slice(0, 4).map(([title, meta], index) => <Link href={`/lessons/${encodeURIComponent(slugify(title))}`} className="pulse-lesson" key={title}><span>0{index + 1}</span><div><b>{title}</b><small>{meta}</small></div><i>↗</i></Link>)}</div></section>}
      {settings.showLearningShelf && settings.showPulseDesk && <section className="pulse-desk"><div><span className="pulse-overline">YOUR DESK</span><h2>رحلتك في مكان واحد.</h2><p>المواد التي تحفظها أو تنجزها تظل قريبة منك على هذا الجهاز ومع حسابك.</p></div><div className="pulse-desk-list">{learningItems.slice(0, 4).map((item) => <div key={item.id}><span>{item.kind}</span><b>{item.title}</b><LearningActions id={item.id} title={item.title} /></div>)}</div></section>}
      {settings.showMajlis && settings.showPulseEvent && <section className="pulse-event"><div><p className="pulse-overline">{settings.majlisEyebrow}</p><h2>{settings.majlisTitle}</h2><p>{settings.majlisText}</p><button type="button" className="pulse-dark-button" onClick={onOpenInterest}>{settings.majlisButton} ↗</button></div><div><span>“</span><p>{settings.majlisQuote}</p><small>{settings.majlisTopic}</small></div></section>}
      {settings.showNewsletter && <section className="pulse-newsletter"><div><p className="pulse-overline">{settings.newsletterEyebrow}</p><h2>{settings.newsletterTitle}</h2><p>{settings.newsletterText}</p></div><form onSubmit={onSubscribeNewsletter}><input type="email" name="newsletter-email" placeholder={settings.newsletterInputPlaceholder} required /><label className="hp-field" aria-hidden="true">الموقع الإلكتروني<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label><button type="submit" className="pulse-dark-button" disabled={newsletterSending}>{newsletterSending ? "جارٍ..." : settings.newsletterButton}</button></form></section>}
    </main>
    {settings.showFooter && <SiteFooter settings={settings} />}
    {settings.showBackToTop && showTop && <button className="pulse-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button>}
  </div>;
}
