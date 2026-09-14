import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import type { Category } from "@/types/database";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Sortiment</Eyebrow>
            <h2 className="h-display text-4xl text-[var(--color-ink)] sm:text-5xl">
              Entdecke unsere Welt.
            </h2>
          </div>
          <Link
            href="/sortiment"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-terracotta)]"
          >
            Ganzes Sortiment ansehen <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, i) => (
            <Link
              key={category.id}
              href={`/sortiment/${category.slug}`}
              className={`group relative block overflow-hidden ${
                i === 0 ? "sm:col-span-2 sm:row-span-2" : ""
              }`}
            >
              <PlaceholderImage
                src={category.image_url}
                alt={category.name}
                label={`[PRODUKTFOTO ${category.name.toUpperCase()} EINFÜGEN]`}
                className={i === 0 ? "aspect-square sm:aspect-auto sm:h-full" : "aspect-editorial"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(42,36,32,0.65)] via-transparent to-transparent transition-opacity group-hover:from-[rgba(42,36,32,0.75)]" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="h-display text-2xl text-[var(--color-cream)] sm:text-3xl">
                  {category.name}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-[var(--color-cream)]/80 opacity-0 transition-opacity group-hover:opacity-100">
                  Entdecken <ArrowUpRight size={14} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
