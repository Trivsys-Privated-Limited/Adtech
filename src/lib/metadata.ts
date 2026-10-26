import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/**
 * Metadata for an inner page. Canonical URLs are only emitted once the
 * production domain (NEXT_PUBLIC_SITE_URL) is configured.
 */
export function pageMetadata(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: siteConfig.url ? { canonical: path } : undefined,
    openGraph: { title, description, url: path },
  };
}
