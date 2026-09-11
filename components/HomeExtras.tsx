"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import type { Settings } from "@/lib/content";

const WISDOM_FALLBACK = [
  { text: "العلمُ صيدٌ والكتابةُ قيدُه، قيّد صيودك بالحبال الواثقة.", source: "الإمام الشافعي" },
  { text: "من سلك طريقًا يلتمس فيه علمًا سهّل الله له به طريقًا إلى الجنة.", source: "حديث شريف" },
  { text: "قليلٌ دائم خيرٌ من كثيرٍ منقطع.", source: "حكمة تربوية" },
  { text: "أفضل الأوقات للتعلم: ساعة تركيز عميق كل يوم.", source: "منهج الأكاديمية" },
  { text: "راجع ما تتعلمه خلال ٢٤ ساعة لتثبيته في الذاكرة.", source: "علم التعلم" },
];

const FAQS_FALLBACK = [
  { q: "كيف أبدأ رحلتي في الأكاديمية؟", a: "ابدأ من قسم الدورات أو الدروس، اختر مادة قصيرة تناسب مستواك، والتزم بدرس واحد يوميًا مع تدوين الفوائد." },
  { q: "هل المحتوى مجاني؟", a: "نعم، أغلب الدروس والمقالات والكتب متاحة مجانًا. المجالس الحضورية قد تتطلب تسجيل اهتمام مسبق." },
  { q: "كيف أتابع تقدمي؟", a: "من حساب العضو يمكنك حفظ المواد في مكتبتك، وتتبع الدروس المكتملة، وتدوين ملاحظاتك الخاصة." },
  { q: "كيف أشترك في المجالس؟", a: "افتح صفحة المجالس واضغط زر إبداء الاهتمام، واكتب اسمك ووسيلة التواصل وسيصلك كل جديد." },
  { q: "هل يوجد شهادات؟", a: "بعض الدورات تمنح شهادة إتمام بعد اجتياز الدروس والاختبار القصير الخاص بها." },
  { q: "كيف أتواصل مع الإدارة؟", a: "عبر صفحة اتصل بنا أو البريد وتيليجرام الموجودين في أسفل الموقع." },
];

const TESTIMONIALS_FALLBACK = [
  { name: "أحمد م.", role: "طالب علم", text: "المنهج مرتب والتصميم مريح للعين. خلصت أول دورة في أسبوعين مع الالتزام اليومي." },
  { name: "مريم س.", role: "معلمة", text: "المقالات مختصرة وعميقة، والمكتبة فيها كنوز. ميزة الملاحظات ساعدتني أراجع بسرعة." },
  { name: "يوسف ع.", role: "مهندس", text: "المجالس تجربة مختلفة تمامًا. التسجيل سهل والتنظيم راقٍ والمحتوى نافع." },
];

function parseTriple(raw: string | undefined, fallback: { name: string; role: string; text: string }[]) {
  if (!raw?.trim()) return fallback;
  const list = raw.split("///").map((s) => s.trim()).filter(Boolean).map((chunk) => {
    const parts = chunk.split("||").map((p) => p.trim());
    return { name: parts[0] || "طالب", text: parts[1] || "", role: parts[2] || "عضو" };
  }).filter((x) => x.text);
  return list.length ? list : fallback;
}

function parseFaq(raw: string | undefined, fallback: { q: string; a: string }[]) {
  if (!raw?.trim()) return fallback;
  const list = raw.split("///").map((s) => s.trim()).filter(Boolean).map((chunk) => {
    const parts = chunk.split("||").map((p) => p.trim());
    return { q: parts[0] || "", a: parts[1] || "" };
  }).filter((x) => x.q && x.a);
  return list.length ? list : fallback;
}

function parseWisdom(raw: string | undefined) {
  if (!raw?.trim()) return WISDOM_FALLBACK;
  const list = raw.split("///").map((s) => s.trim()).filter(Boolean).map((chunk) => {
    const parts = chunk.split("||").map((p) => p.trim());
    return { text: parts[0] || "", source: parts[1] || "حكمة" };
  }).filter((x) => x.text);
  return list.length ? list : WISDOM_FALLBACK;
}

function useDailyWisdom(wisdomData?: string) {
  return useMemo(() => {
    const pool = parseWisdom(wisdomData);
    const day = Math.floor(Date.now() / 86400000);
    return pool[day % pool.length];
  }, [wisdomData]);
}

export function DailyWisdom({ settings }: { settings?: Pick<Settings, "showWisdom" | "wisdomTitle" | "wisdomData"> }) {
  const wisdom = useDailyWisdom(settings?.wisdomData);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    try {
      setSaved(localStorage.getItem("wisdom-saved") === wisdom.text);
    } catch { /* ignore */ }
  }, [wisdom.text]);
  const toggleSave = () => {
    try {
      if (saved) localStorage.removeItem("wisdom-saved");
      else localStorage.setItem("wisdom-saved", wisdom.text);
    } catch { /* ignore */ }
    setSaved((v) => !v);
  };
  const share = async () => {
    const shareText = `${wisdom.text} — ${wisdom.source}`;
    try {
      if (navigator.share) await navigator.share({ title: "حكمة اليوم", text: shareText });
      else await navigator.clipboard.writeText(shareText);
    } catch { /* ignore */ }
  };
  if (settings && settings.showWisdom === false) return null;
  return (
    <section className="extras-wisdom" aria-label="حكمة اليوم">
      <div className="extras-wisdom-card">
        <p className="nexus-eyebrow">{settings?.wisdomTitle || "✦ حكمة اليوم"}</p>
        <blockquote>“{wisdom.text}”</blockquote>
        <small>— {wisdom.source}</small>
        <div className="extras-wisdom-actions">
          <button type="button" onClick={toggleSave}>{saved ? "★ محفوظة" : "☆ حفظ"}</button>
          <button type="button" onClick={share}>مشاركة ↗</button>
        </div>
      </div>
    </section>
  );
}

