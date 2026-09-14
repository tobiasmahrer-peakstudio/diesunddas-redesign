import Link from "next/link";
import { InstagramIcon, FacebookIcon } from "@/components/ui/SocialIcons";
import { Container } from "@/components/ui/Container";
import { footerNavigation } from "@/lib/navigation";
import { getSiteSettings } from "@/lib/data";

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="border-t border-[var(--color-beige)] bg-[var(--color-sand)]">
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div>
            <Link href="/" className="font-serif-display text-xl text-[var(--color-ink)]">
              ATELIER <span className="italic">dies &amp; das</span>
            </Link>
            <p className="mt-4 max-w-[220px] text-sm leading-relaxed text-[var(--color-ink-soft)]">
              {settings.footer_text ??
                "Schönes für dich & dein Zuhause — in Laufen."}
            </p>
          </div>

          <FooterColumn title="Atelier" links={footerNavigation.atelier} />
          <FooterColumn title="Besuchen" links={footerNavigation.besuchen} />

          <div>
            <h3 className="h-eyebrow mb-4">Social</h3>
            <div className="flex items-center gap-3">
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-stone)] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)]"
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
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-stone)] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)]"
                >
                  <FacebookIcon size={18} />
                </a>
              )}
              {!settings.instagram_url && !settings.facebook_url && (
                <p className="text-sm text-[var(--color-ink-muted)]">
                  [SOCIAL-MEDIA-LINKS IM CMS EINFÜGEN]
                </p>
              )}
            </div>
            <h3 className="h-eyebrow mb-3 mt-8">Rechtliches</h3>
            <ul className="flex flex-col gap-2">
              {footerNavigation.rechtliches.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-2 border-t border-[var(--color-beige)] pt-6 text-xs text-[var(--color-ink-muted)] sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {settings.copyright_text}
          </p>
          <p>
            {settings.street}, {settings.postal_code} {settings.city}
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="h-eyebrow mb-4">{title}</h3>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
