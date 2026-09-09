import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ContentBrowser from "@/components/ContentBrowser";
import CatalogHero from "@/components/CatalogHero";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteContent();
  return {
    title: "المكتبة | " + settings.name,
    description: "ملفات PDF مختارة للقراءة الهادئة والطباعة والمراجعة.",
  };
}

export default async function LibraryPage() {
  const { settings, books } = await getSiteContent();
  return (
    <>
      <SiteHeader settings={settings} />
      <main className="section catalog-page">
        <CatalogHero homeLabel={settings.navHome} kicker={settings.libraryEyebrow} title={settings.libraryTitle} description="رف هادئ للكتب والملفات التي تستحق أن تحفظها، تقرأها، وتعود إليها وقت الحاجة." count={books.length} countLabel="كتاب وملف" index="04" />
        <ContentBrowser kind="books" items={books} actionLabel={settings.libraryButton} emptyLabel={settings.searchNoResults} placeholder="ابحث باسم الكتاب أو الوصف..." soonLabel={settings.downloadSoonLabel} />
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
