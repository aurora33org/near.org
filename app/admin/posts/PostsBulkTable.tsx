"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PostDeleteButton } from "@/components/admin/PostDeleteButton";
import { DuplicatePostButton } from "@/components/admin/DuplicatePostButton";

interface SerializedPost {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: string | null;
  createdAt: string;
  author: { name: string };
}

interface PostsBulkTableProps {
  posts: SerializedPost[];
  userRole: string;
}

export function PostsBulkTable({ posts, userRole }: PostsBulkTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [bulkError, setBulkError] = useState("");

  const allSelected = posts.length > 0 && posts.every((p) => selectedIds.has(p.id));
  const someSelected = selectedIds.size > 0;

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(posts.map((p) => p.id)));
    }
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleBulkAction(action: "publish" | "archive" | "delete") {
    setBulkError("");
    const res = await fetch("/api/posts/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selectedIds), action }),
    });
    if (!res.ok) {
      const data = await res.json();
      setBulkError(data.error ?? "Bulk action failed");
      return;
    }
    setSelectedIds(new Set());
    startTransition(() => router.refresh());
  }

  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              {userRole !== "VIEWER" && (
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="rounded border-border accent-primary"
                    aria-label="Select all"
                  />
                </th>
              )}
              <th className="px-6 py-3 text-left font-medium text-sm">Title</th>
              <th className="px-6 py-3 text-left font-medium text-sm">Author</th>
              <th className="px-6 py-3 text-left font-medium text-sm">Status</th>
              <th className="px-6 py-3 text-left font-medium text-sm">Created</th>
              <th className="px-6 py-3 text-right font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {posts.map((post) => (
              <tr
                key={post.id}
                className={`hover:bg-muted/20 transition ${selectedIds.has(post.id) ? "bg-primary/5" : ""}`}
              >
                {userRole !== "VIEWER" && (
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(post.id)}
                      onChange={() => toggleOne(post.id)}
                      className="rounded border-border accent-primary"
                    />
                  </td>
                )}
                <td className="px-6 py-4">
                  <p className="font-medium">{post.title}</p>
                  <p className="text-xs text-muted-foreground">{post.slug}</p>
                </td>
                <td className="px-6 py-4 text-sm">{post.author.name}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={
                        post.status === "PUBLISHED"
                          ? "default"
                          : post.status === "DRAFT"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {post.status}
                    </Badge>
                    {post.status === "PUBLISHED" &&
                      post.publishedAt &&
                      new Date(post.publishedAt) > new Date() && (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-400">
                          SCHEDULED
                        </Badge>
                      )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {post.status === "PUBLISHED" && (
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/blog/${post.slug}`} target="_blank">View</Link>
                      </Button>
                    )}
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/posts/${post.id}/edit`}>Edit</Link>
                    </Button>
                    {userRole !== "VIEWER" && (
                      <>
                        <DuplicatePostButton postId={post.id} />
                        <PostDeleteButton postId={post.id} postTitle={post.title} />
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bulk action bar */}
      {someSelected && userRole !== "VIEWER" && (
        <div className="sticky bottom-4 mx-4 mt-2 flex items-center justify-between gap-4 bg-background border border-border rounded-xl px-5 py-3 shadow-lg z-10">
          <p className="text-sm font-medium">
            {selectedIds.size} {selectedIds.size === 1 ? "post" : "posts"} selected
          </p>
          {bulkError && <p className="text-xs text-destructive">{bulkError}</p>}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedIds(new Set())}>
              Clear
            </Button>
            <Button variant="outline" size="sm" disabled={isPending} onClick={() => handleBulkAction("publish")}>
              Publish
            </Button>
            <Button variant="outline" size="sm" disabled={isPending} onClick={() => handleBulkAction("archive")}>
              Archive
            </Button>
            <Button variant="destructive" size="sm" disabled={isPending} onClick={() => handleBulkAction("delete")}>
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
