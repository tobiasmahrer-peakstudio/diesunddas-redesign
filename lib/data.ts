import { readJSON } from "@/lib/github";
import type {
  Brand,
  Category,
  GalleryImage,
  GiftItem,
  Inspiration,
  LegalContent,
  NewsPost,
  OpeningHours,
  Page,
  Product,
  SeoMetadata,
  SiteSettings,
  SpecialOpeningHours,
  TeamMember,
} from "@/types/database";

/**
 * Data access layer — every getter reads its content/<file>.json via
 * lib/github.ts, which itself falls back to the locally bundled copy
 * when GitHub isn't configured. So the site is always fully
 * browsable, both with and without a connected GitHub repo.
 */

export const defaultSiteSettings: SiteSettings = {
  company_name: "ATELIER dies & das GmbH",
  street: "Wassertorgasse 2",
  postal_code: "4242",
  city: "Laufen",
  country: "Schweiz",
  phone: "076 295 77 91",
  email: "[AKTUELLE E-MAIL AUS CMS EINFÜGEN]",
  instagram_url: null,
  facebook_url: null,
  google_maps_url: "https://www.google.com/maps/search/?api=1&query=Wassertorgasse+2+4242+Laufen",
  footer_text: null,
  copyright_text: "ATELIER dies & das GmbH",
  logo_url: null,
  favicon_url: null,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  return (await readJSON<SiteSettings>("site-settings.json")) ?? defaultSiteSettings;
}

export async function getOpeningHours(): Promise<OpeningHours[]> {
  return (await readJSON<OpeningHours[]>("opening-hours.json")) ?? [];
}

export async function getSpecialOpeningHours(): Promise<SpecialOpeningHours[]> {
  const all = (await readJSON<SpecialOpeningHours[]>("special-opening-hours.json")) ?? [];
  const today = new Date().toISOString().slice(0, 10);
  return all.filter((entry) => entry.date >= today).sort((a, b) => a.date.localeCompare(b.date));
}

export async function getCategories(): Promise<Category[]> {
  const all = (await readJSON<Category[]>("categories.json")) ?? [];
  return all.filter((c) => c.active).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getProducts(categoryId?: string): Promise<Product[]> {
  const all = (await readJSON<Product[]>("products.json")) ?? [];
  return all
    .filter((p) => p.active && (!categoryId || p.category_id === categoryId))
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = (await readJSON<Product[]>("products.json")) ?? [];
  return all
    .filter((p) => p.active && p.featured)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function getInspirations(category?: string): Promise<Inspiration[]> {
  const all = (await readJSON<Inspiration[]>("inspirations.json")) ?? [];
  return all
    .filter((i) => i.active && (!category || i.category === category))
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function getGiftItems(): Promise<GiftItem[]> {
  const all = (await readJSON<GiftItem[]>("gifts.json")) ?? [];
  return all.filter((g) => g.active).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getBrands(): Promise<Brand[]> {
  const all = (await readJSON<Brand[]>("brands.json")) ?? [];
  return all.filter((b) => b.active).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const all = (await readJSON<GalleryImage[]>("gallery.json")) ?? [];
  return all.filter((g) => g.active).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getNewsPosts(): Promise<NewsPost[]> {
  const all = (await readJSON<NewsPost[]>("news.json")) ?? [];
  return all
    .filter((n) => n.active)
    .sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const all = (await readJSON<TeamMember[]>("team.json")) ?? [];
  return all.filter((t) => t.active).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getPage(slug: "home" | "atelier"): Promise<Page | null> {
  return readJSON<Page>(`pages/${slug}.json`);
}

export async function getLegalContent(): Promise<LegalContent> {
  return (
    (await readJSON<LegalContent>("legal.json")) ?? {
      impressum: null,
      datenschutz: null,
      lieferbedingungen: null,
    }
  );
}

export async function getSeoOverride(pathname: string): Promise<SeoMetadata | null> {
  const all = (await readJSON<SeoMetadata[]>("seo.json")) ?? [];
  return all.find((entry) => entry.path === pathname) ?? null;
}
