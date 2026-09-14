import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { getLegalContent, getSiteSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Impressum" };

export default async function ImpressumPage() {
  const [legal, settings] = await Promise.all([getLegalContent(), getSiteSettings()]);
  const content = legal.impressum;

  return (
    <Container className="py-20 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <h1 className="h-display text-4xl text-[var(--color-ink)]">Impressum</h1>
        <div className="mt-8 whitespace-pre-line text-base leading-relaxed text-[var(--color-ink-soft)]">
          {content || "[IMPRESSUM EINFÜGEN]"}
        </div>
        {!content && (
          <div className="mt-10 border-t border-[var(--color-beige)] pt-8 text-sm text-[var(--color-ink-muted)]">
            <p>{settings.company_name}</p>
            <p>
              {settings.street}, {settings.postal_code} {settings.city}
            </p>
            <p>{settings.country}</p>
          </div>
        )}
      </div>
    </Container>
  );
}
