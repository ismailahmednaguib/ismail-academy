"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Settings } from "@/lib/content";
import MemberAccount from "@/components/MemberAccount";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import OwnerGateButton from "@/components/OwnerGateButton";
import { localeCopy, type Locale } from "@/lib/i18n";

function focusMain(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  const main = document.querySelector("main");
  if (main instanceof HTMLElement) {
    main.tabIndex = -1;
    main.focus();
    main.scrollIntoView();
  }
}

export default function SiteHeader({ settings }: { settings: Settings }) {
  const [menu, setMenu] = useState(false);
  const [locale, setLocale] = useState<Locale>("ar");
  const copy = localeCopy[locale];
  useEffect(() => {
    const update = (event: Event) => {
      const next = (event as CustomEvent<Locale>).detail;
      if (next === "ar" || next === "en") setLocale(next);
    };
    window.addEventListener("academy-locale-change", update);
    return () => window.removeEventListener("academy-locale-change", update);
  }, []);
  const navItems: [string, string][] = [
    [locale === "en" ? copy.home : settings.navHome, "/"],
    ...(settings.showCourses ? [[locale === "en" ? copy.courses : settings.navCourses, "/courses"] as [string, string]] : []),
    ...(settings.showLessons ? [[locale === "en" ? copy.lessons : settings.navLessons, "/lessons"] as [string, string]] : []),
    ...(settings.showMajlis ? [[locale === "en" ? copy.majalis : settings.navMajlis, "/majalis"] as [string, string]] : []),
    ...(settings.showArticles ? [[locale === "en" ? copy.articles : settings.navArticles, "/articles"] as [string, string]] : []),
    ...(settings.showLibrary ? [[locale === "en" ? copy.library : settings.navLibrary, "/library"] as [string, string]] : []),
  ];
  return (
    <>
      <a href="#main" className="skip-link" onClick={focusMain}>{copy.skipToContent}</a>
      {settings.showNexusHeader && <header className="nav">
        <div className="nav-identity"><Link className="brand" href="/">
          <i className={settings.showBrandImage && settings.brandImage ? "has-brand-image" : ""} style={settings.showBrandImage && settings.brandImage ? { backgroundImage: `url("${settings.brandImage}")` } : undefined} aria-hidden="true">{settings.showBrandImage && settings.brandImage ? "" : settings.mark}</i>
          <span>
            {settings.name}
            <small>{settings.tagline}</small>
          </span>
        </Link></div>
        <div className="nav-center"><small className="nav-context">{copy.context}</small><nav id="site-nav" className={menu ? "links open" : "links"}>
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setMenu(false)}>
              {label}
            </Link>
          ))}
          <OwnerGateButton settings={settings} className="mobile-owner" />
        </nav></div>
        <div className="nav-actions">
          {settings.showNexusLanguage && <LanguageToggle />}
          {settings.showNexusTheme && <ThemeToggle defaultMode={settings.colorMode} />}
          {settings.showNexusSearch && settings.showSearch && <Link className="header-search" href="/search" aria-label={copy.search}>⌕</Link>}
          {settings.showNexusAccount && <MemberAccount compact label={copy.account} />}
          <OwnerGateButton settings={settings} />
          <button className="menu" aria-label={copy.menu} aria-expanded={menu} aria-controls="site-nav" onClick={() => setMenu(!menu)}>
            ☰
          </button>
        </div>
      </header>}
      {settings.showMobileBar && <nav className="mobile-quickbar" aria-label={copy.quickNavigation}><Link href="/" onClick={() => setMenu(false)}><span>{copy.home}</span></Link>{settings.showCourses && <Link href="/courses" onClick={() => setMenu(false)}><span>{locale === "en" ? copy.courses : settings.navCourses}</span></Link>}{settings.showLessons && <Link href="/lessons" onClick={() => setMenu(false)}><span>{locale === "en" ? copy.lessons : settings.navLessons}</span></Link>}{settings.showNexusSearch && settings.showSearch && <Link href="/search" onClick={() => setMenu(false)}><span>{copy.search}</span></Link>}{settings.showNexusAccount && <MemberAccount compact label={copy.account} />}</nav>}
    </>
  );
}
