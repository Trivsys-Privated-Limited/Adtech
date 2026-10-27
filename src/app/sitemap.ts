import type { MetadataRoute } from "next";
import { metadataBaseUrl } from "@/config/site";
import { legalNav, mainNav } from "@/content/navigation";
import { caseStudies } from "@/content/work";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, metadataBaseUrl).toString();
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
