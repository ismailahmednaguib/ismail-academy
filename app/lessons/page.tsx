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
    title: "الدروس | " + settings.name,
    description: "كل الدروس الصوتية القصيرة في الأكاديمية.",
  };
}

export default async function LessonsPage() {
  const { settings, lessons } = await getSiteContent();
  return (
    <>
      <SiteHeader settings={settings} />
      <main className="section catalog-page">
        <CatalogHero homeLabel={settings.navHome} kicker={settings.lessonsEyebrow} title={settings.lessonsTitle} description={settings.lessonsDesc} count={lessons.length} countLabel={settings.catalogCountLesson} index="02" topline={settings.catalogTopline} newLabel={settings.catalogNewLabel} />
        <ContentBrowser kind="lessons" items={lessons} actionLabel={settings.listenLabel} emptyLabel={settings.searchNoResults} placeholder={settings.catalogSearchLessons} soonLabel={settings.downloadSoonLabel} />
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
