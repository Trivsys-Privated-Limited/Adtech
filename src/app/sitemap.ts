import type { MetadataRoute } from "next";
import { metadataBaseUrl } from "@/config/site";
import { legalNav, mainNav } from "@/content/navigation";
import { caseStudies } from "@/content/work";

// Required by the static export (output: "export").
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Pages are exported as folders (trailingSlash), so list them with the slash.
  const url = (path: string) => new URL(path.endsWith("/") ? path : `${path}/`, metadataBaseUrl).toString();
  return [
    ...mainNav.map((item) => ({
      url: url(item.href),
      changeFrequency: "monthly" as const,
      priority: item.href === "/" ? 1 : 0.8,
    })),
    ...legalNav.map((item) => ({
      url: url(item.href),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
    ...caseStudies.map((study) => ({
      url: url(`/work/${study.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
