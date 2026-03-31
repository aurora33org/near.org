"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Layers,
  Image,
  Tag,
  Users,
  ClipboardList,
} from "lucide-react";
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

  const navLink = (href: string, label: string, icon: ReactNode, exact = false) => {
    const active = exact ? pathname === href : pathname.startsWith(href);
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
          active
            ? "bg-secondary text-secondary-foreground"
            : "hover:bg-secondary/50 hover:text-secondary-foreground"
        }`}
      >
        <span className="shrink-0 opacity-70">{icon}</span>
        {label}
      </Link>
    );
  };

  const iconSize = "w-4 h-4";

  return (
    <div className="admin-wrapper dark flex h-screen bg-background text-foreground">
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="font-bold text-xl">NEAR CMS</h1>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {navLink("/admin/dashboard", "Dashboard",       <LayoutDashboard className={iconSize} />, true)}
          {navLink("/admin/posts",     "Blog Posts",      <FileText        className={iconSize} />)}
          {navLink("/admin/pages",     "Pages",           <Layers          className={iconSize} />)}
          {navLink("/admin/media",     "Media Library",   <Image           className={iconSize} />, true)}
          {navLink("/admin/categories","Categories & Tags",<Tag            className={iconSize} />, true)}
          {role === "ADMIN" && navLink("/admin/users",     "Users",       <Users         className={iconSize} />, true)}
          {role === "ADMIN" && navLink("/admin/audit-log", "Audit Log",   <ClipboardList className={iconSize} />, true)}
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
