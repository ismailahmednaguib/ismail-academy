import { ImageResponse } from "next/og";
import { getSiteContent } from "@/lib/content";

export const alt = "أكاديمية إسماعيل أحمد نجيب";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpengraphImage() {
  const { settings } = await getSiteContent();
  const safe = (value: string, fallback: string) => /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
  const ink = safe(settings.inkColor, "#173a35");
  const paper = safe(settings.paperColor, "#fbfaf5");
  const gold = safe(settings.goldSoftColor, "#e4c888");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: ink,
          color: paper,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: "50%",
              background: "#0f2b27",
              color: gold,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 58,
              fontWeight: 700,
            }}
          >
            {settings.mark}
          </div>

          <div
            style={{
              marginTop: 30,
              fontSize: 48,
              fontWeight: 700,
            }}
          >
            {settings.name}
          </div>

          <div
            style={{
              marginTop: 14,
              fontSize: 26,
              color: "#c9d6cd",
            }}
          >
            {settings.tagline}
          </div>
        </div>
      </div>
    ),
    size
  );
}
