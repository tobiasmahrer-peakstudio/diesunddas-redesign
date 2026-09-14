import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { placeholderContent } from "@/lib/placeholders/content";

export function GiftWishBox() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="flex flex-col items-center gap-6 rounded-[var(--radius-lg)] border border-[var(--color-beige)] bg-[var(--color-paper)] px-8 py-16 text-center sm:px-16">
          <h2 className="h-display text-3xl text-[var(--color-ink)] sm:text-4xl">
            {placeholderContent.giftWishBox.heading}
          </h2>
          <p className="max-w-xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
            {placeholderContent.giftWishBox.text}
          </p>
          <Button href="/geschenke#wunsch-box" variant="primary" className="mt-2">
            Mehr erfahren
          </Button>
        </div>
      </Container>
    </section>
  );
}
