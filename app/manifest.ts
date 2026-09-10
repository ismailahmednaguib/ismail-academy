import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "أكاديمية إسماعيل أحمد نجيب · Ismail Academy",
    short_name: "Ismail Academy",
    description: "A global learning space for beneficial knowledge, lessons, gatherings and reading.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfaf5",
    theme_color: "#173a35",
    lang: "ar",
    dir: "rtl",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
