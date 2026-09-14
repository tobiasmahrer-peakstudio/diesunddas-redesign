import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { placeholderContent } from "@/lib/placeholders/content";
import type { Page } from "@/types/database";

export function IntroEditorial({ page }: { page: Page | null }) {
  const heading = page?.intro_heading || placeholderContent.intro.heading;
  const text = page?.intro_text || placeholderContent.intro.text;

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Willkommen im Atelier</Eyebrow>
          <h2 className="h-display text-4xl text-[var(--color-ink)] sm:text-5xl">{heading}</h2>
          <p className="mt-6 text-lg leading-relaxed text-[var(--color-ink-soft)]">{text}</p>
        </div>
      </Container>
    </section>
  );
}
