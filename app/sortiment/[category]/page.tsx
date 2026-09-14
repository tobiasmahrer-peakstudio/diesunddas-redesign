import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/data";
import { resolveMetadata } from "@/lib/seo";

type Params = { category: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return resolveMetadata(`/sortiment/${slug}`, {
    title: category.name,
    description:
      category.description ??
      `${category.name} im ATELIER dies & das — sorgfältig ausgewählt, in Laufen entdecken.`,
  });
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProducts(category.id);

  return (
    <>
      <PageHero
        eyebrow="Sortiment"
        title={category.name}
        subtitle={category.description}
        image={category.image_url}
        imageLabel={`[PRODUKTFOTO ${category.name.toUpperCase()} EINFÜGEN]`}
      />

      <Container className="py-20 sm:py-28">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <div key={product.id}>
                <PlaceholderImage
                  src={product.image_url}
                  alt={product.title}
                  label="[PRODUKTFOTO EINFÜGEN]"
                  className="aspect-editorial"
                />
                <h3 className="mt-4 text-base font-medium text-[var(--color-ink)]">
                  {product.title}
                </h3>
                {product.brand && (
                  <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{product.brand}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-lg text-center">
            <Eyebrow>{category.name}</Eyebrow>
            <p className="text-lg leading-relaxed text-[var(--color-ink-soft)]">
              Dieses Sortiment wächst laufend — die schönsten Stücke findest du direkt bei
              uns im ATELIER in Laufen. Komm vorbei und lass dich inspirieren.
            </p>
          </div>
        )}
      </Container>
    </>
  );
}
