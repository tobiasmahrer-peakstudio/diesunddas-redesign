import type { Metadata } from "next";
import { Phone, Mail, MapPin } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ContactForm } from "@/components/sections/ContactForm";
import { InstagramIcon, FacebookIcon } from "@/components/ui/SocialIcons";
import { getSiteSettings } from "@/lib/data";
import { resolveMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata("/kontakt", {
    title: "Kontakt",
    description: "Kontaktiere ATELIER dies & das in Laufen — per Telefon, E-Mail oder Formular.",
  });
}

export default async function KontaktPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHero eyebrow="Kontakt" title="Wir freuen uns von dir zu hören." imageLabel="[LADENBILD EINFÜGEN]" />

      <Container className="py-16 sm:py-24">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <Eyebrow>Direkt erreichbar</Eyebrow>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href={`tel:${settings.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-3 text-[var(--color-ink)] hover:text-[var(--color-terracotta-dark)]"
                >
                  <Phone size={20} /> {settings.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex items-center gap-3 text-[var(--color-ink)] hover:text-[var(--color-terracotta-dark)]"
                >
                  <Mail size={20} /> {settings.email}
                </a>
              </li>
              <li>
                <span className="inline-flex items-start gap-3 text-[var(--color-ink)]">
                  <MapPin size={20} className="mt-0.5 shrink-0" />
                  {settings.street}, {settings.postal_code} {settings.city}
                </span>
              </li>
            </ul>

            {(settings.instagram_url || settings.facebook_url) && (
              <div className="mt-8 flex items-center gap-3">
                {settings.instagram_url && (
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-stone)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)]"
                  >
                    <InstagramIcon size={18} />
                  </a>
                )}
                {settings.facebook_url && (
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-stone)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)]"
                  >
                    <FacebookIcon size={18} />
                  </a>
                )}
              </div>
            )}

            <div className="mt-10 border-t border-[var(--color-beige)] pt-8 text-sm text-[var(--color-ink-muted)]">
              Öffnungszeiten findest du auf unserer{" "}
              <a href="/standort" className="underline underline-offset-2">
                Standort-Seite
              </a>
              .
            </div>
          </div>

          <div>
            <Eyebrow>Nachricht schreiben</Eyebrow>
            <ContactForm />
          </div>
        </div>
      </Container>
    </>
  );
}
