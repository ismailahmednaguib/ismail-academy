"use client";

import Link from "next/link";
import { useState } from "react";
import type { Settings } from "@/lib/content";
import MemberAccount from "@/components/MemberAccount";
import ThemeToggle from "@/components/ThemeToggle";

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
  const navItems: [string, string][] = [
    [settings.navHome, "/"],
    ...(settings.showCourses ? [[settings.navCourses, "/courses"] as [string, string]] : []),
    ...(settings.showLessons ? [[settings.navLessons, "/lessons"] as [string, string]] : []),
    ...(settings.showMajlis ? [[settings.navMajlis, "/majalis"] as [string, string]] : []),
    ...(settings.showArticles ? [[settings.navArticles, "/articles"] as [string, string]] : []),
    ...(settings.showLibrary ? [[settings.navLibrary, "/library"] as [string, string]] : []),
  ];
  return (
    <>
      <a href="#main" className="skip-link" onClick={focusMain}>تخطى إلى المحتوى</a>
      <header className="nav">
        <div className="nav-identity"><Link className="brand" href="/">
          <i>{settings.mark}</i>
          <span>
            {settings.name}
            <small>{settings.tagline}</small>
          </span>
        </Link></div>
        <div className="nav-center"><small className="nav-context">مكتبة معرفة · مجتمع · مجلس</small><nav className={menu ? "links open" : "links"}>
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setMenu(false)}>
              {label}
            </Link>
          ))}
          <Link className="mobile-owner" href="/?admin=1" onClick={() => setMenu(false)}>
            {settings.ownerPanelLabel}
          </Link>
        </nav></div>
        <div className="nav-actions">
          <ThemeToggle defaultMode={settings.colorMode} />
          {settings.showSearch && <Link className="header-search" href="/search" aria-label="البحث في الموقع">⌕</Link>}
          <MemberAccount compact />
          <Link className="owner-button" href="/?admin=1">
            {settings.ownerPanelLabel}
          </Link>
          <button className="menu" aria-label="فتح القائمة" onClick={() => setMenu(!menu)}>
            ☰
          </button>
        </div>
      </header>
      {settings.showMobileBar && <nav className="mobile-quickbar" aria-label="تنقل سريع"><Link href="/" onClick={() => setMenu(false)}><span>الرئيسية</span></Link><Link href="/courses" onClick={() => setMenu(false)}><span>{settings.navCourses}</span></Link><Link href="/lessons" onClick={() => setMenu(false)}><span>{settings.navLessons}</span></Link>{settings.showSearch && <Link href="/search" onClick={() => setMenu(false)}><span>البحث</span></Link>}<MemberAccount compact /></nav>}
    </>
  );
}
