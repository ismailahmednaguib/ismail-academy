import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = { title: "سياسة الخصوصية", description: "كيف نتعامل مع بياناتك في الأكاديمية." };

export default function PrivacyPage() {
  return (
    <div className="static-page">
      <Breadcrumbs items={[{ label: "سياسة الخصوصية" }]} />
      <div className="static-hero">
        <p className="nexus-eyebrow">شفافية</p>
        <h1>سياسة الخصوصية</h1>
        <p>نحترم بياناتك ولا نبيعها أبدًا. هذه الصفحة توضح ما نجمعه ولماذا.</p>
      </div>
      <div className="static-card">
        <h2>ما الذي نجمعه؟</h2>
        <p>• البريد عند الاشتراك في النشرة أو إنشاء حساب.<br />• بيانات التقدم والملاحظات المحفوظة محليًا وفي حسابك.<br />• إحصائيات زيارة مجهولة لتحسين المحتوى.</p>
      </div>
      <div className="static-card">
        <h2>كيف نستخدمها؟</h2>
        <p>لإرسال الجديد، وحفظ تقدمك، وتحسين تجربة التعلم. لا نشارك بياناتك مع أطراف خارجية لأغراض تسويقية.</p>
      </div>
      <div className="static-card">
        <h2>حقوقك</h2>
        <p>يمكنك طلب حذف حسابك وبياناتك في أي وقت عبر صفحة اتصل بنا. يمكنك أيضًا مسح البيانات المحلية من إعدادات المتصفح.</p>
      </div>
    </div>
  );
}