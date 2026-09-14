import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { cn } from "@/lib/utils";
import { getInspirations } from "@/lib/data";
import type { InspirationCategory } from "@/types/database";
import { resolveMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata("/inspiration", {
    title: "Inspiration",
    description:
      "Outfit-Inspirationen, Geschenkideen, Neuheiten und saisonale Impressionen aus dem ATELIER dies & das.",
  });
}

const filters: { label: string; value: InspirationCategory | "alle" }[] = [
  { label: "Alle", value: "alle" },
  { label: "Outfit-Inspirationen", value: "outfit" },
  { label: "Geschenkideen", value: "geschenkidee" },
  { label: "Neuheiten", value: "neuheit" },
  { label: "Saisonale Inspiration", value: "saisonal" },
];

export default async function InspirationPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string }>;
}) {
  const { kategorie } = await searchParams;
  const active = (kategorie as InspirationCategory | undefined) ?? "alle";
  const inspirations = await getInspirations(active === "alle" ? undefined : active);

  return (
    <>
      <PageHero
        eyebrow="Inspiration"
        title="Momente zum Entdecken."
        subtitle="Outfits, Geschenkideen und saisonale Stimmungen aus dem ATELIER."
        imageLabel="[EDITORIAL-FOTO INSPIRATION EINFÜGEN]"
      />

      <Container className="py-16 sm:py-20">
        <div className="mb-12 flex flex-wrap gap-2">
          {filters.map((f) => (
            <Link
              key={f.value}
              href={f.value === "alle" ? "/inspiration" : `/inspiration?kategorie=${f.value}`}
              className={cn(
                "rounded-full border px-5 py-2 text-sm transition-colors",
                active === f.value
                  ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-cream)]"
                  : "border-[var(--color-beige)] text-[var(--color-ink-soft)] hover:border-[var(--color-ink)]"
              )}
            >
              {f.label}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-x-5 gap-y-14 sm:grid-cols-2">
          {inspirations.map((item, i) => (
            <article key={item.id} className={i % 3 === 0 ? "sm:col-span-2" : ""}>
              <PlaceholderImage
                src={item.image_url}
                alt={item.title}
                label="[OUTFIT-FOTO EINFÜGEN]"
                className={i % 3 === 0 ? "aspect-wide" : "aspect-editorial"}
              />
              <h2 className="h-display mt-5 text-2xl text-[var(--color-ink)] sm:text-3xl">
                {item.title}
              </h2>
              <p className="mt-2 max-w-lg text-base leading-relaxed text-[var(--color-ink-soft)]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </>
  );
}
