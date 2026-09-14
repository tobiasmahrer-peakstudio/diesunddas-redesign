import Link from "next/link";
import { adminNav } from "@/lib/admin/nav";
import { isGithubWritable } from "@/lib/github";

export default function AdminHomePage() {
  const configured = isGithubWritable();

  return (
    <div>
      <h1 className="h-display text-3xl text-[var(--color-ink)]">Dashboard</h1>
      <p className="mt-2 text-[var(--color-ink-soft)]">
        Willkommen zurück. Wähle einen Bereich, um Inhalte zu bearbeiten.
      </p>

      {!configured && (
        <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--color-terracotta)] bg-[var(--color-paper)] px-5 py-4 text-sm text-[var(--color-ink-soft)]">
          ⚠ GitHub ist noch nicht verbunden. Trage <code>GITHUB_TOKEN</code>,{" "}
          <code>GITHUB_OWNER</code> und <code>GITHUB_REPO</code> in <code>.env.local</code> ein,
          damit Änderungen gespeichert werden können. Siehe README.
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {adminNav
          .filter((item) => item.href !== "/admin")
          .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[var(--radius-md)] border border-[var(--color-beige)] bg-[var(--color-paper)] p-6 transition-colors hover:border-[var(--color-terracotta)]"
            >
              <h2 className="text-lg font-medium text-[var(--color-ink)]">{item.label}</h2>
            </Link>
          ))}
      </div>
    </div>
  );
}
