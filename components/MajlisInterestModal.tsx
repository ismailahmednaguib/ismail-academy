"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MajlisInterestModal({
  open,
  onClose,
  majlisTopic,
}: {
  open: boolean;
  onClose: () => void;
  majlisTopic: string;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [website, setWebsite] = useState(""); // حقل فخ للبوتات (honeypot) — البشر ميعبّوهوش
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  if (!open) return null;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (website) {
      // اتعبى، غالبًا بوت — نعرض نجاح وهمي من غير ما نلمس القاعدة
      setStatus("done");
      return;
    }
    if (!supabase) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    const { error } = await supabase.from("majlis_interest").insert({ name, contact });
    setStatus(error ? "error" : "done");
  }

  function handleClose() {
    setStatus("idle");
    setName("");
    setContact("");
    setWebsite("");
    onClose();
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" onClick={handleClose}>
      <div className="admin interest-modal" onClick={(e) => e.stopPropagation()}>
        <header>
          <div>
            <p className="kicker">تسجيل الاهتمام</p>
            <h2>{majlisTopic}</h2>
          </div>
          <button onClick={handleClose}>×</button>
        </header>
        {status === "done" ? (
          <p className="admin-note">
            تم تسجيل اهتمامك بنجاح، جزاك الله خيرًا. سنوافيك بتفاصيل اللقاء قبل موعده.
          </p>
        ) : (
          <form onSubmit={submit}>
            <p className="admin-note">اترك اسمك وطريقة تواصل (بريد أو رقم) وسنبلغك بتفاصيل المجلس.</p>
            <label>
              الاسم
              <input required value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              البريد أو رقم التواصل
              <input required value={contact} onChange={(e) => setContact(e.target.value)} />
            </label>
            <label className="hp-field" aria-hidden="true">
              الموقع الإلكتروني
              <input
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </label>
            {status === "error" && (
              <p className="admin-note interest-error">تعذّر إرسال التسجيل، حاول مرة أخرى.</p>
            )}
            <button className="primary" disabled={status === "sending"}>
              {status === "sending" ? "جارٍ الإرسال..." : "تسجيل الاهتمام"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
