"use client";

import { useState } from "react";

const links = [
  {
    title: "الرئيسية",
    href: "#home",
  },
  {
    title: "عني",
    href: "#about",
  },
  {
    title: "آية اليوم",
    href: "#ayah",
  },
  {
    title: "مشاريعي",
    href: "#projects",
  },
  {
    title: "تواصل",
    href: "#contact",
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        <a
          href="#home"
          className="brand"
          onClick={() => setOpen(false)}
        >
          <span className="brand-icon">✦</span>

          <span>إسماعيل أحمد نجيب</span>
        </a>

        <div className="nav-links">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
            >
              {link.title}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="nav-contact"
        >
          تواصل معي
        </a>

        <button
          className="menu-button"
          onClick={() => setOpen(!open)}
          aria-label="فتح القائمة"
        >
          {open ? "×" : "☰"}
        </button>
      </div>

      {open && (
        <div className="mobile-menu">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.title}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}