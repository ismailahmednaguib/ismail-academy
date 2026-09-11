import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteContent, getSiteUrl, slugify, findBySlug } from "@/lib/content";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ShareButtons from "@/components/ShareButtons";
import { LearningActions } from "@/components/LearningTools";
import ReadingProgress from "@/components/ReadingProgress";
import CourseProgress from "@/components/CourseProgress";
import CourseCertificate from "@/components/CourseCertificate";
import StructuredData from "@/components/StructuredData";
import FocusModeToggle from "@/components/FocusModeToggle";

export const revalidate = 0;

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const { courses, settings } = await getSiteContent();
  const course = findBySlug(courses, decodeURIComponent(slug));
  const url = `${getSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || settings.canonicalUrl)}/courses/${encodeURIComponent(slug)}`;
  return {
    title: course ? `${course[0]} | ${settings.name}` : "الدورة غير موجودة",
    description: course?.[1] ?? undefined,
    alternates: { canonical: url },
    openGraph: course ? { title: course[0], description: course[1], type: "website", url, images: [{ url: "/opengraph-image" }] } : undefined,
  };
}

export default async function CoursePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const { settings, courses, lessons } = await getSiteContent();
  const course = findBySlug(courses, decodeURIComponent(slug));
  if (!course) notFound();
  const [title, desc, count, level] = course;
  const relatedLessons = lessons.filter(([, meta, , courseTitle]) => courseTitle ? slugify(courseTitle) === slugify(title) : meta.includes(title));
  const recommendations = courses.filter(([candidateTitle, , , candidateLevel]) => candidateTitle !== title && candidateLevel === level).slice(0, 3);

  return (
    <>
      <SiteHeader settings={settings} />
      <StructuredData data={{ "@context": "https://schema.org", "@type": "Course", name: title, description: desc, provider: { "@type": "EducationalOrganization", name: settings.name }, educationalLevel: level, inLanguage: "ar" }} />
      {settings.showReadingProgress && <ReadingProgress />}
      <main className="section">
        <Link href="/courses" className="text-button back-link">→ {settings.coursesTitle}</Link>
        <div className="badge-row">
          <span className="badge">{level}</span>
          <span className="kicker">{count}</span>
        </div>
        <h1 className="page-title">{title}</h1>
        <div className="detail-tools"><ShareButtons title={title} /><FocusModeToggle /></div>
        <LearningActions id={"course:" + decodeURIComponent(slug)} title={title} />
        <CourseProgress lessonIds={relatedLessons.map(([lessonTitle]) => "lesson:" + slugify(lessonTitle))} />
        <CourseCertificate courseTitle={title} lessonIds={relatedLessons.map(([lessonTitle]) => "lesson:" + slugify(lessonTitle))} />
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
        {recommendations.length > 0 && <section className="recommendations"><div className="section-head"><div><p className="kicker">قد يناسبك أيضًا</p><h2>مسارات قريبة من رحلتك</h2></div></div><div className="recommendation-grid">{recommendations.map(([candidateTitle, candidateDesc, candidateCount, candidateLevel]) => <Link href={`/courses/${encodeURIComponent(slugify(candidateTitle))}`} className="recommendation-card" key={candidateTitle}><span>{candidateLevel}</span><b>{candidateTitle}</b><small>{candidateDesc}</small><i>{candidateCount} ←</i></Link>)}</div></section>}
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
