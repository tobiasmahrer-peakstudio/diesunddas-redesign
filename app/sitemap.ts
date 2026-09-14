import type { MetadataRoute } from "next";
import { getCategories } from "@/lib/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.atelierdiesunddas.ch";

const staticRoutes = [
  "",
  "/atelier",
  "/sortiment",
  "/inspiration",
  "/geschenke",
  "/impressionen",
  "/standort",
  "/kontakt",
  "/impressum",
  "/datenschutz",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await getCategories();

  const categoryRoutes = categories.map((c) => `/sortiment/${c.slug}`);

  return [...staticRoutes, ...categoryRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
