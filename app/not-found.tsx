import Link from "next/link";
import { getSiteContent } from "@/lib/content";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default async function NotFound() {
  const { settings } = await getSiteContent();
  return (
    <>
      <SiteHeader settings={settings} />
      <main className="not-found">
        <p className="kicker">٤٠٤</p>
        <h1 className="page-title">الصفحة غير موجودة</h1>
        <p className="detail-body">
          يبدو أن الرابط الذي وصلت إليه غير صحيح أو أن المحتوى تم نقله.
        </p>
        <Link href="/" className="primary">العودة للرئيسية ←</Link>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
