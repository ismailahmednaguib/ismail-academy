"use client";

import Link from "next/link";
import { useState } from "react";
import type { Settings } from "@/lib/content";

const navItems: [string, string][] = [
  ["الرئيسية", "/"],
  ["الدورات", "/courses"],
  ["الدروس", "/lessons"],
  ["المجالس", "/#majalis"],
  ["المقالات", "/articles"],
  ["المكتبة", "/library"],
];

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
  return (
    <>
      <a href="#main" className="skip-link" onClick={focusMain}>تخطى إلى المحتوى</a>
      <header className="nav">
        <Link className="brand" href="/">
          <i>ا</i>
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
        </nav>
        <div className="nav-actions">
          {/* لوحة إدارة المحتوى متاحة من الصفحة الرئيسية فقط حاليًا */}
          <Link className="owner-button" href="/?admin=1">
            لوحة المالك
          </Link>
          <button className="menu" onClick={() => setMenu(!menu)}>
            ☰
          </button>
        </div>
      </header>
    </>
  );
}
