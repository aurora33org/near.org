"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/admin/ThemeToggle";
import { SidebarProfileMenu } from "@/components/admin/SidebarProfileMenu";

interface AdminSidebarProps {
  children: ReactNode;
  role: string;
  userName: string;
}

export function AdminSidebar({ children, role, userName }: AdminSidebarProps) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/admin/login" ||
    pathname === "/admin/forgot-password" ||
    pathname.startsWith("/admin/reset-password/");

  if (isAuthPage) {
    return <>{children}</>;
  }

  const navLink = (href: string, label: string, exact = false) => {
    const active = exact ? pathname === href : pathname.startsWith(href);
    return (
      <Link
        href={href}
        className={`block px-4 py-2 rounded-lg transition ${
          active
            ? "bg-secondary text-secondary-foreground"
            : "hover:bg-secondary/50 hover:text-secondary-foreground"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="admin-wrapper dark flex h-screen bg-background text-foreground">
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="font-bold text-xl">NEAR CMS</h1>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {navLink("/admin/dashboard", "Dashboard", true)}
          {navLink("/admin/posts", "Blog Posts")}
          {navLink("/admin/pages", "Pages")}
          {navLink("/admin/media", "Media Library", true)}
          {navLink("/admin/categories", "Categories & Tags", true)}
          {role === "ADMIN" && navLink("/admin/users", "Users", true)}
          {role === "ADMIN" && navLink("/admin/audit-log", "Audit Log", true)}
          {navLink("/admin/settings", "Settings", true)}
        </nav>

        <div className="p-4 space-y-3 border-t border-border">
          <ThemeToggle />
          <SidebarProfileMenu userName={userName} role={role} />
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-background">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
