"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { mainNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-[var(--color-cream)]/95 shadow-[var(--shadow-soft)] backdrop-blur-sm"
          : "bg-[var(--color-cream)]/80 backdrop-blur-sm"
      )}
    >
      <Container>
        <div className={cn("flex items-center justify-between transition-all", scrolled ? "h-[72px]" : "h-[88px]")}>
          <Link href="/" className="font-serif-display text-2xl tracking-wide text-[var(--color-ink)]">
            ATELIER <span className="italic text-[var(--color-terracotta-dark)]">dies &amp; das</span>
          </Link>

          <nav className="hidden items-center gap-6 xl:flex" aria-label="Hauptnavigation">
            {mainNavigation.map((item) => (
              <div key={item.href} className="group relative py-2">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-sm font-medium text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
                >
                  {item.label}
                  {item.children && <ChevronDown size={14} className="opacity-60" />}
                </Link>
                {item.children && (
                  <div className="invisible absolute left-0 top-full z-50 min-w-[240px] translate-y-1 rounded-[var(--radius-md)] border border-[var(--color-beige)] bg-[var(--color-paper)] p-2 opacity-0 shadow-[var(--shadow-soft)] transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-[var(--radius-sm)] px-4 py-2.5 text-sm text-[var(--color-ink-soft)] hover:bg-[var(--color-sand)] hover:text-[var(--color-ink)]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden xl:block">
            <Link
              href="/standort"
              className="inline-flex items-center rounded-[var(--radius-sm)] border border-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)]"
            >
              Vorbeikommen
            </Link>
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center text-[var(--color-ink)] xl:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Menü öffnen"
          >
            <Menu size={26} />
          </button>
        </div>
      </Container>
    </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-[var(--color-cream)] xl:hidden">
          <Container>
            <div className="flex h-[88px] items-center justify-between">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="font-serif-display text-2xl tracking-wide text-[var(--color-ink)]"
              >
                ATELIER <span className="italic text-[var(--color-terracotta-dark)]">dies &amp; das</span>
              </Link>
              <button
                className="flex h-10 w-10 items-center justify-center text-[var(--color-ink)]"
                onClick={() => setMobileOpen(false)}
                aria-label="Menü schliessen"
              >
                <X size={26} />
              </button>
            </div>
          </Container>
          <Container className="flex-1 overflow-y-auto pb-10">
            <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
              {mainNavigation.map((item) => (
                <div key={item.href} className="border-b border-[var(--color-beige)] py-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="py-3 text-lg font-medium text-[var(--color-ink)]"
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <button
                        onClick={() =>
                          setOpenSubmenu(openSubmenu === item.href ? null : item.href)
                        }
                        aria-label={`${item.label} Unterpunkte anzeigen`}
                        className="p-3 text-[var(--color-ink-soft)]"
                      >
                        <ChevronDown
                          size={18}
                          className={cn(
                            "transition-transform",
                            openSubmenu === item.href && "rotate-180"
                          )}
                        />
                      </button>
                    )}
                  </div>
                  {item.children && openSubmenu === item.href && (
                    <div className="flex flex-col gap-1 pb-3 pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="py-2 text-[var(--color-ink-soft)]"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <Link
              href="/standort"
              onClick={() => setMobileOpen(false)}
              className="mt-6 inline-flex w-full items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-ink)] px-6 py-4 text-sm font-medium text-[var(--color-cream)]"
            >
              Vorbeikommen
            </Link>
          </Container>
        </div>
      )}
    </>
  );
}
