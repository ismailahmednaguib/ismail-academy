import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MemberDashboard from "@/components/MemberDashboard";
import { getSiteContent, slugify } from "@/lib/content";

export const metadata: Metadata = { title: "مساحتي التعليمية", description: "تابع المحتوى المحفوظ ونسبة إنجازك في الأكاديمية." };

export default async function AccountPage() {
  const { settings, courses, lessons, articles } = await getSiteContent();
  const items = [
    ...courses.map(([title]) => ({ id: `course:${slugify(title)}`, title, href: `/courses/${encodeURIComponent(slugify(title))}`, kind: "دورة" })),
    ...lessons.map(([title]) => ({ id: `lesson:${slugify(title)}`, title, href: `/lessons/${encodeURIComponent(slugify(title))}`, kind: "درس" })),
    ...articles.map(([title]) => ({ id: `article:${slugify(title)}`, title, href: `/articles/${encodeURIComponent(slugify(title))}`, kind: "مقال" })),
  ];
  return <><SiteHeader settings={settings} /><main id="main" className="page-shell account-page"><MemberDashboard items={items} /></main><SiteFooter settings={settings} /></>;
}

