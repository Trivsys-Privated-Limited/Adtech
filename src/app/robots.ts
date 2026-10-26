import type { MetadataRoute } from "next";
import { metadataBaseUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: new URL("/sitemap.xml", metadataBaseUrl).toString(),
  };
}
