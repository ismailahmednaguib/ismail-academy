"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const storageKey = "academy-learning-v1";

function getCompleted() {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) ?? "{}") as { completed?: unknown };
    return Array.isArray(value.completed) ? value.completed.filter((item): item is string => typeof item === "string") : [];
  } catch { return []; }
}

export default function CourseCertificate({ courseTitle, lessonIds }: { courseTitle: string; lessonIds: string[] }) {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    let active = true;
    const load = async () => {
      let completed = getCompleted();
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data } = await supabase.from("member_learning").select("completed").eq("user_id", session.user.id).maybeSingle();
          if (Array.isArray(data?.completed)) completed = data.completed.filter((item): item is string => typeof item === "string");
        }
      }
      if (active) setAvailable(lessonIds.length > 0 && lessonIds.every((id) => completed.includes(id)));
    };
    void load();
    window.addEventListener("academy-learning-change", load);
    window.addEventListener("academy-auth-change", load);
    return () => { active = false; window.removeEventListener("academy-learning-change", load); window.removeEventListener("academy-auth-change", load); };
  }, [lessonIds]);

  function printCertificate() {
    const certificate = window.open("", "_blank", "width=900,height=650");
    if (!certificate) return;
    certificate.document.write(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>شهادة إتمام</title><style>body{font-family:Arial,sans-serif;background:#f3f0e6;color:#173a35;display:grid;place-items:center;height:100vh;margin:0}.card{width:760px;padding:70px 50px;text-align:center;background:#fbfaf5;border:12px double #b8893e}h1{font-size:48px;margin:0 0 22px}h2{font-size:32px;color:#b8893e;margin:20px 0}p{font-size:20px;line-height:2}.line{margin:44px auto 0;border-top:1px solid #173a35;width:220px;font-size:13px;padding-top:10px}</style></head><body><main class="card"><p>أكاديمية إسماعيل أحمد نجيب</p><h1>شهادة إتمام</h1><p>نشهد بإتمام المسار التعليمي</p><h2>${courseTitle.replace(/[<>]/g, "")}</h2><p>مع تمنياتنا بمزيد من العلم النافع والأثر الطيب.</p><div class="line">تاريخ الإصدار: ${new Date().toLocaleDateString("ar-EG")}</div></main><script>window.onload=()=>window.print()</script></body></html>`);
    certificate.document.close();
  }

  if (!available) return null;
  return <div className="course-certificate"><div><p className="kicker">إنجازك اكتمل</p><h3>أتممت دروس هذا المسار.</h3><small>يمكنك طباعة شهادة تقدير رمزية للاحتفاظ بها.</small></div><button type="button" className="primary" onClick={printCertificate}>طباعة الشهادة</button></div>;
}

