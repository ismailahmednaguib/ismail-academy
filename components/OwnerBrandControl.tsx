"use client";

import { ChangeEvent, useState } from "react";
import type { Settings } from "@/lib/content";
import { supabase } from "@/lib/supabase";

type Props = { settings: Settings; setSettings: (value: Settings) => void; setNotice: (value: string) => void };

export default function OwnerBrandControl({ settings, setSettings, setNotice }: Props) {
  const [busy, setBusy] = useState(false);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    if (!supabase) { setNotice("إعدادات Supabase غير موجودة."); return; }
    if (!file.type.startsWith("image/")) { setNotice("اختار صورة فقط للشعار."); return; }
    if (file.size > 5 * 1024 * 1024) { setNotice("الحد الأقصى لصورة الشعار 5 ميجابايت."); return; }
    const extension = file.name.split(".").pop()?.toLowerCase() || "png";
    setBusy(true);
    const path = `brand/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from("academy-media").upload(path, file, { upsert: false, contentType: file.type, cacheControl: "3600" });
    if (error) {
      setBusy(false);
      setNotice("تعذر رفع الشعار. تأكد من تشغيل سياسة academy_media.sql.");
      return;
    }
    const { data } = supabase.storage.from("academy-media").getPublicUrl(path);
    setSettings({ ...settings, brandImage: data.publicUrl, showBrandImage: true });
    setBusy(false);
    setNotice("تم رفع الشعار محليًا. اضغط حفظ ونشر لاعتماده.");
  }

  function removeImage() {
    setSettings({ ...settings, brandImage: "", showBrandImage: false });
    setNotice("تمت إزالة صورة الشعار محليًا. اضغط حفظ ونشر لاعتماد الإزالة.");
  }

  return <section className="owner-card owner-brand-control"><div className="owner-card-head"><div><b>هوية الموقع</b><small>الصورة الدائرية بجانب اسم الأكاديمية</small></div><label className="owner-featured"><input type="checkbox" checked={settings.showBrandImage} onChange={() => setSettings({ ...settings, showBrandImage: !settings.showBrandImage })} /> إظهار الصورة</label></div><div className="brand-control-body"><div className="brand-preview">{settings.showBrandImage && settings.brandImage ? <span className="brand-preview-image" style={{ backgroundImage: `url("${settings.brandImage}")` }} aria-label="معاينة شعار الموقع" /> : <span>{settings.mark}</span>}</div><div><p className="admin-note">ارفع شعارًا مربعًا ويفضل أن يكون بخلفية شفافة. عند الإزالة يعود الحرف الافتراضي.</p><label className="upload-button"><input type="file" accept="image/*" onChange={(event) => void upload(event)} />{busy ? "جارٍ رفع الشعار..." : "رفع صورة الشعار"}</label>{settings.brandImage && <button type="button" className="danger-link brand-remove-button" onClick={removeImage}>إزالة الصورة والعودة للحرف</button>}</div></div></section>;
}
