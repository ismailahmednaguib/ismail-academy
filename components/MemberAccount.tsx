"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { countryOptions } from "@/lib/countries";

type Mode = "login" | "signup";

export default function MemberAccount({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => setAccountEmail(data.session?.user.email ?? ""));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAccountEmail(session?.user.email ?? "");
      window.dispatchEvent(new CustomEvent("academy-auth-change"));
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setNotice("إعدادات الحساب غير مضافة بعد.");
      return;
    }
    if (password.length < 6) {
      setNotice("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      return;
    }
    setBusy(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) {
        setNotice("تعذر الدخول. راجع البريد وكلمة المرور.");
        return;
      }
      setNotice("تم تسجيل الدخول بنجاح.");
      setPassword("");
      setOpen(false);
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name.trim(), country_code: countryCode, country_name: countryOptions.find((country) => country.code === countryCode)?.name ?? "غير محدد" } },
    });
    setBusy(false);
    if (error) {
      setNotice(error.message.includes("already registered") ? "هذا البريد مسجل بالفعل، جرّب الدخول." : "تعذر إنشاء الحساب، حاول مرة أخرى.");
      return;
    }
    setPassword("");
    setOpen(false);
    setNotice(data.session ? "تم إنشاء الحساب وتسجيل الدخول." : "تم إنشاء الحساب. راجع بريدك لتأكيده قبل الدخول.");
  }

  async function logout() {
    await supabase?.auth.signOut();
    setNotice("تم تسجيل الخروج.");
    setOpen(false);
  }

  return <>
    <button type="button" className={`member-button${compact ? " compact" : ""}`} onClick={() => { setNotice(""); setOpen(true); }}>
      <span className="member-dot" aria-hidden="true" />{accountEmail ? "حسابي" : "دخول / حساب"}
    </button>
    {open && <div className="account-overlay" role="dialog" aria-modal="true" aria-label="حساب العضو">
      <div className="account-card">
        <button type="button" className="account-close" aria-label="إغلاق" onClick={() => setOpen(false)}>×</button>
        {accountEmail ? <>
          <p className="kicker">مساحتك</p>
          <h2>أهلًا بك.</h2>
          <p className="account-email">{accountEmail}</p>
          <p className="admin-note">يمكنك العودة للمحتوى المحفوظ من أي جهاز، وتسجيل الخروج من هنا.</p>
          <button type="button" className="primary account-submit" onClick={() => void logout()}>تسجيل الخروج</button>
        </> : <>
          <p className="kicker">مساحة المتعلم</p>
          <h2>{mode === "login" ? "أكمل رحلتك." : "ابدأ حسابك."}</h2>
          <p className="admin-note">احفظ تقدمك وارجع للمحتوى من أي وقت.</p>
          <form onSubmit={submit} className="account-form">
            {mode === "signup" && <label>الاسم<input required value={name} onChange={(event) => setName(event.target.value)} /></label>}
            {mode === "signup" && <label>الدولة<select required value={countryCode} onChange={(event) => setCountryCode(event.target.value)}><option value="">اختر دولتك</option>{countryOptions.map((country) => <option value={country.code} key={country.code}>{country.name}</option>)}</select></label>}
            <label>البريد الإلكتروني<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <label>كلمة المرور<input type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            <button className="primary account-submit" disabled={busy}>{busy ? "جارٍ التنفيذ..." : mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}</button>
          </form>
          <button type="button" className="account-switch" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setNotice(""); }}>
            {mode === "login" ? "ليس لديك حساب؟ أنشئ حسابًا" : "لديك حساب؟ سجّل الدخول"}
          </button>
        </>}
      </div>
    </div>}
    {notice && <div className="account-toast" role="status">{notice}<button type="button" onClick={() => setNotice("")}>×</button></div>}
  </>;
}
