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
import "./pulse-pages.css";
import "./nexus.css";
import { getSiteContent } from "@/lib/content";
import PwaRegister from "@/components/PwaRegister";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteContent();
  const description = settings.heroText || "منصة عربية للعلم النافع والدروس والمجالس والمكتبة.";
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ismailahmednaguib.vercel.app"),
    title: settings.name,
    description,
    openGraph: {
      title: settings.name,
      description,
      locale: "ar_EG",
      alternateLocale: ["en_US"],
      type: "website",
    },
    alternates: {
      canonical: "/",
      languages: { ar: "/", en: "/?lang=en" },
    },
    keywords: ["Islamic learning", "Arabic education", "online academy", "أكاديمية", "علم نافع"],
    authors: [{ name: settings.name }],
    creator: settings.name,
    twitter: {
      card: "summary_large_image",
      title: settings.name,
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: settings.name,
    description: settings.tagline,
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://ismailahmednaguib.vercel.app",
    inLanguage: ["ar", "en"],
    areaServed: "Worldwide",
  };
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body style={themeStyle} data-density={settings.siteDensity} data-layout={settings.layoutStyle} data-corners={settings.cornerStyle} data-buttons={settings.buttonStyle} data-theme={settings.colorMode}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PwaRegister />
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
