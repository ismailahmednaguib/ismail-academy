import Link from "next/link";
import type { Metadata } from "next";
import { getSiteContent, slugify } from "@/lib/content";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "الدروس | أكاديمية إسماعيل أحمد نجيب",
  description: "كل الدروس الصوتية القصيرة في الأكاديمية.",
};

export default async function LessonsPage() {
  const { settings, lessons } = await getSiteContent();
  return (
    <>
      <SiteHeader settings={settings} />
      <main className="section">
        <Link href="/" className="text-button back-link">→ الرئيسية</Link>
        <div className="section-head">
          <div>
            <p className="kicker">تعلّم بخطوات قصيرة</p>
            <h1 className="page-title">كل الدروس</h1>
          </div>
        </div>
        <div className="lesson-list">
          {lessons.map(([title, meta], i) => (
            <article key={`${title}-${i}`}>
              <span>0{i + 1}</span>
              <div>
                <b>{title}</b>
                <small>{meta}</small>
              </div>
              <Link href={`/lessons/${encodeURIComponent(slugify(title))}`}>استمع ←</Link>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
