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
    title: "الدورات | " + settings.name,
    description: "تصفح كل المسارات التعليمية في الأكاديمية.",
  };
}

export default async function CoursesPage() {
  const { settings, courses } = await getSiteContent();
  return (
    <>
      <SiteHeader settings={settings} />
      <main className="section catalog-page">
        <CatalogHero homeLabel={settings.navHome} kicker={settings.coursesEyebrow} title={settings.coursesTitle} description={settings.coursesDesc} count={courses.length} countLabel={settings.catalogCountCourse} index="01" topline={settings.catalogTopline} newLabel={settings.catalogNewLabel} />
        <ContentBrowser kind="courses" items={courses} actionLabel={settings.coursesLink} emptyLabel={settings.searchNoResults} placeholder={settings.catalogSearchCourses} soonLabel={settings.downloadSoonLabel} />
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
