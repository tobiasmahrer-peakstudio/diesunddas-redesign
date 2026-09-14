import type { Metadata } from "next";
import { Phone, Mail, Navigation } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OpeningHoursTable } from "@/components/sections/OpeningHoursTable";
import { getOpeningHours, getSiteSettings, getSpecialOpeningHours } from "@/lib/data";
import { resolveMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata("/standort", {
    title: "Standort",
    description:
      "ATELIER dies & das, Wassertorgasse 2, 4242 Laufen — Öffnungszeiten, Anfahrt und Kontakt.",
  });
}

export default async function StandortPage() {
  const [settings, hours, specialHours] = await Promise.all([
    getSiteSettings(),
    getOpeningHours(),
    getSpecialOpeningHours(),
  ]);

  const mapsQuery = encodeURIComponent(
    `${settings.street}, ${settings.postal_code} ${settings.city}, ${settings.country}`
  );
  const mapsEmbedUrl = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;
  const mapsDirectionsUrl =
    settings.google_maps_url ?? `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <>
      <PageHero eyebrow="Standort" title="Komm vorbei." imageLabel="[SCHAUFENSTER-FOTO EINFÜGEN]" />

      <Container className="py-16 sm:py-24">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Eyebrow>Adresse</Eyebrow>
            <address className="not-italic text-lg leading-relaxed text-[var(--color-ink)]">
              {settings.company_name}
              <br />
              {settings.street}
              <br />
              {settings.postal_code} {settings.city}
              <br />
              {settings.country}
            </address>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
              >
                <Phone size={18} /> {settings.phone}
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="inline-flex items-center gap-2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
              >
                <Mail size={18} /> {settings.email}
              </a>
              <a
                href={mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
              >
                <Navigation size={18} /> Route planen
              </a>
            </div>

            <div id="oeffnungszeiten" className="mt-12 scroll-mt-24">
              <Eyebrow>Öffnungszeiten</Eyebrow>
              <OpeningHoursTable hours={hours} specialHours={specialHours} />
            </div>
          </div>

          <div className="h-[420px] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-beige)] lg:h-full lg:min-h-[480px]">
            <iframe
              title="Standort ATELIER dies & das"
              src={mapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Container>
    </>
  );
}
