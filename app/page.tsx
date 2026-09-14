import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { IntroEditorial } from "@/components/sections/IntroEditorial";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { NewArrivals } from "@/components/sections/NewArrivals";
import { InspirationTeaser } from "@/components/sections/InspirationTeaser";
import { GiftsTeaser } from "@/components/sections/GiftsTeaser";
import { GiftWishBox } from "@/components/sections/GiftWishBox";
import { FineFoodTeaser } from "@/components/sections/FineFoodTeaser";
import { LabelsStrip } from "@/components/sections/LabelsStrip";
import {
  getBrands,
  getCategories,
  getFeaturedProducts,
  getGiftItems,
  getInspirations,
  getPage,
} from "@/lib/data";
import { resolveMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata("/", {
    title: "ATELIER dies & das — Schönes für dich & dein Zuhause | Laufen",
    description:
      "ATELIER dies & das in Laufen: Wohnaccessoires, Mode, Schmuck, Geschenke und Fine Food — sorgfältig ausgewählt, persönlich beraten.",
  });
}

export default async function HomePage() {
  const [page, categories, featuredProducts, inspirations, gifts, brands] = await Promise.all([
    getPage("home"),
    getCategories(),
    getFeaturedProducts(),
    getInspirations(),
    getGiftItems(),
    getBrands(),
  ]);

  return (
    <>
      <Hero page={page} />
      <IntroEditorial page={page} />
      <CategoryGrid categories={categories} />
      <NewArrivals products={featuredProducts} />
      <InspirationTeaser inspiration={inspirations[0] ?? null} />
      <GiftsTeaser gifts={gifts} />
      <FineFoodTeaser />
      <LabelsStrip brands={brands} />
      <GiftWishBox />
    </>
  );
}
