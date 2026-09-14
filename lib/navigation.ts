export type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

/**
 * Static fallback navigation — mirrors the `navigation_items` table.
 * Kept as code (not only DB-driven) so the site still has a correct
 * menu before the CMS has any navigation rows configured.
 */
export const mainNavigation: NavLink[] = [
  { label: "Startseite", href: "/" },
  { label: "Das Atelier", href: "/atelier" },
  {
    label: "Sortiment",
    href: "/sortiment",
    children: [
      { label: "Wohnen", href: "/sortiment/wohnen" },
      { label: "Mode & Accessoires", href: "/sortiment/mode-accessoires" },
      { label: "Schmuck", href: "/sortiment/schmuck" },
      { label: "Geschenke", href: "/sortiment/geschenke" },
      { label: "Fine Food", href: "/sortiment/fine-food" },
      { label: "Handgemachtes & Labels", href: "/sortiment/handgemachtes" },
    ],
  },
  {
    label: "Inspiration",
    href: "/inspiration",
    children: [
      { label: "Outfit-Inspirationen", href: "/inspiration?kategorie=outfit" },
      { label: "Geschenkideen", href: "/inspiration?kategorie=geschenkidee" },
      { label: "Neuheiten", href: "/inspiration?kategorie=neuheit" },
      { label: "Saisonale Inspiration", href: "/inspiration?kategorie=saisonal" },
    ],
  },
  { label: "Geschenke", href: "/geschenke" },
  { label: "Impressionen", href: "/impressionen" },
  { label: "Standort", href: "/standort" },
  { label: "Kontakt", href: "/kontakt" },
];

export const footerNavigation = {
  atelier: [
    { label: "Das Atelier", href: "/atelier" },
    { label: "Sortiment", href: "/sortiment" },
    { label: "Inspiration", href: "/inspiration" },
    { label: "Geschenke", href: "/geschenke" },
  ],
  besuchen: [
    { label: "Standort", href: "/standort" },
    { label: "Öffnungszeiten", href: "/standort#oeffnungszeiten" },
    { label: "Kontakt", href: "/kontakt" },
  ],
  rechtliches: [
    { label: "Impressum", href: "/impressum" },
    { label: "Datenschutz", href: "/datenschutz" },
  ],
};
