"use client";

import { ReactNode, useState, useEffect } from "react";
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
  PanelLeftClose,
  PanelLeftOpen,
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
  const [collapsed, setCollapsed] = useState(false);

  // Persist collapse state
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  const isAuthPage =
    pathname === "/admin/login" ||
    pathname === "/admin/forgot-password" ||
    pathname.startsWith("/admin/reset-password/");

  if (isAuthPage) {
    return <>{children}</>;
  }

  const iconSize = "w-4 h-4 shrink-0";

  const navLink = (href: string, label: string, icon: ReactNode, exact = false) => {
    const active = exact ? pathname === href : pathname.startsWith(href);
    return (
      <Link
        href={href}
        title={collapsed ? label : undefined}
        className={`flex items-center rounded-lg transition-all ${
          collapsed
            ? "justify-center p-2"
            : "gap-3 px-4 py-2"
        } ${
          active
            ? "bg-secondary text-secondary-foreground"
            : "hover:bg-secondary/50 hover:text-secondary-foreground"
        }`}
      >
        <span className="shrink-0 opacity-70">{icon}</span>
        {!collapsed && <span>{label}</span>}
      </Link>
    );
  };

  return (
    <div className="admin-wrapper dark flex h-screen bg-background text-foreground">
      <aside
        className={`${
          collapsed ? "w-16" : "w-64"
        } bg-card border-r border-border flex flex-col transition-all duration-500 ease-linear shrink-0`}
      >
        {/* Header */}
        <div className={`flex items-center border-b border-border h-[73px] ${collapsed ? "justify-center px-3" : "justify-between px-6"}`}>
          {!collapsed && <h1 className="font-bold text-xl">NEAR CMS</h1>}
          <button
            onClick={() => setCollapsed((v) => !v)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition"
          >
            {collapsed
              ? <PanelLeftOpen className="w-4 h-4" />
              : <PanelLeftClose className="w-4 h-4" />
            }
          </button>
        </div>

        {/* Nav */}
        <nav className={`flex-1 py-4 space-y-1 ${collapsed ? "px-2" : "px-4"}`}>
          {navLink("/admin/dashboard",  "Dashboard",        <LayoutDashboard className={iconSize} />, true)}
          {navLink("/admin/posts",      "Blog Posts",       <FileText        className={iconSize} />)}
          {navLink("/admin/pages",      "Pages",            <Layers          className={iconSize} />)}
          {navLink("/admin/media",      "Media Library",    <Image           className={iconSize} />, true)}
          {navLink("/admin/categories", "Categories & Tags",<Tag             className={iconSize} />, true)}
          {role === "ADMIN" && navLink("/admin/users",      "Users",         <Users         className={iconSize} />, true)}
          {role === "ADMIN" && navLink("/admin/audit-log",  "Audit Log",     <ClipboardList className={iconSize} />, true)}
        </nav>

        {/* Footer */}
        <div className={`border-t border-border space-y-3 ${collapsed ? "p-2" : "p-4"}`}>
          <ThemeToggle collapsed={collapsed} />
          <SidebarProfileMenu userName={userName} role={role} collapsed={collapsed} />
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-background">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
