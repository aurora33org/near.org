"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Settings, LogOut, ExternalLink, ChevronUp } from "lucide-react";

interface SidebarProfileMenuProps {
  userName: string;
  userEmail?: string;
  role: string;
}

export function SidebarProfileMenu({ userName, userEmail, role }: SidebarProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const initials = userName
    ? userName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const roleBadgeColor =
    role === "ADMIN"
      ? "text-primary"
      : role === "EDITOR"
      ? "text-green-400"
      : "text-muted-foreground";

  return (
    <div ref={containerRef} className="relative">
      {/* Dropdown — renders above the card */}
      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
          <div className="py-1">
            <Link
              href="/admin/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/50 transition"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
              Settings
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/50 transition"
            >
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
              View site
            </a>
            <div className="my-1 border-t border-border" />
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* Profile card trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition ${
          open
            ? "bg-muted border-border"
            : "border-transparent hover:bg-muted/50 hover:border-border"
        }`}
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
          {initials}
        </div>

        {/* Name + role */}
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-medium truncate leading-tight">{userName || "User"}</p>
          <p className={`text-xs leading-tight ${roleBadgeColor}`}>{role}</p>
        </div>

        <ChevronUp
          className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? "" : "rotate-180"}`}
        />
      </button>
    </div>
  );
}
