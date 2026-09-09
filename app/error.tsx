"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="not-found">
      <p className="kicker">حصل خطأ غير متوقع</p>
      <h1 className="page-title">حاول تاني</h1>
      <p className="detail-body">الصفحة واجهت مشكلة مؤقتة، جرّب تاني أو ارجع للرئيسية.</p>
      <button className="primary" onClick={() => reset()}>إعادة المحاولة ←</button>
    </main>
  );
}
