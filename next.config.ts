import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Static HTML export for Hostinger shared hosting: `npm run build` writes the
   * site to out/. Upload the contents of out/ to public_html. The forms post to
   * the PHP scripts in public/api, which Hostinger runs.
   */
  output: "export",
  // Emits /about/index.html so Apache serves /about/ without rewrite rules.
  trailingSlash: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
