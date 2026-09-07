import type { MetadataRoute } from "next"

import { absoluteUrl } from "@/lib/seo/config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/api/",
          "/login",
          "/register",
          "/reset-password",
          "/verify",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/api/",
          "/login",
          "/register",
          "/reset-password",
          "/verify",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  }
}
