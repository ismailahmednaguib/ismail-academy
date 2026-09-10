"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const notePrefix = "ismail-academy-note:";

export default function MemberNotes({ contentId }: { contentId: string }) {
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    let active = true;
    const local = window.localStorage.getItem(notePrefix + contentId) ?? "";
    setTimeout(() => { if (active) setBody(local); }, 0);
    const loadRemote = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase.from("member_notes").select("body").eq("user_id", session.user.id).eq("content_id", contentId).maybeSingle();
      if (active && typeof data?.body === "string") { window.localStorage.setItem(notePrefix + contentId, data.body); setBody(data.body); }
    };
    void loadRemote();
    return () => { active = false; };
  }, [contentId]);

  async function saveNote() {
    setBusy(true);
    window.localStorage.setItem(notePrefix + contentId, body);
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) await supabase.from("member_notes").upsert({ user_id: session.user.id, content_id: contentId, body, updated_at: new Date().toISOString() }, { onConflict: "user_id,content_id" });
    }
    setBusy(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  return <section className="member-notes"><div><p className="kicker">مذكرتك الخاصة</p><h2>اكتب ما تريد تذكره.</h2><small>الملاحظة خاصة بك وتتم مزامنتها مع حسابك عند تسجيل الدخول.</small></div><textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="فكرة، سؤال، أو تطبيق عملي..." aria-label="ملاحظتك الخاصة" /><button type="button" className="ghost" onClick={() => void saveNote()} disabled={busy}>{busy ? "جارٍ الحفظ..." : saved ? "تم الحفظ ✓" : "حفظ الملاحظة"}</button></section>;
}

