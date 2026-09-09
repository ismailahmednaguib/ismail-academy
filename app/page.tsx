"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  defaultSettings as defaults,
  initialCourses,
  initialArticles,
  initialBooks,
  initialLessons,
  slugify,
  type AcademyContent,
} from "@/lib/content";
import MajlisInterestModal from "@/components/MajlisInterestModal";

export default function Home() {
  const [settings, setSettings] = useState(defaults);
  const [courses, setCourses] = useState<string[][]>(initialCourses);
  const [articles, setArticles] = useState<string[][]>(initialArticles);
  const [books, setBooks] = useState<string[][]>(initialBooks);
  const [lessons, setLessons] = useState<string[][]>(initialLessons);
  const [admin, setAdmin] = useState(false);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [menu, setMenu] = useState(false);
  const [ownerSession, setOwnerSession] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [interestOpen, setInterestOpen] = useState(false);
  async function loadPublishedContent() {
    if (!supabase) return;
    const { data } = await supabase.from("site_content").select("payload").eq("id", "main").single();
    const payload = data?.payload as Partial<AcademyContent> | undefined;
    if (!payload) return;
    if (payload.settings) setSettings({ ...defaults, ...payload.settings });
    if (payload.courses) setCourses(payload.courses);
    if (payload.articles) setArticles(payload.articles);
    if (payload.books) setBooks(payload.books);
    if (payload.lessons) setLessons(payload.lessons);
  }
  // This hydrates the screen from an external asynchronous data source; it is not derived local state.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void loadPublishedContent(); }, []);
  async function openAdmin() {
    if (!supabase) { setNotice("أضف إعدادات Supabase في ملف .env.local أولًا."); return; }
    const { data: { session } } = await supabase.auth.getSession();
    setOwnerSession(Boolean(session));
    setAdmin(true);
  }
  // فتح لوحة المالك تلقائيًا لو الزائر جاي من زرار "لوحة المالك" في صفحة تانية (/?admin=1)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("admin") === "1") {
      void openAdmin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function login(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    if (error) { setNotice("تعذر تسجيل الدخول. تأكد من البريد وكلمة المرور."); return; }
    setOwnerSession(true);
    setNotice("تم تسجيل الدخول كمالك للموقع.");
  }
  const results = useMemo(() => {
    const items = [
      ...courses.map(([title]) => ({ title, href: `/courses/${encodeURIComponent(slugify(title))}` })),
      ...lessons.map(([title]) => ({ title, href: `/lessons/${encodeURIComponent(slugify(title))}` })),
      ...articles.map(([title]) => ({ title, href: `/articles/${encodeURIComponent(slugify(title))}` })),
      ...books.map(([title]) => ({ title, href: "/library" })),
    ];
    return items.filter(({ title }) => title.includes(search));
  }, [search, courses, lessons, articles, books]);
  async function save(e: FormEvent) {
    e.preventDefault();
    if (!supabase || !ownerSession) { setNotice("سجّل الدخول كمالك قبل الحفظ."); return; }
    const { error } = await supabase.from("site_content").update({ payload: { settings, courses, lessons, articles, books } }).eq("id", "main");
    setNotice(error ? "تعذر الحفظ. تأكد أن بريدك مكتوب في سياسة قاعدة البيانات." : "تم النشر بنجاح وسيظهر التحديث لكل الزوار.");
  }
  const [newsletterSending, setNewsletterSending] = useState(false);
  async function subscribeNewsletter(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const honeypot = (form.elements.namedItem("website") as HTMLInputElement)?.value;
    if (honeypot) {
      // اتعبى، غالبًا بوت — نعرض نجاح وهمي من غير ما نلمس القاعدة
      setNotice("تم الاشتراك بنجاح، هنبعتلك كل جديد.");
      form.reset();
      return;
    }
    const email = (form.elements.namedItem("newsletter-email") as HTMLInputElement)?.value ?? "";
    if (!supabase) { setNotice("أضف إعدادات Supabase في ملف .env.local أولًا."); return; }
    setNewsletterSending(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    setNewsletterSending(false);
    if (error) {
      setNotice(error.code === "23505" ? "البريد ده مشترك بالفعل." : "تعذر الاشتراك، حاول تاني.");
      return;
    }
    setNotice("تم الاشتراك بنجاح، هنبعتلك كل جديد.");
    form.reset();
  }
  const scroll = (id: string) => { setMenu(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  return <>
    <a href="#top" className="skip-link">تخطى إلى المحتوى</a>
    <div className="announcement"><span>✦</span> {settings.announcement} <button onClick={() => scroll("majalis")}>التفاصيل</button></div>
    <header className="nav"><a className="brand" href="#top"><i>ا</i><span>{settings.name}<small>{settings.tagline}</small></span></a>
      <nav className={menu ? "links open" : "links"}>{[["الرئيسية","top"],["الدورات","courses"],["الدروس","lessons"],["المجالس","majalis"],["المقالات","articles"],["المكتبة","library"]].map(([label,id]) => <button key={id} onClick={() => scroll(id)}>{label}</button>)}</nav>
      <div className="nav-actions"><button className="search-button" onClick={() => document.getElementById("site-search")?.focus()}>⌕</button><button className="owner-button" onClick={() => void openAdmin()}>لوحة المالك</button><button className="menu" onClick={() => setMenu(!menu)}>☰</button></div>
    </header>
    <main id="top">
      <section className="hero"><div className="hero-copy"><p className="kicker">بِسْمِ اللهِ نَبْدَأُ</p><h1>{settings.heroTitle}</h1><p>{settings.heroText}</p><div className="hero-actions"><button className="primary" onClick={() => scroll("courses")}>ابدأ رحلتك <b>←</b></button><button className="ghost" onClick={() => scroll("majalis")}>استكشف المجالس</button></div><div className="hero-metrics"><span><b>+12</b> درسًا مختارًا</span><span><b>3</b> مسارات تعليمية</span><span><b>مجاني</b> ومتاح للجميع</span></div></div><div className="hero-art"><div className="arch"><span>وَقُلْ رَبِّ زِدْنِي عِلْمًا</span><small>طه · 114</small></div><div className="floating-card"><b>ورد اليوم</b><span>اقرأ · تعلّم · طبّق</span><em>✓ مكتمل جزئيًا</em></div></div></section>
      <section className="search-wrap"><label htmlFor="site-search">⌕</label><input id="site-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث في الدروس والمقالات والمكتبة..." />{search && <div className="search-results">{results.length ? results.map(r => <Link key={r.href + r.title} href={r.href} onClick={() => setSearch("")}>{r.title}</Link>) : <span>لا توجد نتائج مطابقة</span>}</div>}</section>
      <section className="section intro"><div><p className="kicker">منصة متكاملة</p><h2>كل ما تحتاجه في مكان واحد.</h2></div><p>محتوى مرتب لا يزاحمك، وتجربة تعلّم تراعي وقتك وتعينك على الاستمرار.</p></section>
      <section className="section" id="courses"><div className="section-head"><div><p className="kicker">المسارات التعليمية</p><h2>الدورات</h2></div><Link href="/courses" className="text-button">عرض كل الدورات ←</Link></div><div className="course-grid">{courses.map(([title,desc,count,level,num]) => <article className="course-card" key={title}><div className="course-number">{num}</div><span className="badge">{level}</span><h3><Link href={`/courses/${encodeURIComponent(slugify(title))}`}>{title}</Link></h3><p>{desc}</p><footer><span>{count}</span><Link href={`/courses/${encodeURIComponent(slugify(title))}`} aria-label={`فتح ${title}`}>←</Link></footer></article>)}</div></section>
      <section className="section soft" id="lessons"><div className="section-head"><div><p className="kicker">تعلّم بخطوات قصيرة</p><h2>أحدث الدروس</h2></div><Link href="/lessons" className="text-button">كل الدروس ←</Link></div><div className="lesson-list">{lessons.map(([title,meta],i) => <article key={`${title}-${i}`}><span>0{i+1}</span><div><b>{title}</b><small>{meta}</small></div><Link href={`/lessons/${encodeURIComponent(slugify(title))}`}>استمع ←</Link></article>)}</div></section>
      <section className="section majlis" id="majalis"><div className="majlis-content"><p className="kicker">المجالس واللقاءات</p><h2>{settings.majlisTitle}</h2><p>{settings.majlisText}</p><div className="event"><span>{settings.majlisDate.split("|").map((item, index) => <span key={index}>{index === 1 ? <b>{item.trim()}</b> : item.trim()}<br/></span>)}</span><div><b>{settings.majlisTopic}</b><small>{settings.majlisMeta}</small></div></div><button className="primary" onClick={() => setInterestOpen(true)}>سجّل اهتمامك ←</button></div><div className="majlis-quote">“{settings.majlisQuote}”<small>متفق عليه</small></div></section>
      <section className="section" id="articles"><div className="section-head"><div><p className="kicker">اقرأ بتأنٍّ</p><h2>من المقالات</h2></div><Link href="/articles" className="text-button">كل المقالات ←</Link></div><div className="article-grid">{articles.map(([title,cat,time],i) => <article key={title}><div className={`article-art art-${i}`}>✦</div><small>{cat} · {time}</small><h3><Link href={`/articles/${encodeURIComponent(slugify(title))}`}>{title}</Link></h3><Link href={`/articles/${encodeURIComponent(slugify(title))}`}>اقرأ المقال ←</Link></article>)}</div></section>
      <section className="section library" id="library"><div><p className="kicker">مكتبة نافعة</p><h2>ملفات تعود إليها.</h2><p>مختارات مصممة للقراءة الهادئة والطباعة والمراجعة.</p><Link href="/library" className="primary">دخول المكتبة ←</Link></div><div className="book-list">{books.map(([title,meta,fileUrl]) => <article key={title}><span>PDF</span><div><b>{title}</b><small>{meta}</small></div>{fileUrl ? <a href={fileUrl} download aria-label={`تحميل ${title}`}>↓</a> : <span className="coming-soon" title="سيتم إضافة الملف قريبًا">↓</span>}</article>)}</div></section>
      <section className="newsletter"><div><p className="kicker">رسالة نافعة، بلا إزعاج</p><h2>وصلك الجديد من الأكاديمية.</h2><p>تنبيه بالدروس والملفات والمجالس الجديدة حين تكون جاهزة.</p></div><form onSubmit={subscribeNewsletter}><input type="email" name="newsletter-email" placeholder="بريدك الإلكتروني" required /><label className="hp-field" aria-hidden="true">الموقع الإلكتروني<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label><button className="primary" disabled={newsletterSending}>{newsletterSending ? "جارٍ الاشتراك..." : "اشترك الآن"}</button></form></section>
    </main>
    <footer><div className="brand"><i>ا</i><span>{settings.name}<small>{settings.tagline}</small></span></div><p>© {new Date().getFullYear()} جميع الحقوق محفوظة.</p><div><a href={`mailto:${settings.email}`}>البريد</a><a href="https://t.me/your_username">تيليجرام</a></div></footer>
    {notice && <div className="toast">{notice}<button onClick={() => setNotice("")}>×</button></div>}
    {admin && (
      <div className="modal" role="dialog" aria-modal="true">
        <div className="admin">
          <header><div><p className="kicker">إدارة المحتوى</p><h2>لوحة المالك</h2></div><button onClick={() => setAdmin(false)}>×</button></header>
          {!ownerSession ? (
            <form onSubmit={login}>
              <p className="admin-note">سجّل الدخول بحساب المالك الذي أنشأته في Supabase. لن يستطيع أي حساب آخر نشر التغييرات.</p>
              <label>البريد الإلكتروني<input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} /></label>
              <label>كلمة المرور<input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} /></label>
              <button className="primary">تسجيل الدخول</button>
            </form>
          ) : (
            <form onSubmit={save}>
              <p className="admin-note">أنت مسجل كمالك. عند الحفظ ستظهر التغييرات لكل زوار الموقع.</p>
              {([['name','اسم الموقع'],['tagline','الشعار المختصر'],['heroTitle','عنوان الواجهة'],['heroText','وصف الواجهة'],['announcement','شريط الإعلان'],['email','البريد'],['telegram','تيليجرام'],['majlisTitle','عنوان قسم المجالس'],['majlisText','وصف قسم المجالس'],['majlisDate','تاريخ المجلس — افصل الأجزاء بعلامة |'],['majlisTopic','عنوان المجلس'],['majlisMeta','تفاصيل المجلس'],['majlisQuote','اقتباس المجلس']] as [keyof typeof defaults,string][]).map(([key,label]) => <label key={key}>{label}{key === 'heroText' || key === 'announcement' || key === 'majlisText' ? <textarea value={settings[key]} onChange={e => setSettings({...settings,[key]:e.target.value})} /> : <input value={settings[key]} onChange={e => setSettings({...settings,[key]:e.target.value})} />}</label>)}
              <label>الدورات (عنوان، وصف، عدد الدروس، المستوى، الرقم — لكل دورة صف)<textarea value={courses.map(x => x.join(' | ')).join('\n')} onChange={e => setCourses(e.target.value.split('\n').filter(Boolean).map(x => x.split('|').map(y => y.trim())))} /></label>
              <label>الدروس (العنوان، التفاصيل، رابط الملف الصوتي — اختياري — لكل درس صف)<textarea value={lessons.map(x => x.join(' | ')).join('\n')} onChange={e => setLessons(e.target.value.split('\n').filter(Boolean).map(x => x.split('|').map(y => y.trim())))} /></label>
              <label>المقالات (العنوان، التصنيف، زمن القراءة، نص المقال بفصل الفقرات بـ \n — اختياري — لكل مقال صف)<textarea value={articles.map(x => x.join(' | ')).join('\n')} onChange={e => setArticles(e.target.value.split('\n').filter(Boolean).map(x => x.split('|').map(y => y.trim())))} /></label>
              <label>ملفات المكتبة (العنوان، وصف الملف، رابط تحميل مباشر — اختياري — لكل ملف صف)<textarea value={books.map(x => x.join(' | ')).join('\n')} onChange={e => setBooks(e.target.value.split('\n').filter(Boolean).map(x => x.split('|').map(y => y.trim())))} /></label>
              <div className="admin-buttons"><button type="button" className="ghost" onClick={() => {setSettings(defaults); setCourses(initialCourses); setLessons(initialLessons); setArticles(initialArticles); setBooks(initialBooks);}}>استعادة الافتراضي</button><button className="primary">حفظ ونشر للجميع</button></div>
              <button type="button" className="text-button" onClick={() => { void supabase?.auth.signOut(); setOwnerSession(false); }}>تسجيل الخروج</button>
            </form>
          )}
        </div>
      </div>
    )}
    <MajlisInterestModal open={interestOpen} onClose={() => setInterestOpen(false)} majlisTopic={settings.majlisTopic} />
  </>;
}
