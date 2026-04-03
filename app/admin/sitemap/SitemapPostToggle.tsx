"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SitemapPostToggleProps {
  postId: string;
  excluded: boolean;
}

export function SitemapPostToggle({ postId, excluded }: SitemapPostToggleProps) {
  const [isExcluded, setIsExcluded] = useState(excluded);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle(checked: boolean) {
    setLoading(true);
    try {
      await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ excludeFromSitemap: !checked }),
      });
      setIsExcluded(!checked);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={!isExcluded}
        onCheckedChange={toggle}
        disabled={loading}
      />
      <Label className="text-xs text-muted-foreground cursor-pointer">
        {loading ? "..." : isExcluded ? "Excluded" : "Included"}
      </Label>
    </div>
  );
}
