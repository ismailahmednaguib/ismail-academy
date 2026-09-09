import { ImageResponse } from "next/og";
import { getSiteContent } from "@/lib/content";

export const alt = "أكاديمية إسماعيل أحمد نجيب";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const { settings } = await getSiteContent();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#173a35",
          direction: "rtl",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "#0f2b27",
            color: "#e4c888",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 64,
            fontWeight: 700,
            marginBottom: 36,
          }}
        >
          ا
        </div>
        <div
          style={{
            color: "#fbfaf5",
            fontSize: 56,
            fontWeight: 700,
            textAlign: "center",
            padding: "0 60px",
          }}
        >
          {settings.name}
        </div>
        <div
          style={{
            color: "#c9d6cd",
            fontSize: 28,
            marginTop: 18,
            textAlign: "center",
          }}
        >
          {settings.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
