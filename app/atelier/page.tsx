import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { placeholderContent } from "@/lib/placeholders/content";
import { getPage, getTeamMembers } from "@/lib/data";
import { resolveMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata("/atelier", {
    title: "Das Atelier",
    description:
      "Die Geschichte hinter ATELIER dies & das in Laufen — persönlich geführt, mit sorgfältig ausgewähltem Sortiment.",
  });
}

export default async function AtelierPage() {
  const [page, team] = await Promise.all([getPage("atelier"), getTeamMembers()]);
  const sections = page?.sections ?? [];

  return (
    <>
      <PageHero
        eyebrow="Das Atelier"
        title={page?.hero_title || placeholderContent.about.heading}
        image={page?.hero_image_url}
        imageLabel={placeholderContent.about.heroImage}
      />

      <Container className="py-20 sm:py-28">
        <div className="mx-auto max-w-2xl">
          <Eyebrow>{page?.intro_heading || "Unsere Geschichte"}</Eyebrow>
          <p className="whitespace-pre-line text-lg leading-relaxed text-[var(--color-ink-soft)]">
            {page?.intro_text || placeholderContent.about.story}
          </p>
        </div>
      </Container>

      {sections.map((section, i) => (
        <section key={section.id} className="py-4 sm:py-8">
          <Container>
            <div
              className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                i % 2 === 1 ? "[&>*:first-child]:lg:order-2" : ""
              }`}
            >
              <PlaceholderImage
                src={section.image_url}
                alt={section.heading ?? ""}
                label={placeholderContent.about.heroImage}
                className="aspect-editorial"
              />
              <div>
                {section.heading && (
                  <h2 className="h-display text-3xl text-[var(--color-ink)] sm:text-4xl">
                    {section.heading}
                  </h2>
                )}
                {section.text && (
                  <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-[var(--color-ink-soft)]">
                    {section.text}
                  </p>
                )}
              </div>
            </div>
          </Container>
        </section>
      ))}

      {team.length > 0 && (
        <section className="bg-[var(--color-sand)] py-20 sm:py-28">
          <Container>
            <div className="mb-12 text-center">
              <Eyebrow>Team</Eyebrow>
              <h2 className="h-display text-3xl text-[var(--color-ink)] sm:text-4xl">
                Die Gesichter im ATELIER.
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => (
                <div key={member.id} className="text-center">
                  <PlaceholderImage
                    src={member.photo_url}
                    alt={member.name}
                    label="[TEAMFOTO EINFÜGEN]"
                    className="aspect-square mx-auto max-w-[280px] rounded-full"
                  />
                  <h3 className="mt-5 text-lg font-medium text-[var(--color-ink)]">
                    {member.name}
                  </h3>
                  {member.role && (
                    <p className="text-sm text-[var(--color-terracotta-dark)]">{member.role}</p>
                  )}
                  {member.bio && (
                    <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[var(--color-ink-soft)]">
                      {member.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
