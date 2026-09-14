import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export function FineFoodTeaser() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <Eyebrow>Fine Food</Eyebrow>
            <h2 className="h-display text-4xl text-[var(--color-ink)] sm:text-5xl">
              Delikatessen für feine Momente.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--color-ink-soft)]">
              [TEXT EINFÜGEN – Auswahl an Delikatessen, Getränken und regionalen
              Spezialitäten im ATELIER]
            </p>
            <div className="mt-8">
              <Button href="/sortiment/fine-food" variant="secondary">
                Fine Food entdecken
              </Button>
            </div>
          </div>
          <PlaceholderImage
            src={null}
            alt="Fine Food Auswahl"
            label="[FINE-FOOD-FOTO EINFÜGEN]"
            className="order-1 aspect-editorial lg:order-2"
          />
        </div>
      </Container>
    </section>
  );
}
