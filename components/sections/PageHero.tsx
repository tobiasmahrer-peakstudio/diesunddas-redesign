import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  imageLabel,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string | null;
  image?: string | null;
  imageLabel: string;
}) {
  return (
    <section className="relative">
      <PlaceholderImage
        src={image}
        alt={title}
        label={imageLabel}
        className="h-[46vh] min-h-[340px] w-full"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(42,36,32,0.55)] via-[rgba(42,36,32,0.05)] to-transparent" />
      <div className="absolute inset-0 flex items-end">
        <Container className="w-full pb-12">
          {eyebrow && (
            <p className="h-eyebrow mb-3 text-[var(--color-rose)]">{eyebrow}</p>
          )}
          <h1 className="h-display max-w-2xl text-4xl text-[var(--color-cream)] sm:text-5xl md:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-lg text-base text-[var(--color-cream)]/90 sm:text-lg">
              {subtitle}
            </p>
          )}
        </Container>
      </div>
    </section>
  );
}
