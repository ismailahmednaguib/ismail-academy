import type { Metadata, Viewport } from "next";
import type { CSSProperties, ReactNode } from "react";
import "./globals.css";
import "./owner.css";
import "./premium.css";
import "./pages-premium.css";
import "./world.css";
import "./platform.css";
import "./final.css";
import "./redesign.css";
import "./ultimate.css";
import "./owner-console.css";
import "./design.css";
import "./nexus-pages.css";
import "./responsive-polish.css";
import "./quality-pass.css";
import "./enhancements.css";
import "./design.css";
import { getSiteContent, getSiteUrl } from "@/lib/content";
import PwaRegister from "@/components/PwaRegister";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import ScrollProgress from "@/components/ScrollProgress";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteContent();
  const description = settings.seoDescription || settings.heroText || "منصة عربية للعلم النافع والدروس والمجالس والمكتبة.";
  const title = settings.seoTitle || settings.name;
  const siteUrl = getSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || settings.canonicalUrl);
  const keywords = settings.seoKeywords.split(",").map((item) => item.trim()).filter(Boolean);
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      locale: "ar_EG",
      alternateLocale: ["en_US"],
      type: "website",
      images: [{ url: "/opengraph-image" }],
    },
    alternates: {
      canonical: settings.canonicalUrl || "/",
      languages: { ar: "/", en: "/?lang=en" },
    },
    keywords: keywords.length ? keywords : ["أكاديمية", "علم نافع"],
    authors: [{ name: settings.name }],
    creator: settings.name,
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#173a35",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { settings } = await getSiteContent();
  const isHex = (value: string) => /^#[0-9a-fA-F]{6}$/.test(value);
  const themeStyle = {
    "--ink": isHex(settings.inkColor) ? settings.inkColor : "#173a35",
    "--gold": isHex(settings.goldColor) ? settings.goldColor : "#b8893e",
    "--gold2": isHex(settings.goldSoftColor) ? settings.goldSoftColor : "#e4c888",
    "--accent": isHex(settings.accentColor) ? settings.accentColor : "#ef9a78",
    "--accent2": isHex(settings.accentSoftColor) ? settings.accentSoftColor : "#f6c7aa",
    "--paper": isHex(settings.paperColor) ? settings.paperColor : "#fbfaf5",
    "--cream": isHex(settings.creamColor) ? settings.creamColor : "#f3f0e6",
    "--sage": isHex(settings.sageColor) ? settings.sageColor : "#dce9df",
  } as CSSProperties;
  const siteUrl = getSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || settings.canonicalUrl);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: settings.name,
    description: settings.tagline,
    url: siteUrl,
    inLanguage: ["ar", "en"],
    areaServed: "Worldwide",
  };
  const safeJsonLd = JSON.stringify(jsonLd).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body style={themeStyle} data-density={settings.siteDensity} data-layout={settings.layoutStyle} data-corners={settings.cornerStyle} data-buttons={settings.buttonStyle} data-theme={settings.colorMode}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd }}
        />
        <ScrollProgress />
        <PwaRegister />
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
