import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { placeholderContent } from "@/lib/placeholders/content";
import type { Brand } from "@/types/database";

export function LabelsStrip({ brands }: { brands: Brand[] }) {
  return (
    <section className="bg-[var(--color-sand)] py-20 sm:py-28">
      <Container>
        <div className="mx-auto mb-12 max-w-xl text-center">
          <Eyebrow>Regionale Labels</Eyebrow>
          <h2 className="h-display text-4xl text-[var(--color-ink)] sm:text-5xl">
            {placeholderContent.labels.heading}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[var(--color-ink-soft)]">
            {placeholderContent.labels.text}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {brands.slice(0, 4).map((brand) => (
            <div
              key={brand.id}
              className="flex aspect-square flex-col items-center justify-center gap-3 border border-[var(--color-beige)] bg-[var(--color-paper)] p-6 text-center"
            >
              <PlaceholderImage
                src={brand.logo_url}
                alt={brand.name}
                label="[LABEL-LOGO EINFÜGEN]"
                className="h-16 w-full"
              />
              <p className="text-sm font-medium text-[var(--color-ink)]">{brand.name}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