export function StatsBand({ courses, lessons, articles, books, settings }: { courses: number; lessons: number; articles: number; books: number; settings?: Pick<Settings, "showStats"> }) {
  if (settings && settings.showStats === false) return null;
  const stats = [
    { n: courses, label: "دورة" },
    { n: lessons, label: "درس" },
    { n: articles, label: "مقال" },
    { n: books, label: "كتاب" },
  ];
  return (
    <section className="extras-stats" aria-label="إحصائيات المحتوى">
      {stats.map((s) => (
        <div key={s.label} className="extras-stat">
          <b>{s.n}</b>
          <small>{s.label}</small>
        </div>
      ))}
    </section>
  );
}

export function Testimonials({ settings }: { settings?: Pick<Settings, "showTestimonials" | "testimonialsData" | "testimonialsTitle" | "testimonialsText"> }) {
  if (settings && settings.showTestimonials === false) return null;
  const list = parseTriple(settings?.testimonialsData, TESTIMONIALS_FALLBACK);
  return (
    <section className="extras-section" aria-label="آراء الطلاب">
      <div className="nexus-section-heading compact">
        <span className="nexus-index">★</span>
        <div>
          <p className="nexus-eyebrow">قالوا عنا</p>
          <h2>{settings?.testimonialsTitle || "قصص نجاح حقيقية"}</h2>
          {settings?.testimonialsText ? <p className="admin-note">{settings.testimonialsText}</p> : null}
        </div>
      </div>
      <div className="extras-testimonials">
        {list.map((t) => (
          <article key={t.name} className="extras-testimonial">
            <p>“{t.text}”</p>
            <footer>
              <b>{t.name}</b>
              <small>{t.role}</small>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

export function FaqSection({ settings }: { settings?: Pick<Settings, "showFaqHome" | "faqHomeData" | "faqHomeTitle" | "faqHomeText"> }) {
  const [open, setOpen] = useState<number | null>(0);
  if (settings && settings.showFaqHome === false) return null;
  const list = parseFaq(settings?.faqHomeData, FAQS_FALLBACK);
  return (
    <section className="extras-section" aria-label="الأسئلة الشائعة" id="faq">
      <div className="nexus-section-heading compact">
        <span className="nexus-index">؟</span>
        <div>
          <p className="nexus-eyebrow">عندك سؤال؟</p>
          <h2>{settings?.faqHomeTitle || "الأسئلة الشائعة"}</h2>
          {settings?.faqHomeText ? <p className="admin-note">{settings.faqHomeText}</p> : null}
        </div>
        <Link href="/faq" className="nexus-inline-link">كل الأسئلة</Link>
      </div>
      <div className="extras-faq">
        {list.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className={`extras-faq-item${isOpen ? " open" : ""}`}>
              <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
                <span>{f.q}</span>
                <b>{isOpen ? "−" : "+"}</b>
              </button>
              {isOpen && <p>{f.a}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function CtaBand({ settings }: { settings?: Pick<Settings, "showCtaBanner" | "ctaTitle" | "ctaText" | "ctaPrimary" | "ctaSecondary"> }) {
  if (settings && settings.showCtaBanner === false) return null;
  return (
    <section className="extras-cta" aria-label="دعوة للبدء">
      <div>
        <p className="nexus-eyebrow">ابدأ اليوم</p>
        <h2>{settings?.ctaTitle || "خطوة واحدة تفصلك عن عادة تعلّم تدوم"}</h2>
        <p>{settings?.ctaText || "اختر درسًا قصيرًا الآن، ودوّن فائدة واحدة، وارجع غدًا لدرس جديد."}</p>
      </div>
      <div className="extras-cta-actions">
        <Link href="/courses" className="nexus-dark-button">{settings?.ctaPrimary || "تصفح الدورات"}</Link>
        <Link href="/about" className="nexus-text-link">{settings?.ctaSecondary || "تعرّف علينا"} ↓</Link>
      </div>
    </section>
  );
}

export default function HomeExtras({ counts, settings }: { counts: { courses: number; lessons: number; articles: number; books: number }; settings?: Settings }) {
  return (
    <div className="home-extras">
      <DailyWisdom settings={settings} />
      <StatsBand courses={counts.courses} lessons={counts.lessons} articles={counts.articles} books={counts.books} settings={settings} />
      <Testimonials settings={settings} />
      <FaqSection settings={settings} />
      <CtaBand settings={settings} />
    </div>
  );
}