"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the public Header/Footer on /admin routes, which render their
 * own AdminShell chrome instead. Kept as a client-side pathname check
 * (rather than moving every public route into a route group) so the
 * existing flat app/ structure didn't need restructuring.
 */
export function SiteChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      {header}
      <main className="flex-1">{children}</main>
      {footer}
    </>
  );
}
