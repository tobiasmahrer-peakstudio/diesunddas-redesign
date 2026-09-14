import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { getCategories } from "@/lib/data";
import { resolveMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata("/sortiment", {
    title: "Sortiment",
    description:
      "Wohnaccessoires, Mode & Accessoires, Schmuck, Geschenke, Fine Food und Handgemachtes im ATELIER dies & das in Laufen.",
  });
}

export default async function SortimentPage() {
  const categories = await getCategories();

  return (
    <>
      <PageHero
        eyebrow="Sortiment"
        title="Entdecke unsere Welt."
        subtitle="Bewusst ausgewählte Produkte für dich und dein Zuhause — von Wohnaccessoires bis Fine Food."
        imageLabel="[LADENBILD SORTIMENT-ÜBERSICHT EINFÜGEN]"
      />
      <Container className="py-20 sm:py-28">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/sortiment/${category.slug}`}
              className="group block"
            >
              <PlaceholderImage
                src={category.image_url}
                alt={category.name}
                label={`[PRODUKTFOTO ${category.name.toUpperCase()} EINFÜGEN]`}
                className="aspect-editorial"
              />
              <div className="mt-4 flex items-center justify-between">
                <h2 className="h-display text-2xl text-[var(--color-ink)]">{category.name}</h2>
                <ArrowUpRight
                  size={18}
                  className="text-[var(--color-ink-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--color-terracotta-dark)]"
                />
              </div>
              {category.description && (
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                  {category.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
