import Link from "next/link";
import type { Metadata } from "next";
import { getSiteContent, slugify } from "@/lib/content";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteContent();
  return {
    title: "المقالات | " + settings.name,
    description: "مقالات قصيرة في المنهجية والتزكية والقراءة النافعة.",
  };
}

export default async function ArticlesPage() {
  const { settings, articles } = await getSiteContent();
  return (
    <>
      <SiteHeader settings={settings} />
      <main className="section">
        <Link href="/" className="text-button back-link">→ {settings.navHome}</Link>
        <div className="section-head">
          <div>
            <p className="kicker">{settings.articlesEyebrow}</p>
            <h1 className="page-title">{settings.articlesTitle}</h1>
          </div>
        </div>
        <div className="article-grid">
          {articles.map(([title, cat, time, , cover], i) => (
            <article key={`article-${i}`}>
              <div className={`article-art art-${i % 3}${cover ? " has-cover" : ""}`} style={cover ? { backgroundImage: `url(${cover})` } : undefined} role={cover ? "img" : undefined} aria-label={cover ? title : undefined}>
                {cover ? null : "✦"}
              </div>
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
