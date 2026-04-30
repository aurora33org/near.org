"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@near/cms-core/lib/extractHeadings";

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav className="space-y-1 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
        On this page
      </p>
      {headings.map(({ id, text, level }) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
            setActiveId(id);
          }}
          className={`block text-sm leading-snug transition-colors py-0.5 ${
            level === 3 ? "pl-3" : ""
          } ${
            activeId === id
              ? "text-gray-900 font-medium"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          {text}
        </a>
      ))}
    </nav>
  );
}
