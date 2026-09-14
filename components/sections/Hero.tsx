import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Container } from "@/components/ui/Container";
import { placeholderContent } from "@/lib/placeholders/content";
import type { Page } from "@/types/database";

export function Hero({ page }: { page: Page | null }) {
  const title = page?.hero_title || placeholderContent.hero.title;
  const subtitle = page?.hero_subtitle || placeholderContent.hero.subtitle;
  const image = page?.hero_image_url ?? null;
  const ctaPrimary = page?.hero_cta_label || placeholderContent.hero.ctaPrimary;
  const ctaSecondary = page?.hero_cta_secondary_label || placeholderContent.hero.ctaSecondary;

  return (
    <section className="relative">
      <PlaceholderImage
        src={image}
        alt={title}
        label={placeholderContent.hero.image}
        className="h-[82vh] min-h-[560px] w-full"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(42,36,32,0.55)] via-[rgba(42,36,32,0.08)] to-transparent" />
      <div className="absolute inset-0 flex items-end">
        <Container className="w-full pb-16">
          <div className="max-w-xl">
            <h1 className="h-display text-5xl text-[var(--color-cream)] sm:text-6xl md:text-7xl">
              {title}
            </h1>
            <p className="mt-5 max-w-md text-base text-[var(--color-cream)]/90 sm:text-lg">
              {subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/atelier" variant="light">
                {ctaPrimary}
              </Button>
              <Button href="/standort" variant="light-outline">
                {ctaSecondary}
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
