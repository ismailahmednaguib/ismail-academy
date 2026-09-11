import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteContent, getSiteUrl, findBySlug, slugify } from "@/lib/content";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ShareButtons from "@/components/ShareButtons";
import { LearningActions } from "@/components/LearningTools";
import ReadingProgress from "@/components/ReadingProgress";
import MediaPlayer from "@/components/MediaPlayer";
import MemberNotes from "@/components/MemberNotes";
import LessonQuiz from "@/components/LessonQuiz";
import StructuredData from "@/components/StructuredData";
import FocusModeToggle from "@/components/FocusModeToggle";
import RelatedContent from "@/components/RelatedContent";

export const revalidate = 0;

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const { lessons, settings } = await getSiteContent();
  const lesson = findBySlug(lessons, decodeURIComponent(slug));
  const url = `${getSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || settings.canonicalUrl)}/lessons/${encodeURIComponent(slug)}`;
  return {
    title: lesson ? `${lesson[0]} | ${settings.name}` : "الدرس غير موجود",
    description: lesson?.[1] ?? undefined,
    alternates: { canonical: url },
    openGraph: lesson ? { title: lesson[0], description: lesson[1], type: "website", url, images: [{ url: "/opengraph-image" }] } : undefined,
  };
}

export default async function LessonPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const { settings, lessons, articles, courses } = await getSiteContent();
  const lesson = findBySlug(lessons, decodeURIComponent(slug));
  if (!lesson) notFound();
  const [title, meta, audioUrl, , , videoUrl, quiz] = lesson;
  const lessonCourse = lesson[3] ? courses.find(([courseTitle]) => courseTitle === lesson[3]) : undefined;
  const relatedLessons = lessons.filter(([candidateTitle, , , courseTitle]) => candidateTitle !== title && lessonCourse && courseTitle === lessonCourse[0]).slice(0, 2);
  const relatedArticles = articles.slice(0, 2);

  return (
    <>
      <SiteHeader settings={settings} />
      <StructuredData data={{ "@context": "https://schema.org", "@type": "LearningResource", name: title, description: meta, learningResourceType: "Lesson", isPartOf: { "@type": "EducationalOrganization", name: settings.name }, inLanguage: "ar" }} />
      {settings.showReadingProgress && <ReadingProgress contentId={`lesson:${decodeURIComponent(slug)}`} />}
      <main className="section">
        <Link href="/lessons" className="text-button back-link">→ {settings.lessonsTitle}</Link>
        <p className="kicker">{meta}</p>
        <h1 className="page-title">{title}</h1>
        <div className="detail-tools"><ShareButtons title={title} /><FocusModeToggle /></div>
        <LearningActions id={"lesson:" + decodeURIComponent(slug)} title={title} />
        {videoUrl ? <MediaPlayer src={videoUrl} contentId={"lesson:" + decodeURIComponent(slug) + ":video"} kind="video" /> : null}
        {audioUrl ? (
          <MediaPlayer src={audioUrl} contentId={"lesson:" + decodeURIComponent(slug) + ":audio"} kind="audio" />
        ) : !videoUrl ? (
          <p className="detail-body">الملف الصوتي لهذا الدرس سيُضاف قريبًا بإذن الله.</p>
        ) : null}
        <MemberNotes contentId={"lesson:" + decodeURIComponent(slug)} />
        <LessonQuiz definition={quiz} />
        <RelatedContent enabled={settings.showRelatedContent} eyebrow={settings.detailRelatedEyebrow} title={settings.detailRelatedTitle} text={settings.detailRelatedText} items={[...relatedLessons.map(([lessonTitle, lessonMeta]) => ({ href: `/lessons/${encodeURIComponent(slugify(lessonTitle))}`, title: lessonTitle, meta: lessonMeta, kind: "درس قريب" })), ...relatedArticles.map(([articleTitle, category, time]) => ({ href: `/articles/${encodeURIComponent(slugify(articleTitle))}`, title: articleTitle, meta: `${category} · ${time}`, kind: "قراءة مقترحة" }))]} />
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
