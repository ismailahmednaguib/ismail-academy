import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getSiteContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteContent();
  return { title: `من نحن | ${settings.name}`, description: "تعرف على رسالة الأكاديمية ومنهجها وأهدافها." };
}

export default async function AboutPage() {
  const { settings } = await getSiteContent();
  return (
    <div className="static-page">
      <Breadcrumbs items={[{ label: "من نحن" }]} />
      <div className="static-hero">
        <p className="nexus-eyebrow">قصتنا</p>
        <h1>من نحن</h1>
        <p>{settings.name} — {settings.tagline}. منصة عربية تجمع الدورات والدروس والمقالات والمكتبة والمجالس في مكان واحد.</p>
      </div>
      <div className="static-card">
        <h2>رسالتنا</h2>
        <p>نشر العلم النافع بأسلوب مبسط ومنظم، مع التركيز على الاستمرارية: درس قصير كل يوم، ومراجعة دائمة، وتطبيق عملي.</p>
      </div>
      <div className="static-grid">
        <div><h3>🎯 المنهج</h3><p>مسارات مرتبة من التأسيس إلى التعمق، مع اختبارات قصيرة وشهادات.</p></div>
        <div><h3>📚 المكتبة</h3><p>كتب ومقالات مختارة بعناية مع ملخصات ونقاط عملية.</p></div>
        <div><h3>🕌 المجالس</h3><p>لقاءات حضورية تجمع الطلاب للمدارسة والأسئلة المباشرة.</p></div>
      </div>
      <div className="static-card">
        <h2>كيف تبدأ؟</h2>
        <p>1) اختر دورة قصيرة من <Link href="/courses">الدورات</Link>. 2) تابع <Link href="/lessons">الدروس اليومية</Link>. 3) احفظ تقدمك من <Link href="/account">حسابك</Link>. 4) اشترك في <Link href="/majalis">المجالس</Link>.</p>
      </div>
    </div>
  );
}