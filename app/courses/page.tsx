import Link from "next/link";
import type { Metadata } from "next";
import { getSiteContent, slugify } from "@/lib/content";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteContent();
  return {
    title: "الدورات | " + settings.name,
    description: "تصفح كل المسارات التعليمية في الأكاديمية.",
  };
}

export default async function CoursesPage() {
  const { settings, courses } = await getSiteContent();
  return (
    <>
      <SiteHeader settings={settings} />
      <main className="section">
        <Link href="/" className="text-button back-link">→ {settings.navHome}</Link>
        <div className="section-head">
          <div>
            <p className="kicker">{settings.coursesEyebrow}</p>
            <h1 className="page-title">{settings.coursesTitle}</h1>
          </div>
        </div>
        <div className="course-grid">
          {courses.map(([title, desc, count, level, num]) => (
            <article className="course-card" key={title}>
              <div className="course-number">{num}</div>
              <span className="badge">{level}</span>
              <h3>
                <Link href={`/courses/${encodeURIComponent(slugify(title))}`}>{title}</Link>
              </h3>
              <p>{desc}</p>
              <footer>
                <span>{count}</span>
                <Link href={`/courses/${encodeURIComponent(slugify(title))}`} aria-label={`فتح ${title}`}>←</Link>
              </footer>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
