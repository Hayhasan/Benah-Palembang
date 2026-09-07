import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Benah Palembang",
    short_name: "Benah",
    description:
      "Portal media editorial, berita, agenda kegiatan, budaya, dan ragam cerita kota Palembang.",
    start_url: "/",
    display: "standalone",
    background_color: "#111215",
    theme_color: "#B91C1C",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
