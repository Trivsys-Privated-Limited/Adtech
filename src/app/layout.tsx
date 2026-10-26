import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { metadataBaseUrl, siteConfig } from "@/config/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const title = "Adtech — Software Development & Technology Solutions";

export const metadata: Metadata = {
  metadataBase: metadataBaseUrl,
  title: { default: title, template: "%s | Adtech" },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "software development company",
    "custom software development",
    "web development",
    "mobile app development",
    "AI and automation",
    "cloud and DevOps",
    "UI/UX design",
  ],
  // Canonical URLs are only emitted once the production domain is configured.
  alternates: siteConfig.url ? { canonical: "/" } : undefined,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title,
    description: siteConfig.description,
    url: "/",
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#07111F",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="flex min-h-svh flex-col">
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
        <RevealObserver />
      </body>
    </html>
  );
}
