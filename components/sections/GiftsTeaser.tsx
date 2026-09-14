import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import type { GiftItem } from "@/types/database";

export function GiftsTeaser({ gifts }: { gifts: GiftItem[] }) {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="mb-12 text-center">
          <Eyebrow>Geschenkideen</Eyebrow>
          <h2 className="h-display text-4xl text-[var(--color-ink)] sm:text-5xl">
            Ein Geschenk, das von Herzen kommt.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {gifts.slice(0, 4).map((gift) => (
            <div key={gift.id}>
              <PlaceholderImage
                src={gift.image_url}
                alt={gift.title}
                label="[GESCHENKSET FOTO EINFÜGEN]"
                className="aspect-editorial"
              />
              <h3 className="mt-4 text-base font-medium text-[var(--color-ink)]">{gift.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                {gift.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button href="/geschenke" variant="secondary">
            Alle Geschenkideen
          </Button>
        </div>
      </Container>
    </section>
  );
}
