"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SitemapPostToggleProps {
  postId: string;
  excluded: boolean;
}

export function SitemapPostToggle({ postId, excluded }: SitemapPostToggleProps) {
  const [isExcluded, setIsExcluded] = useState(excluded);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    setLoading(true);
    try {
      await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ excludeFromSitemap: !isExcluded }),
      });
      setIsExcluded((v) => !v);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
        isExcluded
          ? "bg-red-500/10 text-red-600 hover:bg-red-500/20"
          : "bg-green-500/10 text-green-600 hover:bg-green-500/20"
      }`}
    >
      {loading ? "..." : isExcluded ? "Excluded" : "Included"}
    </button>
  );
}
