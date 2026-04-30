import { ReactNode } from "react";
import { auth } from "@near/cms-core/lib/auth";
import { AdminThemeProvider } from "@near/cms-core/components/admin/ThemeProvider";
import { AdminSidebar } from "@near/cms-core/components/admin/AdminSidebar";
import { NavigationGuardProvider } from "@near/cms-core/components/admin/NavigationGuardProvider";
import { Toaster } from "sonner";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const role = (session?.user as any)?.role ?? "VIEWER";
  const userName = session?.user?.name || session?.user?.email || "";

  return (
    <AdminThemeProvider>
      <NavigationGuardProvider>
        <AdminSidebar role={role} userName={userName}>
          {children}
        </AdminSidebar>
      </NavigationGuardProvider>
      <Toaster richColors position="top-right" />
    </AdminThemeProvider>
  );
}
