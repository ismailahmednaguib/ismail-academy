"use client";

import { FormEvent, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import type { Settings } from "@/lib/content";
import { isFeatured, safeImageUrl, slugify } from "@/lib/content";
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

const defaultSectionOrder = ["start", "featured", "flow", "desk", "event", "newsletter"];

function orderedSections(value: unknown) {
  const source = Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  return [...source.filter((item, index) => defaultSectionOrder.includes(item) && source.indexOf(item) === index), ...defaultSectionOrder.filter((item) => !source.includes(item))];
}

export default function NexusHomepage({ settings, courses, lessons, articles, books, search, setSearch, results, ownerSession, onOpenAdmin, onOpenInterest, onSubscribeNewsletter, newsletterSending }: Props) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [intent, setIntent] = useState("");
  const brandImage = safeImageUrl(settings.brandImage);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 680);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select")) return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (settings.showNexusSearch && settings.showSearch) setSearchOpen(true);
      }
      if (event.key === "/" && settings.showNexusSearch && settings.showSearch) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, [settings.showNexusSearch, settings.showSearch]);

  const featuredCourses = courses.filter((row) => isFeatured(row, 5));
  const featuredLessons = lessons.filter((row) => isFeatured(row, 4));
  const featuredArticles = articles.filter((row) => isFeatured(row, 5));
  const featuredBooks = books.filter((row) => isFeatured(row, 3));
  const leadCourse = featuredCourses[0] ?? courses[0];
  const nextLesson = featuredLessons[0] ?? lessons[0];
  const leadArticle = featuredArticles[0] ?? articles[0];
  const leadBook = featuredBooks[0] ?? books[0];
  const learningItems = useMemo(() => [
    ...courses.map(([title]) => ({ id: `course:${slugify(title)}`, title, href: `/courses/${encodeURIComponent(slugify(title))}`, kind: "دورة" })),
    ...lessons.map(([title]) => ({ id: `lesson:${slugify(title)}`, title, href: `/lessons/${encodeURIComponent(slugify(title))}`, kind: "درس" })),
    ...articles.map(([title]) => ({ id: `article:${slugify(title)}`, title, href: `/articles/${encodeURIComponent(slugify(title))}`, kind: "مقال" })),
  ], [courses, lessons, articles]);
  const navigation = [[settings.navHome, "#nexus-top"], ...(settings.showCourses ? [[settings.navCourses, "/courses"]] : []), ...(settings.showLessons ? [[settings.navLessons, "/lessons"]] : []), ...(settings.showArticles ? [[settings.navArticles, "/articles"]] : []), ...(settings.showLibrary ? [[settings.navLibrary, "/library"]] : []), ...(settings.showMajlis ? [[settings.navMajlis, "/majalis"]] : [])] as [string, string][];
  const startLinks = [
    settings.showCourses && { href: "/courses", label: settings.navCourses, note: settings.homeExploreCoursesText, count: courses.length, index: "01", tone: "lime" },
    settings.showLessons && { href: "/lessons", label: settings.navLessons, note: settings.homeExploreLessonsText, count: lessons.length, index: "02", tone: "blue" },
    settings.showArticles && { href: "/articles", label: settings.navArticles, note: settings.homeExploreArticlesText, count: articles.length, index: "03", tone: "orange" },
    settings.showLibrary && { href: "/library", label: settings.navLibrary, note: settings.homeExploreLibraryText, count: books.length, index: "04", tone: "violet" },
  ].filter(Boolean) as { href: string; label: string; note: string; count: number; index: string; tone: string }[];

  const openSearch = () => {
    setSearchOpen(true);
    window.setTimeout(() => document.querySelector<HTMLInputElement>(".nexus-search-panel input")?.focus(), 0);
  };

  const chooseIntent = (value: string, target: string) => {
    setIntent(value);
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sectionMap: Record<string, ReactNode> = {
    start: settings.showNexusStart && <section className="nexus-section nexus-start" id="nexus-start"><div className="nexus-section-heading"><span className="nexus-index">01</span><div><p className="nexus-eyebrow">{settings.nexusStartEyebrow}</p><h2>{settings.nexusStartTitle}</h2></div><p>{settings.nexusStartText}</p></div><div className="nexus-start-grid">{startLinks.map((item) => <Link href={item.href} className={`nexus-start-card tone-${item.tone}`} key={item.href}><span className="nexus-card-index">{item.index}</span><div><small>{item.label}</small><h3>{settings.nexusMaterialCountLabel.replace("{count}", String(item.count))}</h3><p>{item.note}</p></div><b>↗</b></Link>)}</div></section>,
    featured: settings.showNexusFeatured && <section className="nexus-section nexus-featured"><div className="nexus-section-heading compact"><span className="nexus-index">02</span><div><p className="nexus-eyebrow">{settings.nexusFeaturedEyebrow}</p><h2>{settings.nexusFeaturedTitle}</h2></div><Link href="/search" className="nexus-inline-link">{settings.nexusExploreAllLabel}</Link></div><div className="nexus-feature-grid">{settings.showCourses && <Link href={leadCourse ? `/courses/${encodeURIComponent(slugify(leadCourse[0]))}` : "/courses"} className="nexus-feature-main">{settings.showNexusFeatureMeta && <div className="nexus-feature-meta"><span>{settings.nexusPathLabel}</span><span>{leadCourse?.[3] || settings.nexusOpenLabel}</span></div>}<div><p className="nexus-eyebrow">{settings.coursesEyebrow}</p><h3>{leadCourse?.[0] || settings.coursesTitle}</h3><p>{leadCourse?.[1] || settings.homeExploreCoursesText}</p></div><span className="nexus-feature-arrow">↗</span></Link>}{settings.showArticles && <Link href={leadArticle ? `/articles/${encodeURIComponent(slugify(leadArticle[0]))}` : "/articles"} className="nexus-feature-side feature-article"><span className="nexus-side-label">{settings.nexusReadTodayLabel}</span><div><h3>{leadArticle?.[0] || settings.articlesTitle}</h3><small>{leadArticle?.[1] || settings.articlesEyebrow} · {leadArticle?.[2] || settings.nexusReadFallbackLabel}</small></div><b>↗</b></Link>}{settings.showLibrary && <Link href="/library" className="nexus-feature-side feature-book"><span className="nexus-side-label">{settings.nexusLibraryLabel}</span><div><h3>{leadBook?.[0] || settings.libraryTitle}</h3><small>{leadBook?.[1] || settings.libraryText}</small></div><b>↗</b></Link>}</div></section>,
    flow: settings.showNexusFlow && <section className="nexus-section nexus-flow"><div className="nexus-flow-intro"><p className="nexus-eyebrow">{settings.nexusFlowEyebrow}</p><h2>{settings.nexusFlowTitle}</h2><p>{settings.nexusFlowText}</p></div>{settings.showNexusFlowSteps && <div className="nexus-flow-steps"><article><span>01</span><h3>{settings.nexusFlowChooseTitle}</h3><p>{settings.nexusFlowChooseText}</p></article><article><span>02</span><h3>{settings.nexusFlowDeepenTitle}</h3><p>{settings.nexusFlowDeepenText}</p></article><article><span>03</span><h3>{settings.nexusFlowContinueTitle}</h3><p>{settings.nexusFlowContinueText}</p></article></div>}</section>,
    desk: settings.showLearningShelf && settings.showNexusDesk && <section className="nexus-section nexus-desk"><div><p className="nexus-eyebrow">{settings.nexusDeskEyebrow}</p><h2>{settings.nexusDeskTitle}</h2><p>{settings.nexusDeskText}</p><MemberAccount compact /></div>{settings.showNexusDeskList && <div className="nexus-desk-list">{learningItems.slice(0, 5).map((item) => <div key={item.id}><span>{item.kind}</span><Link href={item.href}>{item.title}</Link><LearningActions id={item.id} title={item.title} /></div>)}</div>}</section>,
    event: settings.showMajlis && settings.showNexusEvent && <section className="nexus-section nexus-event"><div><p className="nexus-eyebrow">{settings.majlisEyebrow}</p><h2>{settings.majlisTitle}</h2><p>{settings.majlisText}</p><button type="button" className="nexus-light-button" onClick={onOpenInterest}>{settings.majlisButton} ↗</button></div>{settings.showNexusEventQuote && <div className="nexus-event-note"><span>“</span><p>{settings.majlisQuote}</p><small>{settings.majlisTopic}</small></div>}</section>,
    newsletter: settings.showNewsletter && settings.showNexusNewsletter && <section className="nexus-section nexus-newsletter"><div><p className="nexus-eyebrow">{settings.newsletterEyebrow}</p><h2>{settings.newsletterTitle}</h2><p>{settings.newsletterText}</p></div>{settings.showNexusNewsletterForm && <form onSubmit={onSubscribeNewsletter}><input type="email" name="newsletter-email" placeholder={settings.newsletterInputPlaceholder} required /><label className="hp-field" aria-hidden="true">{settings.nexusWebsiteFieldLabel}<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label><button type="submit" className="nexus-dark-button" disabled={newsletterSending}>{newsletterSending ? settings.nexusSendingLabel : settings.newsletterButton}</button></form>}</section>,
  };

  return <div className="nexus-site" id="nexus-top">
    <a href="#nexus-main" className="skip-link">{settings.nexusSkipLink}</a>
    {settings.showNexusHeader && <header className="nexus-header"><Link href="#nexus-main" className="nexus-brand"><span>{settings.showBrandImage && brandImage ? <i style={{ backgroundImage: `url(\"${brandImage}\")` }} /> : settings.mark}</span><div><b>{settings.name}</b><small>{settings.tagline}</small></div></Link><nav id="nexus-nav" className={menuOpen ? "nexus-nav open" : "nexus-nav"}>{navigation.map(([label, href]) => <Link href={href} key={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}</nav><div className="nexus-actions">{settings.showNexusSearch && settings.showSearch && <button type="button" className="nexus-search-button" onClick={openSearch} aria-expanded={searchOpen} aria-controls="nexus-search-panel">{settings.nexusSearchLabel} <kbd>⌘K</kbd></button>}{settings.showNexusLanguage && <LanguageToggle />}{settings.showNexusTheme && <ThemeToggle defaultMode={settings.colorMode} />}{settings.showNexusAccount && <MemberAccount compact />}{ownerSession && <button type="button" className="nexus-owner-button" onClick={() => void onOpenAdmin()}>{settings.ownerPanelLabel}</button>}<button type="button" className="nexus-menu" onClick={() => setMenuOpen((value) => !value)} aria-label={settings.nexusMenuLabel} aria-expanded={menuOpen} aria-controls="nexus-nav">☰</button></div></header>}
    {ownerSession && !settings.showNexusHeader && <button type="button" className="nexus-owner-float" onClick={() => void onOpenAdmin()}>{settings.ownerPanelLabel}</button>}
    {settings.showAnnouncement && <div className="nexus-announcement"><span><i /> {settings.announcement}</span>{settings.showNexusAnnouncementAction && settings.showMajlis && <button type="button" onClick={onOpenInterest}>{settings.announcementButton} ↗</button>}</div>}
    {settings.showNexusSearch && settings.showSearch && searchOpen && <div id="nexus-search-panel" className="nexus-search-panel"><div><span>⌕</span><input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder={settings.searchPlaceholder} aria-label={settings.nexusSearchAriaLabel} />{search && <button type="button" onClick={() => setSearch("")} aria-label="مسح البحث">×</button>}</div>{search.trim() && <section>{results.length ? results.slice(0, 8).map((result) => <Link href={result.href} key={result.href + result.title} onClick={() => { setSearch(""); setSearchOpen(false); }}><span>{result.title}</span><b>↗</b></Link>) : <small>{settings.searchNoResults}</small>}</section>}</div>}

    <main id="nexus-main">
    {settings.showNexusHero && <section className="nexus-hero"><div className="nexus-hero-copy">{settings.showNexusHeroTag && <div className="nexus-hero-tag"><span>{settings.nexusAcademyLabel}</span><i /> <b>{settings.heroLiveLabel}</b></div>}<p className="nexus-eyebrow">{settings.homeLeadKicker}</p><h1>{settings.homeLeadTitle}</h1><p className="nexus-hero-text">{settings.homeLeadText}</p><div className="nexus-hero-actions">{settings.showNexusAccount && <MemberAccount initialMode="signup" label={settings.homeLeadPrimaryCta || "سجل الآن"} hideWhenAuthenticated className="nexus-dark-button" />}{settings.showNexusHeroSecondary && <Link href="#nexus-start" className="nexus-text-link">{settings.homeLeadSecondaryCta || "استكشف المحتوى"} <b>↓</b></Link>}</div>{settings.showNexusHeroProof && <div className="nexus-proof"><span>{settings.heroTrustOne}</span><span>{settings.heroTrustTwo}</span><span>{settings.heroTrustThree}</span></div>}</div>{settings.showNexusHeroPanel && <aside className="nexus-hero-panel"><div className="nexus-panel-top"><span>{settings.nexusTodayLabel}</span><span className="nexus-live-dot">● {settings.nexusAvailableLabel}</span></div><div className="nexus-session-mark">✦</div><p className="nexus-eyebrow">{settings.nexusNextStepLabel}</p><h2>{nextLesson?.[0] || settings.lessonsTitle}</h2><p>{nextLesson?.[1] || settings.homeExploreLessonsText}</p><Link href={nextLesson ? `/lessons/${encodeURIComponent(slugify(nextLesson[0]))}` : "/lessons"} className="nexus-panel-link">{settings.nexusStartLessonLabel} <b>↗</b></Link>{settings.showNexusIntent && <div className="nexus-intents"><span>{settings.nexusIntentQuestion}</span><div>{settings.showNexusStart && <button type="button" className={intent === "start" ? "active" : ""} onClick={() => chooseIntent("start", "nexus-start")}>{settings.nexusIntentStartLabel}</button>}{settings.showNexusFeatured && <><button type="button" className={intent === "quick" ? "active" : ""} onClick={() => chooseIntent("quick", "nexus-featured")}>{settings.nexusIntentQuickLabel}</button><button type="button" className={intent === "read" ? "active" : ""} onClick={() => chooseIntent("read", "nexus-featured")}>{settings.nexusIntentReadLabel}</button></>}</div></div>}{settings.showNexusPanelStats && <div className="nexus-panel-bottom"><div><b>{courses.length}</b><small>{settings.nexusCoursesCountLabel}</small></div><div><b>{lessons.length + articles.length}</b><small>{settings.nexusMaterialsCountLabel}</small></div><div><b>∞</b><small>{settings.nexusAlwaysLabel}</small></div></div>}</aside>}</section>}
      {settings.showNexusRail && <section className="nexus-rail"><span>{settings.nexusRailIntro}</span><b>·</b><span>{courses.length} {settings.nexusRailCourses}</span><b>·</b><span>{lessons.length + articles.length} {settings.nexusRailMaterials}</span><b>·</b><span>{settings.nexusRailAudience}</span></section>}
      {orderedSections(settings.homeSectionOrder).map((section) => <div key={section}>{sectionMap[section]}</div>)}
    </main>
    {settings.showFooter && settings.showNexusFooter && <SiteFooter settings={settings} />}
    {settings.showBackToTop && showTop && <button className="nexus-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button>}
  </div>;
}
