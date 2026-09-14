import type { Metadata } from "next";
import { getSeoOverride } from "@/lib/data";

/**
 * Merges a page's default metadata with an admin-configured override
 * from content/seo.json (see app/admin/(dashboard)/seo). Only fields
 * the admin actually filled in replace the default — an override
 * missing a description, say, still falls back to the page's own.
 */
export async function resolveMetadata(
  pathname: string,
  fallback: { title: string; description: string }
): Promise<Metadata> {
  const override = await getSeoOverride(pathname);

  return {
    title: override?.title || fallback.title,
    description: override?.description || fallback.description,
    openGraph: {
      title: override?.title || fallback.title,
      description: override?.description || fallback.description,
      ...(override?.og_image_url ? { images: [override.og_image_url] } : {}),
    },
  };
}
