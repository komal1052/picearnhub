import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://picearnhub.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"], // Protect admin portal & raw APIs from indexing
      },
      // Allow Generative AI Search Engines to index community content
      {
        userAgent: ["GPTBot", "Google-Extended", "PerplexityBot", "ClaudeBot"],
        allow: ["/", "/photos/", "/contests/", "/hall-of-fame/", "/faq/"],
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}