"use client";

import { useState } from "react";

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    try {
      const url = window.location.href;
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  const encoded = typeof window === "undefined" ? "" : encodeURIComponent(window.location.href);
  const text = encodeURIComponent(title);

  return (
    <div className="share-buttons" aria-label="مشاركة المحتوى">
      <button type="button" onClick={() => void share()}>{copied ? "تم نسخ الرابط ✓" : "مشاركة المحتوى"}</button>
      <a href={"https://t.me/share/url?url=" + encoded + "&text=" + text} target="_blank" rel="noreferrer">تيليجرام</a>
      <a href={"https://wa.me/?text=" + text + "%20" + encoded} target="_blank" rel="noreferrer">واتساب</a>
    </div>
  );
}
