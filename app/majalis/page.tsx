import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MajlisPage from "@/components/MajlisPage";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteContent();
  return { title: "المجلس | " + settings.name, description: settings.majlisText };
}

export default async function MajalisPage() {
  const { settings } = await getSiteContent();
  return <><SiteHeader settings={settings} /><MajlisPage settings={settings} /><SiteFooter settings={settings} /></>;
}
