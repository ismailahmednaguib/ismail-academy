import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "أكاديمية إسماعيل أحمد نجيب",
    short_name: "أكاديمية إسماعيل",
    description: "منصة عربية للعلم النافع والدروس والمجالس والمكتبة.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfaf5",
    theme_color: "#173a35",
    lang: "ar",
    dir: "rtl",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
