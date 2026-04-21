import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/rehab", "/itp", "/pitching", "/strength", "/goals", "/journal", "/workload", "/settings", "/soreness"],
    },
    sitemap: "https://pitchback.app/sitemap.xml",
  };
}
