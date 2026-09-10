"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import type { Settings } from "@/lib/content";
import { isFeatured, slugify } from "@/lib/content";
import { LearningShelf } from "@/components/LearningTools";
import MemberAccount from "@/components/MemberAccount";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import SiteFooter from "@/components/SiteFooter";
import WorldCommunity, { WorldGlobe } from "@/components/WorldCommunity";
import HomeSpotlight from "@/components/HomeSpotlight";
import ModernDiscovery from "@/components/ModernDiscovery";

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

function firstVisible(rows: string[][], column: number, count = 3) {
  return rows.filter((row) => isFeatured(row, column)).slice(0, count);
}

export default function ModernHomepage({ settings, courses, lessons, articles, books, search, setSearch, results, ownerSession, onOpenAdmin, onOpenInterest, onSubscribeNewsletter, newsletterSending }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 650);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ownerLabel = ownerSession ? settings.ownerPanelLabel : "دخول المالك";
  const featuredCourses = firstVisible(courses, 5);
  const featuredLessons = firstVisible(lessons, 4);
  const featuredArticles = firstVisible(articles, 5);
  const featuredBooks = firstVisible(books, 3);
  const items = [
    ...courses.map(([title]) => ({ id: `course:${slugify(title)}`, title, href: `/courses/${encodeURIComponent(slugify(title))}`, kind: "دورة" })),
    ...lessons.map(([title]) => ({ id: `lesson:${slugify(title)}`, title, href: `/lessons/${encodeURIComponent(slugify(title))}`, kind: "درس" })),
    ...articles.map(([title]) => ({ id: `article:${slugify(title)}`, title, href: `/articles/${encodeURIComponent(slugify(title))}`, kind: "مقال" })),
  ];

  return <div className="modern-home">
    <a href="#modern-main" className="skip-link">تخطى إلى المحتوى</a>
    {settings.showAnnouncement && <div className="modern-announcement"><span><i /> {settings.announcement}</span>{settings.showMajlis && <Link href="/majalis">{settings.announcementButton} ↗</Link>}</div>}
    <header className="modern-header">
      <Link className="modern-brand" href="#modern-main"><i className={settings.showBrandImage && settings.brandImage ? "has-brand-image" : ""} style={settings.showBrandImage && settings.brandImage ? { backgroundImage: `url("${settings.brandImage}")` } : undefined} aria-hidden="true">{settings.showBrandImage && settings.brandImage ? "" : settings.mark}</i><span><b>{settings.name}</b><small>{settings.tagline}</small></span></Link>
      <nav className={menuOpen ? "modern-nav open" : "modern-nav"} aria-label="التنقل الرئيسي">{[[settings.navHome, "#modern-main"], ...(settings.showCourses ? [[settings.navCourses, "/courses"]] : []), ...(settings.showLessons ? [[settings.navLessons, "/lessons"]] : []), ...(settings.showArticles ? [[settings.navArticles, "/articles"]] : []), ...(settings.showLibrary ? [[settings.navLibrary, "/library"]] : [])].map(([label, href]) => <Link href={href} key={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}</nav>
      <div className="modern-actions"><LanguageToggle /><ThemeToggle defaultMode={settings.colorMode} /><MemberAccount compact /><button className="modern-owner" type="button" onClick={() => void onOpenAdmin()}>{ownerLabel}</button><button className="modern-menu" type="button" aria-label="فتح القائمة" onClick={() => setMenuOpen((value) => !value)}>☰</button></div>
    </header>

    <main id="modern-main">
      {settings.showHero && <section className="modern-hero"><div className="modern-hero-copy"><div className="modern-eyebrow"><span>01</span><i /> {settings.homeLeadKicker}<b><em /> {settings.heroLiveLabel}</b></div><p className="kicker">{settings.homeLeadKicker}</p><h1>{settings.homeLeadTitle}</h1><p className="modern-hero-text">{settings.homeLeadText}</p><div className="modern-hero-actions"><MemberAccount initialMode="signup" label={settings.homeLeadPrimaryCta || "سجل الآن"} hideWhenAuthenticated className="primary" /><Link href="#modern-collections" className="modern-text-link">استكشف المنصة <b>↓</b></Link></div><div className="modern-proof"><span>{settings.heroTrustOne}</span><span>{settings.heroTrustTwo}</span><span>{settings.heroTrustThree}</span></div></div><div className="modern-hero-visual"><div className="modern-globe-frame">{settings.showWorldGlobe && <WorldGlobe compact visualOnly showCountryLabels />}<span className="modern-orbit orbit-one" /><span className="modern-orbit orbit-two" /></div><div className="modern-hero-metrics"><div><b>{courses.length}</b><span>{settings.heroPathsLabel}</span><small>{settings.heroPathsMeta}</small></div><div><b>{lessons.length + articles.length + books.length}</b><span>{settings.heroMaterialsLabel}</span><small>{settings.heroMaterialsMeta}</small></div><div><b>∞</b><span>{settings.heroWorldLabel}</span><small>{settings.heroWorldMeta}</small></div></div></div></section>}

      {settings.showSearch && <section className="modern-command"><div className="modern-command-title"><span className="directory-serial">COMMAND CENTER</span><h2>ماذا تريد أن تتعلم اليوم؟</h2><p>ابحث في كل الدورات والدروس والمقالات والملفات من مكان واحد.</p></div><div className="modern-search-box"><span>⌕</span><input id="modern-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={settings.searchPlaceholder} aria-label="البحث في محتوى الموقع" />{search && <button type="button" onClick={() => setSearch("")} aria-label="مسح البحث">×</button>} {search.trim() && <div className="modern-search-results">{results.length ? results.slice(0, 8).map((result) => <Link key={result.href + result.title} href={result.href} onClick={() => setSearch("")}><span>↗</span>{result.title}</Link>) : <small>{settings.searchNoResults}</small>}</div>}</div></section>}

      {settings.showHomeDirectory && <section className="modern-collections" id="modern-collections"><div className="modern-section-heading"><div><span className="directory-serial">02 / COLLECTIONS</span><p className="kicker">{settings.homeExploreEyebrow}</p><h2>{settings.homeExploreTitle}</h2></div><p>{settings.homeExploreText}</p></div><div className="modern-collection-grid">{[[settings.navCourses, "/courses", settings.homeExploreCoursesText, courses.length, "01", featuredCourses[0]?.[0]], [settings.navLessons, "/lessons", settings.homeExploreLessonsText, lessons.length, "02", featuredLessons[0]?.[0]], [settings.navArticles, "/articles", settings.homeExploreArticlesText, articles.length, "03", featuredArticles[0]?.[0]], [settings.navLibrary, "/library", settings.homeExploreLibraryText, books.length, "04", featuredBooks[0]?.[0]]].map(([label, href, description, count, number, preview], index) => <Link href={href as string} className={`modern-collection-card collection-${index + 1}`} key={href as string}><span>{number as string}</span><div><small>{label as string} · {count as number}</small><h3>{preview as string || label as string}</h3><p>{description as string}</p></div><b>↗</b></Link>)}</div></section>}

      {settings.showHomeDirectory && <ModernDiscovery settings={settings} courses={courses} lessons={lessons} articles={articles} books={books} />}
      {settings.showSpotlight && <HomeSpotlight settings={settings} course={featuredCourses[0]} lesson={featuredLessons[0]} article={featuredArticles[0]} />}
      {settings.showLearningShelf && <div className="modern-shelf"><LearningShelf items={items} /></div>}
      {settings.showCommunity && <section className="modern-community"><div className="modern-section-heading"><div><span className="directory-serial">04 / COMMUNITY</span><p className="kicker">{settings.communityEyebrow}</p><h2>{settings.communityTitle}</h2></div><p>{settings.communityText}</p></div><WorldCommunity settings={settings} /></section>}
      {settings.showMajlis && <section className="modern-gathering"><div><span className="directory-serial">05 / GATHERING</span><p className="kicker">{settings.majlisEyebrow}</p><h2>{settings.majlisTitle}</h2><p>{settings.majlisText}</p><button type="button" className="primary" onClick={onOpenInterest}>{settings.majlisButton} ↗</button></div><blockquote>“{settings.majlisQuote}”<small>{settings.majlisTopic}</small></blockquote></section>}
      {settings.showNewsletter && <section className="modern-newsletter"><div><span className="directory-serial">06 / STAY CLOSE</span><p className="kicker">{settings.newsletterEyebrow}</p><h2>{settings.newsletterTitle}</h2><p>{settings.newsletterText}</p></div><form onSubmit={onSubscribeNewsletter}><input type="email" name="newsletter-email" placeholder={settings.newsletterInputPlaceholder} required /><label className="hp-field" aria-hidden="true">الموقع الإلكتروني<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label><button className="primary" disabled={newsletterSending}>{newsletterSending ? "جارٍ الاشتراك..." : settings.newsletterButton}</button></form></section>}
    </main>
    {settings.showFooter && <SiteFooter settings={settings} />}
    {settings.showBackToTop && showTop && <button className="modern-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="العودة إلى أعلى الصفحة">↑</button>}
  </div>;
}
