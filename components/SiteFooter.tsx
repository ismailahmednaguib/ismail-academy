"use client";

import Link from "next/link";
import { safeImageUrl, type Settings } from "@/lib/content";

function telegramHref(value: string) {
  return value.startsWith("http")
    ? value
    : `https://t.me/${value.replace(/^@/, "")}`;
}

function whatsappHref(value: string) {
  if (value.startsWith("http")) return value;
  const digits = value.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "#";
}

function socialHref(value: string, service: "instagram" | "youtube") {
  if (value.startsWith("http")) return value;
  return value ? `https://${service}.com/${value.replace(/^@/, "")}` : "#";
}

export default function SiteFooter({ settings }: { settings: Settings }) {
  if (!settings.showFooter) return null;
  const brandImage = safeImageUrl(settings.brandImage);
  const year = String(new Date().getFullYear());
  return (
    <footer className="site-footer footer-v2">
      <div className="footer-v2-grid">
        <div>
          <div className="brand">
            <i className={settings.showBrandImage && brandImage ? "has-brand-image" : ""} style={settings.showBrandImage && brandImage ? { backgroundImage: `url("${brandImage}")` } : undefined} aria-hidden="true">{settings.showBrandImage && brandImage ? "" : settings.mark}</i>
            <span>
              {settings.name}
              <small>{settings.tagline}</small>
            </span>
          </div>
          {settings.footerAbout ? <p>{settings.footerAbout}</p> : null}
          <p>{settings.footerCopyright.replace("{year}", year)}</p>
        </div>
        <div>
          <h4>{settings.footerQuickTitle || "أقسام سريعة"}</h4>
          <nav className="footer-v2-links" aria-label="روابط الموقع">
            <Link href="/courses">{settings.navCourses}</Link>
            <Link href="/lessons">{settings.navLessons}</Link>
            <Link href="/articles">{settings.navArticles}</Link>
            <Link href="/library">{settings.navLibrary}</Link>
            <Link href="/majalis">{settings.navMajlis}</Link>
          </nav>
        </div>
        <div>
          <h4>{settings.footerContactTitle || "تواصل معنا"}</h4>
          {settings.showContactLinks && <div className="footer-links" aria-label="روابط التواصل">
            {settings.email && <a className="contact-link" href={`mailto:${settings.email}`}><span aria-hidden="true">✉</span>{settings.emailLabel}</a>}
            {settings.telegram && <a className="contact-link" href={telegramHref(settings.telegram)} target="_blank" rel="noreferrer"><span aria-hidden="true">✈</span>{settings.telegramLabel}</a>}
            {settings.whatsapp && <a className="contact-link" href={whatsappHref(settings.whatsapp)} target="_blank" rel="noreferrer"><span aria-hidden="true">◌</span>{settings.whatsappLabel}</a>}
            {settings.instagram && <a className="contact-link" href={socialHref(settings.instagram, "instagram")} target="_blank" rel="noreferrer"><span aria-hidden="true">◎</span>{settings.instagramLabel}</a>}
            {settings.youtube && <a className="contact-link" href={socialHref(settings.youtube, "youtube")} target="_blank" rel="noreferrer"><span aria-hidden="true">▶</span>{settings.youtubeLabel}</a>}
          </div>}
          {settings.footerCtaText ? <p className="footer-v2-cta">{settings.footerCtaText}</p> : null}
        </div>
      </div>
      <nav className="footer-bottom" aria-label="روابط الموقع">
        <Link href="/about">من نحن</Link>
        <span aria-hidden="true">·</span>
        <Link href="/faq">الأسئلة الشائعة</Link>
        <span aria-hidden="true">·</span>
        <Link href="/contact">اتصل بنا</Link>
        <span aria-hidden="true">·</span>
        <Link href="/privacy">الخصوصية</Link>
        <span aria-hidden="true">·</span>
        <Link href="/search">البحث</Link>
      </nav>
    </footer>
  );
}
