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
    title: "المقالات | " + settings.name,
    description: "مقالات قصيرة في المنهجية والتزكية والقراءة النافعة.",
  };
}

export default async function ArticlesPage() {
  const { settings, articles } = await getSiteContent();
  return (
    <>
      <SiteHeader settings={settings} />
      <main className="section catalog-page">
        <CatalogHero homeLabel={settings.navHome} kicker={settings.articlesEyebrow} title={settings.articlesTitle} description="قراءات مركزة تمنحك زاوية جديدة، وتترك لك مساحة للتأمل والعودة إليها وقتما تحب." count={articles.length} countLabel="مقال منشور" index="03" />
        <ContentBrowser kind="articles" items={articles} actionLabel={settings.readArticleLabel} emptyLabel={settings.searchNoResults} placeholder="ابحث في المقالات أو التصنيفات..." soonLabel={settings.downloadSoonLabel} />
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
