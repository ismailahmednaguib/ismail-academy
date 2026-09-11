import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${getSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)}/sitemap.xml`,
  };
}
