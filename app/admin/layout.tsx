"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="font-bold text-xl">NEAR CMS</h1>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <Link
            href="/admin/dashboard"
            className={`block px-4 py-2 rounded-lg transition ${
              pathname === "/admin/dashboard"
                ? "bg-gray-700"
                : "hover:bg-gray-800"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/posts"
            className={`block px-4 py-2 rounded-lg transition ${
              pathname.startsWith("/admin/posts")
                ? "bg-gray-700"
                : "hover:bg-gray-800"
            }`}
          >
            Blog Posts
          </Link>
          <Link
            href="/admin/pages"
            className={`block px-4 py-2 rounded-lg transition ${
              pathname.startsWith("/admin/pages")
                ? "bg-gray-700"
                : "hover:bg-gray-800"
            }`}
          >
            Pages
          </Link>
          <Link
            href="/admin/media"
            className={`block px-4 py-2 rounded-lg transition ${
              pathname === "/admin/media"
                ? "bg-gray-700"
                : "hover:bg-gray-800"
            }`}
          >
            Media Library
          </Link>
          <Link
            href="/admin/users"
            className={`block px-4 py-2 rounded-lg transition ${
              pathname === "/admin/users"
                ? "bg-gray-700"
                : "hover:bg-gray-800"
            }`}
          >
            Users
          </Link>
        </nav>

        <div className="p-6 border-t border-gray-800">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-sm"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
