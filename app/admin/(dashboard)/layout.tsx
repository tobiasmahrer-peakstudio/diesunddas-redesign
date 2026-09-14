import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { isAuthConfigured, isRequestAuthenticated } from "@/lib/auth";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Before ADMIN_PASSWORD/SESSION_SECRET are set there's no login to
  // check yet — let the dashboard render so its "not connected"
  // notice is reachable instead of crashing.
  if (!isAuthConfigured()) {
    return <AdminShell email="Login nicht eingerichtet">{children}</AdminShell>;
  }

  // The one and only guard for /admin — see the "Warum kein proxy.ts"
  // note in the README: Cloudflare's Node.js Proxy support is still
  // experimental, so auth is checked here and in every /api/admin/*
  // route handler instead of relying on it.
  if (!(await isRequestAuthenticated())) redirect("/admin/login");

  return <AdminShell email="Angemeldet">{children}</AdminShell>;
}
