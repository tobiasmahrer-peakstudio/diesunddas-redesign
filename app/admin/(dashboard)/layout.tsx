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

  // Belt-and-suspenders — middleware already guards /admin.
  if (!(await isRequestAuthenticated())) redirect("/admin/login");

  return <AdminShell email="Angemeldet">{children}</AdminShell>;
}
