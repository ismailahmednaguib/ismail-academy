import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteContent, slugify, findBySlug } from "@/lib/content";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 60;

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const { courses } = await getSiteContent();
  const course = findBySlug(courses, decodeURIComponent(slug));
  return {
    title: course ? `${course[0]} | أكاديمية إسماعيل أحمد نجيب` : "الدورة غير موجودة",
    description: course?.[1] ?? undefined,
  };
}

export default async function CoursePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const { settings, courses, lessons } = await getSiteContent();
  const course = findBySlug(courses, decodeURIComponent(slug));
  if (!course) notFound();
  const [title, desc, count, level] = course;
  const relatedLessons = lessons.filter(([, meta]) => meta.includes(title));

  return (
    <>
      <SiteHeader settings={settings} />
      <main className="section">
        <Link href="/courses" className="text-button back-link">→ كل الدورات</Link>
        <div className="badge-row">
          <span className="badge">{level}</span>
          <span className="kicker">{count}</span>
        </div>
        <h1 className="page-title">{title}</h1>
        <p className="detail-body">{desc}</p>

        {relatedLessons.length > 0 && (
          <div className="course-lessons">
            <div className="section-head">
              <div>
                <p className="kicker">دروس هذا المسار</p>
                <h2>{relatedLessons.length} دروس</h2>
              </div>
            </div>
            <div className="lesson-list">
              {relatedLessons.map(([lt, meta], i) => (
                <article key={lt}>
                  <span>0{i + 1}</span>
                  <div>
                    <b>{lt}</b>
                    <small>{meta}</small>
                  </div>
                  <Link href={`/lessons/${encodeURIComponent(slugify(lt))}`}>استمع ←</Link>
                </article>
              ))}
            </div>
          </div>
        )}
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
