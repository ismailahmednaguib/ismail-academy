import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteContent, findBySlug } from "@/lib/content";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 60;

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const { lessons } = await getSiteContent();
  const lesson = findBySlug(lessons, decodeURIComponent(slug));
  return {
    title: lesson ? `${lesson[0]} | أكاديمية إسماعيل أحمد نجيب` : "الدرس غير موجود",
    description: lesson?.[1] ?? undefined,
  };
}

export default async function LessonPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const { settings, lessons } = await getSiteContent();
  const lesson = findBySlug(lessons, decodeURIComponent(slug));
  if (!lesson) notFound();
  const [title, meta, audioUrl] = lesson;

  return (
    <>
      <SiteHeader settings={settings} />
      <main className="section">
        <Link href="/lessons" className="text-button back-link">→ كل الدروس</Link>
        <p className="kicker">{meta}</p>
        <h1 className="page-title">{title}</h1>
        {audioUrl ? (
          <audio controls src={audioUrl} className="lesson-audio" />
        ) : (
          <p className="detail-body">الملف الصوتي لهذا الدرس سيُضاف قريبًا بإذن الله.</p>
        )}
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
