import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import type { Inspiration } from "@/types/database";

export function InspirationTeaser({ inspiration }: { inspiration: Inspiration | null }) {
  if (!inspiration) return null;

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <PlaceholderImage
            src={inspiration.image_url}
            alt={inspiration.title}
            label="[OUTFIT-FOTO EINFÜGEN]"
            className="aspect-editorial order-1 lg:order-none"
          />
          <div>
            <Eyebrow>Inspiration</Eyebrow>
            <h2 className="h-display text-4xl text-[var(--color-ink)] sm:text-5xl">
              {inspiration.title}
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--color-ink-soft)]">
              {inspiration.description}
            </p>
            <div className="mt-8">
              <Button href="/inspiration" variant="secondary">
                Im ATELIER entdecken
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
