import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { placeholderContent } from "@/lib/placeholders/content";
import { getGiftItems } from "@/lib/data";
import type { GiftItem, GiftType } from "@/types/database";
import { resolveMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata("/geschenke", {
    title: "Geschenke",
    description:
      "Geschenkkörbe, Geschenksets und individuelle Geschenkideen im ATELIER dies & das in Laufen — inklusive Geschenk-Wunsch-Box.",
  });
}

const typeLabels: Record<GiftType, string> = {
  geschenkkorb: "Geschenkkörbe",
  geschenkset: "Geschenksets",
  mitbringsel: "Kleine Mitbringsel",
  individuell: "Individuelle Geschenkideen",
};

function groupByType(gifts: GiftItem[]) {
  return gifts.reduce<Record<string, GiftItem[]>>((acc, gift) => {
    (acc[gift.type] ??= []).push(gift);
    return acc;
  }, {});
}

export default async function GeschenkePage() {
  const gifts = await getGiftItems();
  const grouped = groupByType(gifts);

  return (
    <>
      <PageHero
        eyebrow="Geschenke"
        title="Ein Geschenk, das von Herzen kommt."
        subtitle="Geschenkkörbe, Sets und kleine Mitbringsel — für jeden Anlass etwas Besonderes."
        imageLabel="[GESCHENKSET FOTO EINFÜGEN]"
      />

      <Container className="py-20 sm:py-28">
        <div className="flex flex-col gap-20">
          {(Object.keys(typeLabels) as GiftType[]).map((type) => {
            const items = grouped[type];
            if (!items || items.length === 0) return null;
            return (
              <div key={type}>
                <Eyebrow>{typeLabels[type]}</Eyebrow>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((gift) => (
                    <div key={gift.id}>
                      <PlaceholderImage
                        src={gift.image_url}
                        alt={gift.title}
                        label="[GESCHENKSET FOTO EINFÜGEN]"
                        className="aspect-editorial"
                      />
                      <h3 className="mt-4 text-lg font-medium text-[var(--color-ink)]">
                        {gift.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                        {gift.description}
                      </p>
                      {gift.price != null && (
                        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                          ab CHF {gift.price.toFixed(2)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Container>

      <section id="wunsch-box" className="scroll-mt-24 bg-[var(--color-sand)] py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>Geschenk-Wunsch-Box</Eyebrow>
            <h2 className="h-display text-4xl text-[var(--color-ink)] sm:text-5xl">
              {placeholderContent.giftWishBox.heading}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[var(--color-ink-soft)]">
              {placeholderContent.giftWishBox.text}
            </p>
            <div className="mt-8">
              <Button href="/kontakt" variant="primary">
                Jetzt anfragen
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
