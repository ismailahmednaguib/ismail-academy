import Link from "next/link";
import type { Metadata } from "next";
import { getSiteContent, slugify } from "@/lib/content";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "المقالات | أكاديمية إسماعيل أحمد نجيب",
  description: "مقالات قصيرة في المنهجية والتزكية والقراءة النافعة.",
};

export default async function ArticlesPage() {
  const { settings, articles } = await getSiteContent();
  return (
    <>
      <SiteHeader settings={settings} />
      <main className="section">
        <Link href="/" className="text-button back-link">→ الرئيسية</Link>
        <div className="section-head">
          <div>
            <p className="kicker">اقرأ بتأنٍّ</p>
            <h1 className="page-title">كل المقالات</h1>
          </div>
        </div>
        <div className="article-grid">
          {articles.map(([title, cat, time], i) => (
            <article key={title}>
              <div className={`article-art art-${i % 3}`}>✦</div>
              <small>
                {cat} · {time}
              </small>
              <h3>{title}</h3>
              <Link href={`/articles/${encodeURIComponent(slugify(title))}`}>اقرأ المقال ←</Link>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
