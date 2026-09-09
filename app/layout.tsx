import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { getSiteContent } from "@/lib/content";

const description = "منصة عربية للعلم النافع والدروس والمجالس والمكتبة.";

export const metadata: Metadata = {
  metadataBase: new URL("https://ismail-site-two.vercel.app"),
  title: "أكاديمية إسماعيل أحمد نجيب",
  description,
  openGraph: {
    title: "أكاديمية إسماعيل أحمد نجيب",
    description,
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "أكاديمية إسماعيل أحمد نجيب",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#173a35",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { settings } = await getSiteContent();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: settings.name,
    description: settings.tagline,
    url: "https://ismail-site-two.vercel.app",
  };
  return (
    <html lang="ar" dir="rtl">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
