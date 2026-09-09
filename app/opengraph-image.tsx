import { ImageResponse } from "next/og";

export const alt = "أكاديمية إسماعيل أحمد نجيب";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#173a35",
          color: "#fbfaf5",
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
              color: "#e4c888",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 58,
              fontWeight: 700,
            }}
          >
            A
          </div>

          <div
            style={{
              marginTop: 30,
              fontSize: 48,
              fontWeight: 700,
            }}
          >
            Ismail Ahmed Naguib Academy
          </div>

          <div
            style={{
              marginTop: 14,
              fontSize: 26,
              color: "#c9d6cd",
            }}
          >
            Knowledge that is understood, impact that remains
          </div>
        </div>
      </div>
    ),
    size
  );
}