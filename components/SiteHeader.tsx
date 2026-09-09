"use client";

import Link from "next/link";
import { useState } from "react";
import type { Settings } from "@/lib/content";
import MemberAccount from "@/components/MemberAccount";

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
    [settings.navCourses, "/courses"],
    [settings.navLessons, "/lessons"],
    [settings.navMajlis, "/#majalis"],
    [settings.navArticles, "/articles"],
    [settings.navLibrary, "/library"],
  ];
  return (
    <>
      <a href="#main" className="skip-link" onClick={focusMain}>تخطى إلى المحتوى</a>
      <header className="nav">
        <Link className="brand" href="/">
          <i>{settings.mark}</i>
          <span>
            {settings.name}
            <small>{settings.tagline}</small>
          </span>
        </Link>
        <nav className={menu ? "links open" : "links"}>
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setMenu(false)}>
              {label}
            </Link>
          ))}
          <Link className="mobile-owner" href="/?admin=1" onClick={() => setMenu(false)}>
            {settings.ownerPanelLabel}
          </Link>
          <span className="mobile-owner"><MemberAccount /></span>
        </nav>
        <div className="nav-actions">
          <Link className="header-search" href="/search" aria-label="البحث في الموقع">⌕</Link>
          <MemberAccount compact />
          <Link className="owner-button" href="/?admin=1">
            {settings.ownerPanelLabel}
          </Link>
          <button className="menu" aria-label="فتح القائمة" onClick={() => setMenu(!menu)}>
            ☰
          </button>
        </div>
      </header>
    </>
  );
}
