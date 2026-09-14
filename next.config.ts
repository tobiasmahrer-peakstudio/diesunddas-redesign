import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add 301s here once the old atelierdiesunddas.ch URL structure is known
  // (see "SEO-Migration" in the README) — e.g.:
  // async redirects() {
  //   return [{ source: "/alte-url", destination: "/neue-url", permanent: true }];
  // },
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
  },
};

export default nextConfig;
