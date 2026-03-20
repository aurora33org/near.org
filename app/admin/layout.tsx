import { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { AdminThemeProvider } from "@/components/admin/ThemeProvider";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const role = (session?.user as any)?.role ?? "VIEWER";
  const userName = session?.user?.name || session?.user?.email || "";

  return (
    <AdminThemeProvider>
      <AdminSidebar role={role} userName={userName}>
        {children}
      </AdminSidebar>
    </AdminThemeProvider>
  );
}
