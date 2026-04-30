"use client";

import { useAdminTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ collapsed = false }: { collapsed?: boolean }) {
  const { theme, toggleTheme } = useAdminTheme();

  return (
    <button
      onClick={toggleTheme}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex items-center gap-2 rounded-lg hover:bg-secondary/50 transition text-foreground ${
        collapsed ? "w-full justify-center p-2" : "p-2"
      }`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 shrink-0" />
      ) : (
        <Moon className="w-4 h-4 shrink-0" />
      )}
      {!collapsed && (
        <span className="text-sm">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
      )}
    </button>
  );
}
