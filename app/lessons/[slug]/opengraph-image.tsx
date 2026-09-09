import { ImageResponse } from "next/og";
import { getSiteContent, findBySlug } from "@/lib/content";

export const alt = "أكاديمية إسماعيل أحمد نجيب";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { lessons } = await getSiteContent();
  const lesson = findBySlug(lessons, decodeURIComponent(slug));
  const title = lesson?.[0] ?? "درس";
  const meta = lesson?.[1] ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#173a35",
          direction: "rtl",
          padding: "0 90px",
        }}
      >
        <div style={{ display: "flex", color: "#e4c888", fontSize: 26, fontWeight: 700, marginBottom: 24 }}>
          درس صوتي
        </div>
        <div style={{ display: "flex", color: "#fbfaf5", fontSize: 58, fontWeight: 700, lineHeight: 1.3 }}>
          {title}
        </div>
        <div style={{ display: "flex", color: "#9db3aa", fontSize: 24, marginTop: 40 }}>
          {meta}
        </div>
      </div>
    ),
    { ...size }
  );
}
