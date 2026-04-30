"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface AdminThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(
  undefined
);

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("admin-theme") as Theme | null;
    if (saved) {
      setTheme(saved);
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Persist to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("admin-theme", theme);
    }
  }, [theme, mounted]);

  // Apply dark class to wrapper
  useEffect(() => {
    const adminWrapper = document.querySelector(".admin-wrapper");
    if (adminWrapper) {
      if (theme === "dark") {
        adminWrapper.classList.add("dark");
      } else {
        adminWrapper.classList.remove("dark");
      }
    }
  }, [theme]);

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (context === undefined) {
    throw new Error("useAdminTheme must be used within AdminThemeProvider");
  }
  return context;
}
