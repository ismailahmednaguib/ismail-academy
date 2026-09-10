"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { countryOptions } from "@/lib/countries";
import Link from "next/link";

type Mode = "login" | "signup" | "reset";
type LearningStats = { saved: number; completed: number };

export default function MemberAccount({ compact = false, initialMode = "login", className = "", label, hideWhenAuthenticated = false }: { compact?: boolean; initialMode?: Mode; className?: string; label?: string; hideWhenAuthenticated?: boolean }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [authResolved, setAuthResolved] = useState(!supabase);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [learningStats, setLearningStats] = useState<LearningStats>({ saved: 0, completed: 0 });

  function refreshLearningStats() {
    try {
      const value = JSON.parse(localStorage.getItem("academy-learning-v1") ?? "{}") as Partial<{ saved: string[]; completed: string[] }>;
      setLearningStats({ saved: Array.isArray(value.saved) ? value.saved.length : 0, completed: Array.isArray(value.completed) ? value.completed.length : 0 });
    } catch {
      setLearningStats({ saved: 0, completed: 0 });
    }
  }

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => { setAccountEmail(data.session?.user.email ?? ""); setAuthResolved(true); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAccountEmail(session?.user.email ?? "");
      setAuthResolved(true);
      window.dispatchEvent(new CustomEvent("academy-auth-change"));
    });
    const learningListener = () => refreshLearningStats();
    window.addEventListener("academy-learning-change", learningListener);
    const timer = window.setTimeout(refreshLearningStats, 0);
    return () => { listener.subscription.unsubscribe(); window.removeEventListener("academy-learning-change", learningListener); window.clearTimeout(timer); };
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
    if (mode === "reset") {
      setBusy(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/` });
      setBusy(false);
      setNotice(error ? "تعذر إرسال رابط الاستعادة. راجع البريد وحاول مرة أخرى." : "تم إرسال رابط استعادة كلمة المرور إلى بريدك.");
      if (!error) setMode("login");
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

  function openSavedContent() {
    setOpen(false);
    window.setTimeout(() => document.getElementById("learning-shelf")?.scrollIntoView({ behavior: "smooth", block: "center" }), 0);
  }

  const showAccountButton = !(hideWhenAuthenticated && authResolved && Boolean(accountEmail));

  return <>
    {showAccountButton && <button type="button" className={`member-button${compact ? " compact" : ""}${className ? ` ${className}` : ""}`} onClick={() => { setNotice(""); setMode(initialMode); setOpen(true); }}>
      <span className="member-dot" aria-hidden="true" />{accountEmail ? "حسابي" : label ?? "دخول / حساب"}
    </button>}
    {open && <div className="account-overlay" role="dialog" aria-modal="true" aria-label="حساب العضو">
      <div className="account-card">
        <button type="button" className="account-close" aria-label="إغلاق" onClick={() => setOpen(false)}>×</button>
        {accountEmail ? <>
          <p className="kicker">مساحتك</p>
          <h2>أهلًا بك.</h2>
          <p className="account-email">{accountEmail}</p>
          <p className="admin-note">يمكنك العودة للمحتوى المحفوظ من أي جهاز، وتسجيل الخروج من هنا.</p>
          <div className="account-stats"><div><b>{learningStats.saved}</b><small>محفوظ للمراجعة</small></div><div><b>{learningStats.completed}</b><small>مكتمل</small></div></div>
          {learningStats.saved > 0 && <button type="button" className="ghost account-submit" onClick={openSavedContent}>افتح المحتوى المحفوظ</button>}
          <Link href="/account" className="ghost account-submit" onClick={() => setOpen(false)}>فتح لوحة التعلم</Link>
          <button type="button" className="primary account-submit" onClick={() => void logout()}>تسجيل الخروج</button>
        </> : <>
          <p className="kicker">مساحة المتعلم</p>
          <h2>{mode === "login" ? "أكمل رحلتك." : mode === "signup" ? "ابدأ حسابك." : "استعد دخولك."}</h2>
          <p className="admin-note">{mode === "reset" ? "اكتب بريدك لنرسل لك رابطًا آمنًا لتعيين كلمة مرور جديدة." : "احفظ تقدمك وارجع للمحتوى من أي وقت."}</p>
          <form onSubmit={submit} className="account-form">
            {mode === "signup" && <label>الاسم<input required value={name} onChange={(event) => setName(event.target.value)} /></label>}
            {mode === "signup" && <label>الدولة<select required value={countryCode} onChange={(event) => setCountryCode(event.target.value)}><option value="">اختر دولتك</option>{countryOptions.map((country) => <option value={country.code} key={country.code}>{country.name}</option>)}</select></label>}
            <label>البريد الإلكتروني<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            {mode !== "reset" && <label>كلمة المرور<input type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} /></label>}
            <button className="primary account-submit" disabled={busy}>{busy ? "جارٍ التنفيذ..." : mode === "login" ? "تسجيل الدخول" : mode === "signup" ? "إنشاء حساب" : "إرسال رابط الاستعادة"}</button>
          </form>
          {mode === "login" && <button type="button" className="account-link" onClick={() => { setMode("reset"); setNotice(""); }}>نسيت كلمة المرور؟</button>}
          <button type="button" className="account-switch" onClick={() => { setMode(mode === "login" || mode === "reset" ? "signup" : "login"); setNotice(""); }}>
            {mode === "signup" ? "لديك حساب؟ سجّل الدخول" : "ليس لديك حساب؟ أنشئ حسابًا"}
          </button>
          {mode === "reset" && <button type="button" className="account-switch account-switch-muted" onClick={() => { setMode("login"); setNotice(""); }}>العودة لتسجيل الدخول</button>}
        </>}
      </div>
    </div>}
    {notice && <div className="account-toast" role="status">{notice}<button type="button" onClick={() => setNotice("")}>×</button></div>}
  </>;
}
