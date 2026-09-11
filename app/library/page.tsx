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
        <CatalogHero homeLabel={settings.navHome} kicker={settings.libraryEyebrow} title={settings.libraryTitle} description={settings.libraryDesc} count={books.length} countLabel={settings.catalogCountBook} index="04" topline={settings.catalogTopline} newLabel={settings.catalogNewLabel} />
        <ContentBrowser kind="books" items={books} actionLabel={settings.libraryButton} emptyLabel={settings.searchNoResults} placeholder={settings.catalogSearchBooks} soonLabel={settings.downloadSoonLabel} />
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
