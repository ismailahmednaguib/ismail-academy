import Link from "next/link";
import type { Metadata } from "next";
import { getSiteContent, slugify } from "@/lib/content";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteContent();
  return {
    title: "الدروس | " + settings.name,
    description: "كل الدروس الصوتية القصيرة في الأكاديمية.",
  };
}

export default async function LessonsPage() {
  const { settings, lessons } = await getSiteContent();
  return (
    <>
      <SiteHeader settings={settings} />
      <main className="section">
        <Link href="/" className="text-button back-link">→ {settings.navHome}</Link>
        <div className="section-head">
          <div>
            <p className="kicker">{settings.lessonsEyebrow}</p>
            <h1 className="page-title">{settings.lessonsTitle}</h1>
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
