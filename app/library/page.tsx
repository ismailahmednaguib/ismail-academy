import Link from "next/link";
import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "المكتبة | أكاديمية إسماعيل أحمد نجيب",
  description: "ملفات PDF مختارة للقراءة الهادئة والطباعة والمراجعة.",
};

export default async function LibraryPage() {
  const { settings, books } = await getSiteContent();
  return (
    <>
      <SiteHeader settings={settings} />
      <main className="section">
        <Link href="/" className="text-button back-link">→ الرئيسية</Link>
        <div className="section-head">
          <div>
            <p className="kicker">مكتبة نافعة</p>
            <h1 className="page-title">ملفات تعود إليها</h1>
          </div>
        </div>
        <div className="book-list">
          {books.map(([title, meta, fileUrl]) => (
            <article key={title}>
              <span>PDF</span>
              <div>
                <b>{title}</b>
                <small>{meta}</small>
              </div>
              {fileUrl ? (
                <a href={fileUrl} download aria-label={`تحميل ${title}`}>↓</a>
              ) : (
                <span className="coming-soon" title="سيتم إضافة الملف قريبًا">↓</span>
              )}
            </article>
          ))}
        </div>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
