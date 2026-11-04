import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

// Guard sisi server: semua halaman di dalam route group (dashboard)
// hanya bisa diakses dengan cookie admin_session yang valid.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await cookies();
  if (!verifyToken(store.get("admin_session")?.value)) {
    redirect("/admin/login");
  }
  return <>{children}</>;
}