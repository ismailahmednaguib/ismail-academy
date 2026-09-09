import Link from "next/link";
import type { Metadata } from "next";
import { getSiteContent, slugify } from "@/lib/content";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 0;

type SearchParams = { q?: string };

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteContent();
  return {
    title: "البحث | " + settings.name,
    description: "ابحث في الدورات والدروس والمقالات والكتب.",
  };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { settings, courses, lessons, articles, books } = await getSiteContent();
  const { q = "" } = await searchParams;
  const query = q.trim();
  const needle = query.toLocaleLowerCase("ar");
  const results = [
    ...courses.map(([title, description, count, level]) => ({
      title,
      meta: "دورة · " + level + " · " + count,
      text: title + " " + description,
      href: "/courses/" + encodeURIComponent(slugify(title)),
    })),
    ...lessons.map(([title, meta]) => ({
      title,
      meta: "درس صوتي · " + meta,
      text: title + " " + meta,
      href: "/lessons/" + encodeURIComponent(slugify(title)),
    })),
    ...articles.map(([title, category, time, body]) => ({
      title,
      meta: "مقال · " + category + " · " + time,
      text: title + " " + category + " " + (body ?? ""),
      href: "/articles/" + encodeURIComponent(slugify(title)),
    })),
    ...books.map(([title, meta]) => ({
      title,
      meta: "كتاب وملف · " + meta,
      text: title + " " + meta,
      href: "/library",
    })),
  ].filter((item) => needle && item.text.toLocaleLowerCase("ar").includes(needle));

  return (
    <>
      <SiteHeader settings={settings} />
      <main className="section search-page">
        <Link href="/" className="text-button back-link">→ الرئيسية</Link>
        <p className="kicker">محرك المعرفة</p>
        <h1 className="page-title">ابحث في محتوى الأكاديمية</h1>
        <p className="detail-body">اكتب كلمة أو عنوانًا للوصول السريع إلى الدورات والدروس والمقالات والملفات.</p>
        <form className="search-page-form" method="get">
          <input name="q" defaultValue={query} placeholder={settings.searchPlaceholder} aria-label={settings.searchPlaceholder} autoFocus />
          <button className="primary">بحث</button>
        </form>
        {query ? (
          <section className="search-page-results" aria-live="polite">
            <div className="section-head"><h2>{results.length} نتيجة للبحث عن «{query}»</h2></div>
            {results.length ? results.map((item, index) => (
              <Link className="search-result-card" href={item.href} key={item.href + "-" + index}>
                <span>0{index + 1}</span>
                <div><b>{item.title}</b><small>{item.meta}</small></div>
                <strong>←</strong>
              </Link>
            )) : <div className="empty-state"><b>{settings.searchNoResults}</b><span>جرّب كلمة أقصر أو ابحث بعنوان مختلف.</span></div>}
          </section>
        ) : <div className="search-hint">ابدأ بكلمة مثل: دورة، تدبر، قراءة، أو طلب العلم.</div>}
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
