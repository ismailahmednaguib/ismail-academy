"use client";
import type { ReactNode } from "react";
import type { Settings } from "@/lib/content";

type Props = { settings: Settings; setSettings: (v: Settings) => void; setNotice: (v: string) => void };

function Row({ label, children }: { label: string; children: ReactNode }) {
  return <label className="owner-field">{label}{children}</label>;
}

export default function OwnerRenewalPanel({ settings, setSettings, setNotice }: Props) {
  const set = (k: keyof Settings, v: string | boolean) => setSettings({ ...settings, [k]: v });
  const toggle = (k: keyof Settings) => setSettings({ ...settings, [k]: !Boolean(settings[k]) });

  return (
    <div className="owner-renewal">
      <section className="owner-section">
        <h3>✨ التجديد الشامل — تتحكم في كل حاجة من هنا</h3>
        <p className="admin-note">أي تغيير هنا يظهر فورًا بعد الحفظ والنشر. الأقسام الجديدة: إحصائيات، آراء الطلاب، أسئلة مختصرة، بانر دعوة، نافذة منبثقة، وضع صيانة، خط الموقع، ستايل الهيرو، والفوتر الجديد + CSS مخصص.</p>
        <div className="owner-fields">
          <Row label="خط الموقع">
            <select value={settings.fontChoice} onChange={(e) => set("fontChoice", e.target.value)}>
              <option value="cairo">Cairo — عصري وواضح</option>
              <option value="tajawal">Tajawal — هادئ</option>
              <option value="ibm">IBM Plex Arabic — أكاديمي</option>
              <option value="amiri">Amiri — تراثي</option>
              <option value="system">System — سريع</option>
            </select>
          </Row>
          <Row label="ستايل الواجهة الرئيسية">
            <select value={settings.heroStyle} onChange={(e) => set("heroStyle", e.target.value)}>
              <option value="grand">Grand — فخمة مع توهج</option>
              <option value="split">Split — مقسومة عصرية</option>
              <option value="center">Center — متمركزة هادئة</option>
            </select>
          </Row>
          <Row label="خلفية الهيرو">
            <select value={settings.heroBackground} onChange={(e) => set("heroBackground", e.target.value)}>
              <option value="pattern">Pattern — زخرفة إسلامية خفيفة</option>
              <option value="gradient">Gradient — تدرج ناعم</option>
              <option value="plain">Plain — سادة</option>
            </select>
          </Row>
          <Row label="ستايل شريط الإعلان">
            <select value={settings.announcementStyle} onChange={(e) => set("announcementStyle", e.target.value)}>
              <option value="gold">ذهبي مميز</option>
              <option value="dark">داكن فاخر</option>
              <option value="light">فاتح هادئ</option>
            </select>
          </Row>
        </div>
        <div className="owner-toggles">
          {([
            ["stickyHeader", "تثبيت الهيدر أعلى الصفحة"],
            ["headerGlass", "هيدر زجاجي شفاف"],
            ["heroGlow", "توهج حول الهيرو"],
            ["cardHover", "حركة تفاعلية للبطاقات"],
            ["showWisdom", "إظهار حكمة اليوم"],
            ["showStats", "إظهار شريط الإحصائيات"],
            ["showTestimonials", "إظهار آراء الطلاب"],
            ["showFaqHome", "إظهار الأسئلة المختصرة"],
            ["showCtaBanner", "إظهار بانر الدعوة"],
            ["showPopup", "تفعيل النافذة المنبثقة"],
            ["enableMaintenance", "وضع الصيانة (يغطي الموقع)"],
          ] as [keyof Settings, string][]).map(([k, label]) => (
            <label key={k} className="owner-check"><input type="checkbox" checked={Boolean(settings[k])} onChange={() => toggle(k)} />{label}</label>
          ))}
        </div>
        <div className="owner-fields">
          <Row label="عنوان حكمة اليوم"><input value={settings.wisdomTitle} onChange={(e) => set("wisdomTitle", e.target.value)} /></Row>
          <Row label="حكم اليوم — النص || المصدر وافصل بـ ///"><textarea rows={4} value={settings.wisdomData} onChange={(e) => set("wisdomData", e.target.value)} /></Row>
          <Row label="السطر العلوي لصفحات الأقسام"><input value={settings.catalogTopline} onChange={(e) => set("catalogTopline", e.target.value)} /></Row>
          <Row label="ملاحظة يُضاف الجديد في صفحات الأقسام"><input value={settings.catalogNewLabel} onChange={(e) => set("catalogNewLabel", e.target.value)} /></Row>
          <Row label="وصف صفحة الدورات"><textarea value={settings.coursesDesc} onChange={(e) => set("coursesDesc", e.target.value)} /></Row>
          <Row label="وصف صفحة الدروس"><textarea value={settings.lessonsDesc} onChange={(e) => set("lessonsDesc", e.target.value)} /></Row>
          <Row label="وصف صفحة المقالات"><textarea value={settings.articlesDesc} onChange={(e) => set("articlesDesc", e.target.value)} /></Row>
          <Row label="وصف صفحة المكتبة"><textarea value={settings.libraryDesc} onChange={(e) => set("libraryDesc", e.target.value)} /></Row>
          <Row label="بحث الدورات"><input value={settings.catalogSearchCourses} onChange={(e) => set("catalogSearchCourses", e.target.value)} /></Row>
          <Row label="بحث الدروس"><input value={settings.catalogSearchLessons} onChange={(e) => set("catalogSearchLessons", e.target.value)} /></Row>
          <Row label="بحث المقالات"><input value={settings.catalogSearchArticles} onChange={(e) => set("catalogSearchArticles", e.target.value)} /></Row>
          <Row label="بحث المكتبة"><input value={settings.catalogSearchBooks} onChange={(e) => set("catalogSearchBooks", e.target.value)} /></Row>
          <Row label="شارة التجديد في الرئيسية"><input value={settings.heroBadge} onChange={(e) => set("heroBadge", e.target.value)} /></Row>
        </div>
      </section>

      <section className="owner-section">
        <h3>📊 الإحصائيات</h3>
        <div className="owner-fields compact">
          <Row label="القيمة 1"><input value={settings.statsOneValue} onChange={(e) => set("statsOneValue", e.target.value)} /></Row>
          <Row label="التسمية 1"><input value={settings.statsOneLabel} onChange={(e) => set("statsOneLabel", e.target.value)} /></Row>
          <Row label="القيمة 2"><input value={settings.statsTwoValue} onChange={(e) => set("statsTwoValue", e.target.value)} /></Row>
          <Row label="التسمية 2"><input value={settings.statsTwoLabel} onChange={(e) => set("statsTwoLabel", e.target.value)} /></Row>
          <Row label="القيمة 3"><input value={settings.statsThreeValue} onChange={(e) => set("statsThreeValue", e.target.value)} /></Row>
          <Row label="التسمية 3"><input value={settings.statsThreeLabel} onChange={(e) => set("statsThreeLabel", e.target.value)} /></Row>
          <Row label="القيمة 4"><input value={settings.statsFourValue} onChange={(e) => set("statsFourValue", e.target.value)} /></Row>
          <Row label="التسمية 4"><input value={settings.statsFourLabel} onChange={(e) => set("statsFourLabel", e.target.value)} /></Row>
        </div>
      </section>

      <section className="owner-section">
        <h3>💬 آراء الطلاب</h3>
        <p className="admin-note">الصيغة: الاسم || الرأي || الدور — وافصل بين الآراء بـ ///</p>
        <div className="owner-fields">
          <Row label="عنوان الآراء"><input value={settings.testimonialsTitle} onChange={(e) => set("testimonialsTitle", e.target.value)} /></Row>
          <Row label="وصف الآراء"><input value={settings.testimonialsText} onChange={(e) => set("testimonialsText", e.target.value)} /></Row>
          <Row label="بيانات الآراء"><textarea rows={4} value={settings.testimonialsData} onChange={(e) => set("testimonialsData", e.target.value)} /></Row>
        </div>
      </section>

      <section className="owner-section">
        <h3>❓ الأسئلة المختصرة في الرئيسية</h3>
        <p className="admin-note">الصيغة: السؤال || الإجابة — وافصل بـ ///</p>
        <div className="owner-fields">
          <Row label="عنوان الأسئلة"><input value={settings.faqHomeTitle} onChange={(e) => set("faqHomeTitle", e.target.value)} /></Row>
          <Row label="وصف الأسئلة"><input value={settings.faqHomeText} onChange={(e) => set("faqHomeText", e.target.value)} /></Row>
          <Row label="بيانات الأسئلة"><textarea rows={5} value={settings.faqHomeData} onChange={(e) => set("faqHomeData", e.target.value)} /></Row>
        </div>
      </section>

      <section className="owner-section">
        <h3>📣 بانر الدعوة + النافذة المنبثقة + الصيانة</h3>
        <div className="owner-fields">
          <Row label="عنوان البانر"><input value={settings.ctaTitle} onChange={(e) => set("ctaTitle", e.target.value)} /></Row>
          <Row label="نص البانر"><textarea value={settings.ctaText} onChange={(e) => set("ctaText", e.target.value)} /></Row>
          <Row label="زر البانر الأساسي"><input value={settings.ctaPrimary} onChange={(e) => set("ctaPrimary", e.target.value)} /></Row>
          <Row label="زر البانر الثانوي"><input value={settings.ctaSecondary} onChange={(e) => set("ctaSecondary", e.target.value)} /></Row>
          <Row label="عنوان المنبثقة"><input value={settings.popupTitle} onChange={(e) => set("popupTitle", e.target.value)} /></Row>
          <Row label="نص المنبثقة"><textarea value={settings.popupText} onChange={(e) => set("popupText", e.target.value)} /></Row>
          <Row label="زر المنبثقة"><input value={settings.popupCta} onChange={(e) => set("popupCta", e.target.value)} /></Row>
          <Row label="تأخير المنبثقة بالثواني"><input value={settings.popupDelay} onChange={(e) => set("popupDelay", e.target.value)} /></Row>
          <Row label="عنوان الصيانة"><input value={settings.maintenanceTitle} onChange={(e) => set("maintenanceTitle", e.target.value)} /></Row>
          <Row label="نص الصيانة"><textarea value={settings.maintenanceText} onChange={(e) => set("maintenanceText", e.target.value)} /></Row>
        </div>
      </section>

      <section className="owner-section">
        <h3>🦶 الفوتر الجديد + CSS مخصص</h3>
        <div className="owner-fields">
          <Row label="نبذة الفوتر"><textarea value={settings.footerAbout} onChange={(e) => set("footerAbout", e.target.value)} /></Row>
          <Row label="عنوان الأقسام السريعة"><input value={settings.footerQuickTitle} onChange={(e) => set("footerQuickTitle", e.target.value)} /></Row>
          <Row label="عنوان التواصل"><input value={settings.footerContactTitle} onChange={(e) => set("footerContactTitle", e.target.value)} /></Row>
          <Row label="نص الدعوة في الفوتر"><input value={settings.footerCtaText} onChange={(e) => set("footerCtaText", e.target.value)} /></Row>
          <Row label="CSS مخصص (للمتقدمين)"><textarea rows={5} dir="ltr" placeholder=".nexus-hero { ... }" value={settings.customCss} onChange={(e) => set("customCss", e.target.value)} /></Row>
        </div>
        <button type="button" className="ghost small-owner-button" onClick={() => setNotice("تم تطبيق إعدادات التجديد محليًا. اضغط حفظ ونشر للجميع لاعتمادها.")}>معاينة الإعدادات محليًا ✓</button>
      </section>
    </div>
  );
}