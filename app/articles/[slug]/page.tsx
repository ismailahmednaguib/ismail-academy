import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteContent, findBySlug } from "@/lib/content";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ShareButtons from "@/components/ShareButtons";
import { LearningActions } from "@/components/LearningTools";
import ReadingProgress from "@/components/ReadingProgress";
import MemberNotes from "@/components/MemberNotes";

export const revalidate = 0;

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const { articles, settings } = await getSiteContent();
  const article = findBySlug(articles, decodeURIComponent(slug));
  return {
    title: article ? `${article[0]} | ${settings.name}` : "المقال غير موجود",
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const { settings, articles } = await getSiteContent();
  const article = findBySlug(articles, decodeURIComponent(slug));
  if (!article) notFound();
  const [title, cat, time, body, cover] = article;
  // فقرات المقال متفصولة في لوحة المالك بعلامة \n حرفية
  const paragraphs = (body ?? "").split(/\\n|\r?\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <>
      <SiteHeader settings={settings} />
      {settings.showReadingProgress && <ReadingProgress />}
      <main className="section">
        <Link href="/articles" className="text-button back-link">→ {settings.articlesTitle}</Link>
        <p className="kicker">
          {cat} · {time}
        </p>
        <h1 className="page-title">{title}</h1>
        <ShareButtons title={title} />
        <LearningActions id={"article:" + decodeURIComponent(slug)} title={title} />
        {cover ? <div className="article-cover" style={{ backgroundImage: `url(${cover})` }} role="img" aria-label={title} /> : null}
        {paragraphs.length > 0 ? (
          <div className="article-body">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ) : (
          <p className="detail-body">نص المقال الكامل سيُضاف قريبًا بإذن الله.</p>
        )}
        <MemberNotes contentId={"article:" + decodeURIComponent(slug)} />
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
