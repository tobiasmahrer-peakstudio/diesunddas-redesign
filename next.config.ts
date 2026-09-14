import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 301s from the old atelierdiesunddas.ch (WordPress/WooCommerce)
  // URL structure, taken from its live sitemap.xml on 2026-09-14 —
  // see "SEO-Migration" in the README.
  async redirects() {
    return [
      { source: "/wohnaccessoires-1", destination: "/sortiment/wohnen", permanent: true },
      { source: "/outfit-inspirationen", destination: "/inspiration", permanent: true },
      { source: "/geschenkk%C3%B6rbe-oder-sets", destination: "/geschenke", permanent: true },
      {
        source: "/geschenk-wunsch-box",
        destination: "/geschenke#wunsch-box",
        permanent: true,
      },
      { source: "/f%C3%BCr-dich-deine-liebsten", destination: "/geschenke", permanent: true },
      { source: "/lokales", destination: "/sortiment/handgemachtes", permanent: true },
      { source: "/finefood", destination: "/sortiment/fine-food", permanent: true },
      // /standort/ already matches the new site 1:1 — no redirect needed.
      { source: "/about", destination: "/atelier", permanent: true },
    ];
  },
  images: {
    // Uploaded images are committed to content/uploads/ in this repo
    // and served straight from GitHub's raw CDN.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/**/content/uploads/**",
      },
    ],
    // Next's built-in image optimizer needs a Node server and isn't
    // available on Cloudflare Workers without the paid Cloudflare
    // Images product. Serving the already-reasonably-sized uploads
    // as-is (still lazy-loaded, still responsive `sizes`) avoids that
    // cost — see "Deployment auf Cloudflare" in the README.
    unoptimized: true,
  },
};

export default nextConfig;
