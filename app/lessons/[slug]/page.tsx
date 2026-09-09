import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteContent, findBySlug } from "@/lib/content";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ShareButtons from "@/components/ShareButtons";
import { LearningActions } from "@/components/LearningTools";
import ReadingProgress from "@/components/ReadingProgress";

export const revalidate = 0;

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const { lessons, settings } = await getSiteContent();
  const lesson = findBySlug(lessons, decodeURIComponent(slug));
  return {
    title: lesson ? `${lesson[0]} | ${settings.name}` : "الدرس غير موجود",
    description: lesson?.[1] ?? undefined,
  };
}

export default async function LessonPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const { settings, lessons } = await getSiteContent();
  const lesson = findBySlug(lessons, decodeURIComponent(slug));
  if (!lesson) notFound();
  const [title, meta, audioUrl, , , videoUrl] = lesson;

  return (
    <>
      <SiteHeader settings={settings} />
      {settings.showReadingProgress && <ReadingProgress />}
      <main className="section">
        <Link href="/lessons" className="text-button back-link">→ {settings.lessonsTitle}</Link>
        <p className="kicker">{meta}</p>
        <h1 className="page-title">{title}</h1>
        <ShareButtons title={title} />
        <LearningActions id={"lesson:" + decodeURIComponent(slug)} title={title} />
        {videoUrl ? <video controls preload="metadata" className="lesson-video"><source src={videoUrl} />متصفحك لا يدعم تشغيل الفيديو.</video> : null}
        {audioUrl ? (
          <audio controls src={audioUrl} className="lesson-audio" />
        ) : !videoUrl ? (
          <p className="detail-body">الملف الصوتي لهذا الدرس سيُضاف قريبًا بإذن الله.</p>
        ) : null}
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
