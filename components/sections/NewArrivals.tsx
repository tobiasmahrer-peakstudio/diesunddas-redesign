import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import type { Product } from "@/types/database";

const placeholderSlots: Partial<Product>[] = [
  { id: "p1", title: "[PRODUKTNAME EINFÜGEN]", brand: null },
  { id: "p2", title: "[PRODUKTNAME EINFÜGEN]", brand: null },
  { id: "p3", title: "[PRODUKTNAME EINFÜGEN]", brand: null },
];

export function NewArrivals({ products }: { products: Product[] }) {
  const items = products.length > 0 ? products : placeholderSlots;

  return (
    <section className="bg-[var(--color-sand)] py-20 sm:py-28">
      <Container>
        <div className="mb-12 text-center">
          <Eyebrow>Immer in Bewegung</Eyebrow>
          <h2 className="h-display text-4xl text-[var(--color-ink)] sm:text-5xl">
            Immer wieder etwas Neues.
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
          {items.map((product) => (
            <div key={product.id}>
              <PlaceholderImage
                src={product.image_url}
                alt={product.title ?? "Produkt"}
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
      </Container>
    </section>
  );
}
