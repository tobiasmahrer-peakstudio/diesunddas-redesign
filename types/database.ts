/**
 * Domain types mirroring the JSON files under content/ — the "GitHub
 * as a database" this project's CMS reads from and writes to. Kept
 * hand-written and small on purpose, to stay readable for a small
 * CMS surface. See lib/github.ts and lib/data.ts.
 */

/* ---------------------------------------------------------------- */
/* Site-wide settings                                                */
/* ---------------------------------------------------------------- */

export interface SiteSettings {
  company_name: string;
  street: string;
  postal_code: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  instagram_url: string | null;
  facebook_url: string | null;
  google_maps_url: string | null;
  footer_text: string | null;
  copyright_text: string | null;
  logo_url: string | null;
  favicon_url: string | null;
}

/* ---------------------------------------------------------------- */
/* Opening hours                                                     */
/* ---------------------------------------------------------------- */

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface OpeningHours {
  weekday: Weekday;
  closed: boolean;
  morning_from: string | null;
  morning_to: string | null;
  afternoon_from: string | null;
  afternoon_to: string | null;
}

export interface SpecialOpeningHours {
  id: string;
  date: string; // ISO date, e.g. "2026-12-24"
  closed: boolean;
  from_time: string | null;
  to_time: string | null;
  note: string | null;
}

/* ---------------------------------------------------------------- */
/* Pages (flexible section-based CMS pages)                          */
/* ---------------------------------------------------------------- */

export interface PageSection {
  id: string;
  heading: string | null;
  text: string | null;
  image_url: string | null;
}

export interface Page {
  hero_title: string | null;
  hero_subtitle?: string | null;
  hero_image_url: string | null;
  hero_cta_label?: string | null;
  hero_cta_href?: string | null;
  hero_cta_secondary_label?: string | null;
  hero_cta_secondary_href?: string | null;
  intro_heading: string | null;
  intro_text: string | null;
  sections?: PageSection[];
}

/* ---------------------------------------------------------------- */
/* Sortiment: categories + highlighted products                     */
/* ---------------------------------------------------------------- */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  active: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category_id: string | null;
  brand: string | null;
  featured: boolean;
  sort_order: number;
  active: boolean;
}

/* ---------------------------------------------------------------- */
/* Inspiration                                                        */
/* ---------------------------------------------------------------- */

export type InspirationCategory = "outfit" | "geschenkidee" | "neuheit" | "saisonal";

export interface Inspiration {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: InspirationCategory;
  gallery_urls: string[];
  active: boolean;
  sort_order: number;
}

/* ---------------------------------------------------------------- */
/* Gifts                                                              */
/* ---------------------------------------------------------------- */

export type GiftType = "geschenkkorb" | "geschenkset" | "mitbringsel" | "individuell";

export interface GiftItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  type: GiftType;
  price: number | null;
  link_href: string | null;
  active: boolean;
  sort_order: number;
}

/* ---------------------------------------------------------------- */
/* Brands / regional labels                                          */
/* ---------------------------------------------------------------- */

export interface Brand {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  image_url: string | null;
  website_url: string | null;
  active: boolean;
  sort_order: number;
}

/* ---------------------------------------------------------------- */
/* Gallery (Impressionen)                                             */
/* ---------------------------------------------------------------- */

export interface GalleryImage {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  category: string | null;
  sort_order: number;
  active: boolean;
}

/* ---------------------------------------------------------------- */
/* News / Aktuelles                                                   */
/* ---------------------------------------------------------------- */

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  cover_image_url: string | null;
  published_at: string;
  category: string | null;
  excerpt: string | null;
  content: string | null;
  gallery_urls: string[];
  active: boolean;
}

/* ---------------------------------------------------------------- */
/* Team                                                                */
/* ---------------------------------------------------------------- */

export interface TeamMember {
  id: string;
  name: string;
  role: string | null;
  photo_url: string | null;
  bio: string | null;
  sort_order: number;
  active: boolean;
}

/* ---------------------------------------------------------------- */
/* SEO                                                                 */
/* ---------------------------------------------------------------- */

export interface SeoMetadata {
  id: string;
  path: string; // e.g. "/sortiment/wohnen"
  title: string | null;
  description: string | null;
  og_image_url: string | null;
}

/* ---------------------------------------------------------------- */
/* Contact form submissions                                           */
/* ---------------------------------------------------------------- */

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  created_at: string;
  read: boolean;
}

/* ---------------------------------------------------------------- */
/* Legal pages                                                        */
/* ---------------------------------------------------------------- */

export interface LegalContent {
  impressum: string | null;
  datenschutz: string | null;
  lieferbedingungen: string | null;
}
