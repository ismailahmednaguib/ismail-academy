import type { Settings } from "@/lib/content";

export default function SiteFooter({ settings }: { settings: Settings }) {
  return (
    <footer>
      <div className="brand">
        <i>ا</i>
        <span>
          {settings.name}
          <small>{settings.tagline}</small>
        </span>
      </div>
      <p>© {new Date().getFullYear()} جميع الحقوق محفوظة.</p>
      <div>
        <a href={`mailto:${settings.email}`}>البريد</a>
        <a href="https://t.me/your_username">تيليجرام</a>
      </div>
    </footer>
  );
}
