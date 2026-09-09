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
  const { articles } = await getSiteContent();
  const article = findBySlug(articles, decodeURIComponent(slug));
  return {
    title: article ? `${article[0]} | أكاديمية إسماعيل أحمد نجيب` : "المقال غير موجود",
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const { settings, articles } = await getSiteContent();
  const article = findBySlug(articles, decodeURIComponent(slug));
  if (!article) notFound();
  const [title, cat, time, body] = article;
  // فقرات المقال متفصولة في لوحة المالك بعلامة \n حرفية
  const paragraphs = (body ?? "").split("\\n").map((p) => p.trim()).filter(Boolean);

  return (
    <>
      <SiteHeader settings={settings} />
      <main className="section">
        <Link href="/articles" className="text-button back-link">→ كل المقالات</Link>
        <p className="kicker">
          {cat} · {time}
        </p>
        <h1 className="page-title">{title}</h1>
        {paragraphs.length > 0 ? (
          <div className="article-body">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ) : (
          <p className="detail-body">نص المقال الكامل سيُضاف قريبًا بإذن الله.</p>
        )}
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
