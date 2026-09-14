import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { isAuthConfigured, isRequestAuthenticated } from "@/lib/auth";

export default async function AdminLoginPage() {
  if (isAuthConfigured() && (await isRequestAuthenticated())) {
    redirect("/admin");
  }

  return <LoginForm />;
}
