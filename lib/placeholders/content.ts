/**
 * Small, static fallback copy — used only as a last-resort default
 * when a field on a content/pages/*.json record is empty, so a
 * partially-filled page never renders truly blank. The real,
 * editable placeholder text lives in content/*.json (see lib/data.ts
 * and lib/github.ts) and is what the admin actually edits.
 */
export const placeholderContent = {
  hero: {
    title: "Schönes für dich & dein Zuhause.",
    subtitle: "[SUBHEADLINE EINFÜGEN – ein bis zwei Sätze über das Gefühl im ATELIER]",
    image: "[HERO-BILD EINFÜGEN – grosszügige Aufnahme des ATELIERs / Ladeninneren / Schaufensters]",
    ctaPrimary: "ATELIER entdecken",
    ctaSecondary: "Vorbeikommen",
  },
  intro: {
    heading: "Besondere Dinge, sorgfältig ausgewählt.",
    text: "[TEXT EINFÜGEN – kurze Markenbotschaft: was ist das ATELIER, warum sollte man vorbeikommen]",
  },
  about: {
    heading: "Das ATELIER dies & das",
    story: "[GESCHICHTE DES ATELIERS EINFÜGEN]",
    heroImage: "[AUTHENTISCHES FOTO DER BESITZERIN / DES TEAMS EINFÜGEN]",
  },
  giftWishBox: {
    heading: "Du möchtest dir etwas wünschen?",
    text: "[HIER BESCHREIBEN, WIE DIE GESCHENK-WUNSCH-BOX FUNKTIONIERT]",
  },
  labels: {
    heading: "Kleine Labels. Grosse Leidenschaft.",
    text: "[TEXT EINFÜGEN – warum diese Marken, was macht sie besonders]",
  },
} as const;

/** Returns true if a string is (or looks like) unfilled placeholder copy. */
export function isPlaceholder(value: string | null | undefined): boolean {
  if (!value) return true;
  return /\[.*EINFÜGEN.*\]|^\[.*\]$/.test(value.trim());
}

export const weekdayLabels: Record<string, string> = {
  monday: "Montag",
  tuesday: "Dienstag",
  wednesday: "Mittwoch",
  thursday: "Donnerstag",
  friday: "Freitag",
  saturday: "Samstag",
  sunday: "Sonntag",
};
