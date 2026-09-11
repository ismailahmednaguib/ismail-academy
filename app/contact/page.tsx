import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = { title: "اتصل بنا", description: "تواصل مع إدارة الأكاديمية للأسئلة والاقتراحات." };

export default async function ContactPage() {
  const { settings } = await getSiteContent();
  return (
    <div className="static-page">
      <Breadcrumbs items={[{ label: "اتصل بنا" }]} />
      <div className="static-hero">
        <p className="nexus-eyebrow">نسعد بخدمتك</p>
        <h1>اتصل بنا</h1>
        <p>للأسئلة والاقتراحات والتبليغ عن مشكلة — نرد عادة خلال ٢٤-٤٨ ساعة.</p>
      </div>
      <div className="static-card">
        <h2>قنوات التواصل</h2>
        <p>
          {settings.email ? <>✉ البريد: <a href={`mailto:${settings.email}`}>{settings.email}</a><br /></> : null}
          {settings.telegram ? <>✈ تيليجرام: <a href={settings.telegram.startsWith("http") ? settings.telegram : `https://t.me/${settings.telegram.replace(/^@/, "")}`} target="_blank" rel="noreferrer">{settings.telegram}</a><br /></> : null}
          {settings.whatsapp ? <>◌ واتساب: <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">{settings.whatsapp}</a></> : null}
        </p>
      </div>
      <div className="static-card">
        <h2>أرسل رسالة سريعة</h2>
        <form className="contact-form" action={`mailto:${settings.email || ""}`} method="post" encType="text/plain">
          <label>الاسم<input name="name" required placeholder="اسمك الكريم" /></label>
          <label>البريد<input name="email" type="email" required placeholder="you@email.com" dir="ltr" /></label>
          <label>الموضوع
            <select name="subject">
              <option>سؤال عام</option>
              <option>اقتراح محتوى</option>
              <option>مشكلة تقنية</option>
              <option>المجالس</option>
            </select>
          </label>
          <label>الرسالة<textarea name="body" rows={5} required placeholder="اكتب رسالتك هنا..." /></label>
          <button type="submit" className="nexus-dark-button">إرسال</button>
        </form>
      </div>
    </div>
  );
}