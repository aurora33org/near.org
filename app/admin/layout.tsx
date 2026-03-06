"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { AdminThemeProvider } from "@/components/admin/ThemeProvider";
import { ThemeToggle } from "@/components/admin/ThemeToggle";

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="admin-wrapper dark flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="font-bold text-xl">NEAR CMS</h1>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <Link
            href="/admin/dashboard"
            className={`block px-4 py-2 rounded-lg transition ${
              pathname === "/admin/dashboard"
                ? "bg-secondary text-secondary-foreground"
                : "hover:bg-secondary/50 hover:text-secondary-foreground"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/posts"
            className={`block px-4 py-2 rounded-lg transition ${
              pathname.startsWith("/admin/posts")
                ? "bg-secondary text-secondary-foreground"
                : "hover:bg-secondary/50 hover:text-secondary-foreground"
            }`}
          >
            Blog Posts
          </Link>
          <Link
            href="/admin/pages"
            className={`block px-4 py-2 rounded-lg transition ${
              pathname.startsWith("/admin/pages")
                ? "bg-secondary text-secondary-foreground"
                : "hover:bg-secondary/50 hover:text-secondary-foreground"
            }`}
          >
            Pages
          </Link>
          <Link
            href="/admin/media"
            className={`block px-4 py-2 rounded-lg transition ${
              pathname === "/admin/media"
                ? "bg-secondary text-secondary-foreground"
                : "hover:bg-secondary/50 hover:text-secondary-foreground"
            }`}
          >
            Media Library
          </Link>
          <Link
            href="/admin/users"
            className={`block px-4 py-2 rounded-lg transition ${
              pathname === "/admin/users"
                ? "bg-secondary text-secondary-foreground"
                : "hover:bg-secondary/50 hover:text-secondary-foreground"
            }`}
          >
            Users
          </Link>
        </nav>

        <div className="p-6 space-y-4 border-t border-border">
          <ThemeToggle />
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full px-4 py-2 bg-destructive hover:bg-destructive/90 rounded-lg transition text-sm text-destructive-foreground"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-background">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminThemeProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminThemeProvider>
  );
}
