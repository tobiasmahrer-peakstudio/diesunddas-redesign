import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { getGalleryImages } from "@/lib/data";
import { resolveMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata("/impressionen", {
    title: "Impressionen",
    description: "Einblicke in das ATELIER dies & das — Laden, Produkte, Details und Stimmungen.",
  });
}

export default async function ImpressionenPage() {
  const images = await getGalleryImages();

  return (
    <>
      <PageHero
        eyebrow="Impressionen"
        title="Einblicke ins ATELIER."
        imageLabel="[LADENBILD EINFÜGEN]"
      />

      <Container className="py-16 sm:py-24">
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {images.map((image, i) => (
            <figure key={image.id}>
              <PlaceholderImage
                src={image.image_url || null}
                alt={image.title ?? "Impression aus dem ATELIER"}
                label="[LADENBILD / DETAILAUFNAHME EINFÜGEN]"
                className={i % 5 === 0 ? "aspect-editorial" : i % 3 === 0 ? "aspect-square" : "aspect-wide"}
              />
              {image.title && (
                <figcaption className="mt-2 text-sm text-[var(--color-ink-muted)]">
                  {image.title}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </Container>
    </>
  );
}
