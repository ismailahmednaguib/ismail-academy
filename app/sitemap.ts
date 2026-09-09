import type { MetadataRoute } from "next";
import { getSiteContent, slugify } from "@/lib/content";

const base = "https://ismail-site-two.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { courses, lessons, articles } = await getSiteContent();

  const staticRoutes: MetadataRoute.Sitemap = ["", "/courses", "/lessons", "/articles", "/library"].map(
    (path) => ({ url: `${base}${path}`, lastModified: new Date() })
  );

  const courseRoutes: MetadataRoute.Sitemap = courses.map(([title]) => ({
    url: `${base}/courses/${encodeURIComponent(slugify(title))}`,
    lastModified: new Date(),
  }));

  const lessonRoutes: MetadataRoute.Sitemap = lessons.map(([title]) => ({
    url: `${base}/lessons/${encodeURIComponent(slugify(title))}`,
    lastModified: new Date(),
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map(([title]) => ({
    url: `${base}/articles/${encodeURIComponent(slugify(title))}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...courseRoutes, ...lessonRoutes, ...articleRoutes];
}
