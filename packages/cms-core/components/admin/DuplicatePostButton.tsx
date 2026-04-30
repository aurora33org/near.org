"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export function DuplicatePostButton({ postId }: { postId: string }) {
  const router = useRouter();
  const [isDuplicating, setIsDuplicating] = useState(false);

  async function handleDuplicate() {
    setIsDuplicating(true);
    try {
      const res = await fetch(`/api/posts/${postId}/duplicate`, { method: "POST" });
      if (!res.ok) {
        toast.error("Failed to duplicate post");
        return;
      }
      toast.success("Post duplicated");
      router.refresh();
    } catch {
      toast.error("Failed to duplicate post");
    } finally {
      setIsDuplicating(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDuplicate}
      disabled={isDuplicating}
      className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-border text-muted-foreground hover:bg-muted transition disabled:opacity-50"
      title="Duplicate post"
    >
      <Copy className="w-4 h-4" />
    </button>
  );
}
