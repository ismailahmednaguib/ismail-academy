import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteContent, getSiteUrl, findBySlug, safeImageUrl } from "@/lib/content";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ShareButtons from "@/components/ShareButtons";
import { LearningActions } from "@/components/LearningTools";
import ReadingProgress from "@/components/ReadingProgress";
import MemberNotes from "@/components/MemberNotes";
import StructuredData from "@/components/StructuredData";

export const revalidate = 0;

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const { articles, settings } = await getSiteContent();
  const article = findBySlug(articles, decodeURIComponent(slug));
  const url = `${getSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || settings.canonicalUrl)}/articles/${encodeURIComponent(slug)}`;
  return {
    title: article ? `${article[0]} | ${settings.name}` : "المقال غير موجود",
    description: article?.[3]?.slice(0, 160) ?? undefined,
    alternates: { canonical: url },
    openGraph: article ? { title: article[0], description: article[3]?.slice(0, 160), type: "article", url, images: [{ url: safeImageUrl(article[4]) || "/opengraph-image" }] } : undefined,
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const { settings, articles } = await getSiteContent();
  const article = findBySlug(articles, decodeURIComponent(slug));
  if (!article) notFound();
  const [title, cat, time, body, cover] = article;
  const coverImage = safeImageUrl(cover);
  // فقرات المقال متفصولة في لوحة المالك بعلامة \n حرفية
  const paragraphs = (body ?? "").split(/\\n|\r?\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <>
      <SiteHeader settings={settings} />
      <StructuredData data={{ "@context": "https://schema.org", "@type": "Article", headline: title, articleSection: cat, timeRequired: time, description: paragraphs.join(" ").slice(0, 160), author: { "@type": "Organization", name: settings.name }, inLanguage: "ar" }} />
      {settings.showReadingProgress && <ReadingProgress />}
      <main className="section">
        <Link href="/articles" className="text-button back-link">→ {settings.articlesTitle}</Link>
        <p className="kicker">
          {cat} · {time}
        </p>
        <h1 className="page-title">{title}</h1>
        <ShareButtons title={title} />
        <LearningActions id={"article:" + decodeURIComponent(slug)} title={title} />
        {coverImage ? <div className="article-cover" style={{ backgroundImage: `url(${coverImage})` }} role="img" aria-label={title} /> : null}
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
