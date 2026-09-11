"use client";

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
  return (
    <footer className="site-footer">
      <div className="brand">
        <i className={settings.showBrandImage && brandImage ? "has-brand-image" : ""} style={settings.showBrandImage && brandImage ? { backgroundImage: `url("${brandImage}")` } : undefined} aria-hidden="true">{settings.showBrandImage && brandImage ? "" : settings.mark}</i>
        <span>
          {settings.name}
          <small>{settings.tagline}</small>
        </span>
      </div>
      <p>{settings.footerCopyright.replace("{year}", String(new Date().getFullYear()))}</p>
      {settings.showContactLinks && <div className="footer-links" aria-label="روابط التواصل">
        {settings.email && <a className="contact-link" href={`mailto:${settings.email}`}><span aria-hidden="true">✉</span>{settings.emailLabel}</a>}
        {settings.telegram && <a className="contact-link" href={telegramHref(settings.telegram)} target="_blank" rel="noreferrer"><span aria-hidden="true">✈</span>{settings.telegramLabel}</a>}
        {settings.whatsapp && <a className="contact-link" href={whatsappHref(settings.whatsapp)} target="_blank" rel="noreferrer"><span aria-hidden="true">◌</span>{settings.whatsappLabel}</a>}
        {settings.instagram && <a className="contact-link" href={socialHref(settings.instagram, "instagram")} target="_blank" rel="noreferrer"><span aria-hidden="true">◎</span>{settings.instagramLabel}</a>}
        {settings.youtube && <a className="contact-link" href={socialHref(settings.youtube, "youtube")} target="_blank" rel="noreferrer"><span aria-hidden="true">▶</span>{settings.youtubeLabel}</a>}
      </div>}
    </footer>
  );
}
