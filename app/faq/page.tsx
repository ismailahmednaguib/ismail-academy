import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/HomeExtras";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = { title: "الأسئلة الشائعة", description: "إجابات عن أكثر الأسئلة تكرارًا حول الدورات والدروس والمجالس والحساب." };

const EXTRA = [
  { q: "هل أحتاج حسابًا للتصفح؟", a: "لا، التصفح مفتوح للجميع. الحساب يفيدك في حفظ التقدم والملاحظات والمكتبة الخاصة." },
  { q: "كيف أبحث بسرعة؟", a: "اضغط Ctrl+K أو / في الصفحة الرئيسية لفتح البحث الفوري في كل الأقسام." },
  { q: "هل يوجد تطبيق؟", a: "الموقع يدعم التثبيت كتطبيق (PWA) ويعمل دون اتصال للصفحات المحفوظة." },
];

export default async function FaqPage() {
  const { settings } = await getSiteContent();
  return (
    <div className="static-page">
      <Breadcrumbs items={[{ label: "الأسئلة الشائعة" }]} />
      <div className="static-hero">
        <p className="nexus-eyebrow">مساعدة</p>
        <h1>الأسئلة الشائعة</h1>
        <p>كل ما تحتاج معرفته للبدء والاستمرار بثقة.</p>
      </div>
      <FaqSection settings={settings} />
      <div className="static-card">
        <h2>أسئلة إضافية</h2>
        {EXTRA.map((f) => (
          <div key={f.q} style={{ marginBottom: 12 }}>
            <b>{f.q}</b>
            <p style={{ margin: "4px 0 0" }}>{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}