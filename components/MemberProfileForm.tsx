"use client";

import { FormEvent, useEffect, useState } from "react";
import { countryOptions } from "@/lib/countries";
import { supabase } from "@/lib/supabase";

export default function MemberProfileForm() {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [email, setEmail] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!supabase) {
        if (active) setLoaded(true);
        return;
      }
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session) {
        if (active) setLoaded(true);
        return;
      }
      const metadata = session.user.user_metadata ?? {};
      const { data: profile } = await supabase
        .from("site_members")
        .select("full_name,country_code")
        .eq("id", session.user.id)
        .maybeSingle();
      if (active) {
        setEmail(session.user.email ?? "");
        setName(profile?.full_name || metadata.full_name || "");
        setCountryCode(profile?.country_code || metadata.country_code || "");
        setLoaded(true);
      }
    };
    void load();
    return () => { active = false; };
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return setNotice("إعدادات الحساب غير مضافة بعد.");
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    if (!session) return setNotice("سجّل الدخول أولًا لتعديل ملفك.");
    const country = countryOptions.find((item) => item.code === countryCode);
    setBusy(true);
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: name.trim(),
        country_code: countryCode || "UN",
        country_name: country?.name ?? "غير محدد",
      },
    });
    const { error: profileError } = await supabase
      .from("site_members")
      .update({ full_name: name.trim(), country_code: countryCode || "UN", country_name: country?.name ?? "غير محدد" })
      .eq("id", session.user.id);
    setBusy(false);
    if (authError || profileError) {
      setNotice("تعذر حفظ الملف. تأكد من تشغيل جداول الحسابات في Supabase ثم حاول مرة أخرى.");
      return;
    }
    setNotice("تم حفظ بياناتك بنجاح.");
    window.dispatchEvent(new CustomEvent("academy-profile-change"));
  }

  if (!loaded || !email) return null;

  return (
    <section className="member-profile-card" aria-labelledby="member-profile-title">
      <div className="member-profile-heading">
        <div>
          <p className="kicker">ملفك في الأكاديمية</p>
          <h2 id="member-profile-title">بياناتك الأساسية</h2>
          <p>{email}</p>
        </div>
        <span className="member-profile-mark" aria-hidden="true">✦</span>
      </div>
      <form className="member-profile-form" onSubmit={save}>
        <label>الاسم الظاهر<input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} placeholder="اكتب اسمك" required /></label>
        <label>الدولة<select value={countryCode} onChange={(event) => setCountryCode(event.target.value)} required><option value="">اختر دولتك</option>{countryOptions.map((country) => <option value={country.code} key={country.code}>{country.name}</option>)}</select></label>
        <button className="primary" type="submit" disabled={busy}>{busy ? "جارٍ الحفظ..." : "حفظ التعديلات"}</button>
      </form>
      {notice && <p className="member-profile-notice" role="status">{notice}</p>}
    </section>
  );
}
