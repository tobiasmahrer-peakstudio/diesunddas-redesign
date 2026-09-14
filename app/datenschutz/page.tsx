import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { getLegalContent } from "@/lib/data";

export const metadata: Metadata = { title: "Datenschutz" };

export default async function DatenschutzPage() {
  const legal = await getLegalContent();

  return (
    <Container className="py-20 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <h1 className="h-display text-4xl text-[var(--color-ink)]">Datenschutzerklärung</h1>
        <div className="mt-8 whitespace-pre-line text-base leading-relaxed text-[var(--color-ink-soft)]">
          {legal.datenschutz || "[DATENSCHUTZERKLÄRUNG EINFÜGEN]"}
        </div>
      </div>
    </Container>
  );
}
