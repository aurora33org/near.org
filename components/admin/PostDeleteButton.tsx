"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function PostDeleteButton({
  postId,
  postTitle,
  redirectAfter,
}: {
  postId: string;
  postTitle: string;
  redirectAfter?: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${postTitle}"?\n\nThis action is permanent and cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        alert(`Failed to delete: ${err.error}`);
        return;
      }
      if (redirectAfter) {
        router.push(redirectAfter);
      } else {
        router.refresh();
      }
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  );
}
