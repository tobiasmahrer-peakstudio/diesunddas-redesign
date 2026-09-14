"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { adminNav } from "@/lib/admin/nav";
import { cn } from "@/lib/utils";

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const NavList = (
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto py-4">
      {adminNav.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "mx-3 rounded-[var(--radius-sm)] px-4 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-[var(--color-ink)] text-[var(--color-cream)]"
                : "text-[var(--color-ink-soft)] hover:bg-[var(--color-sand)]"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-[var(--color-cream)]">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--color-beige)] bg-[var(--color-paper)] lg:flex">
        <div className="border-b border-[var(--color-beige)] px-5 py-5">
          <p className="font-serif-display text-lg text-[var(--color-ink)]">ATELIER dies &amp; das</p>
          <p className="text-xs text-[var(--color-ink-muted)]">Dashboard</p>
        </div>
        {NavList}
        <div className="border-t border-[var(--color-beige)] p-4">
          <p className="truncate text-xs text-[var(--color-ink-muted)]">{email}</p>
          <button
            onClick={handleLogout}
            className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-error)]"
          >
            <LogOut size={16} /> Abmelden
          </button>
        </div>
      </aside>

      {/* Mobile topbar + drawer */}
      <div className="flex flex-1 flex-col lg:hidden">
        <div className="flex items-center justify-between border-b border-[var(--color-beige)] bg-[var(--color-paper)] px-4 py-3">
          <p className="font-serif-display text-lg text-[var(--color-ink)]">ATELIER dies &amp; das</p>
          <button onClick={() => setMobileOpen(true)} aria-label="Menü öffnen">
            <Menu size={24} />
          </button>
        </div>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex flex-col bg-[var(--color-paper)]">
            <div className="flex items-center justify-between border-b border-[var(--color-beige)] px-4 py-3">
              <p className="font-serif-display text-lg">Dashboard</p>
              <button onClick={() => setMobileOpen(false)} aria-label="Menü schliessen">
                <X size={24} />
              </button>
            </div>
            {NavList}
            <div className="border-t border-[var(--color-beige)] p-4">
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-ink-soft)]"
              >
                <LogOut size={16} /> Abmelden
              </button>
            </div>
          </div>
        )}
      </div>

      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">{children}</div>
      </main>
    </div>
  );
}
