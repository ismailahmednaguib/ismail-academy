import type { Settings } from "@/lib/content";

function telegramHref(value: string) {
  return value.startsWith("http")
    ? value
    : `https://t.me/${value.replace(/^@/, "")}`;
}

export default function SiteFooter({ settings }: { settings: Settings }) {
  return (
    <footer>
      <div className="brand">
        <i>{settings.mark}</i>
        <span>
          {settings.name}
          <small>{settings.tagline}</small>
        </span>
      </div>
      <p>{settings.footerCopyright.replace("{year}", String(new Date().getFullYear()))}</p>
      <div>
        <a href={`mailto:${settings.email}`}>{settings.emailLabel}</a>
        <a href={telegramHref(settings.telegram)} target="_blank" rel="noreferrer">{settings.telegramLabel}</a>
      </div>
    </footer>
  );
}
