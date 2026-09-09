import { ImageResponse } from "next/og";
import { getSiteContent, findBySlug } from "@/lib/content";
import { ogText } from "@/lib/og";

export const alt = "أكاديمية إسماعيل أحمد نجيب";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { courses } = await getSiteContent();
  const course = findBySlug(courses, decodeURIComponent(slug));
  const title = ogText(course?.[0], "COURSE");
  const level = ogText(course?.[3], "");

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
        {level && (
          <div style={{ display: "flex", color: "#e4c888", fontSize: 26, fontWeight: 700, marginBottom: 24 }}>
            {level} · LEARNING PATH
          </div>
        )}
        <div style={{ display: "flex", color: "#fbfaf5", fontSize: 60, fontWeight: 700, lineHeight: 1.3 }}>
          {title}
        </div>
        <div style={{ display: "flex", color: "#9db3aa", fontSize: 26, marginTop: 40 }}>
          ISMAIL ACADEMY
        </div>
      </div>
    ),
    { ...size }
  );
}
