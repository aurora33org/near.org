"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@cms/components/ui/button";
import { Badge } from "@cms/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogFooter,
  DialogTitle, DialogDescription, DialogClose,
} from "@cms/components/ui/dialog";
import { PostDeleteButton } from "@cms/components/admin/PostDeleteButton";
import { DuplicatePostButton } from "@cms/components/admin/DuplicatePostButton";
import { formatAdminDate } from "@cms/lib/utils";

interface SerializedPost {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: string | null;
  createdAt: string;
  author: { name: string };
  lastEditedBy: { name: string } | null;
  lockedByEmail: string | null;
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
  const [pendingBulkAction, setPendingBulkAction] = useState<"publish" | "archive" | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");

  // Refresh lock state on mount and every 30s while on this page
  useEffect(() => {
    router.refresh();
    const refreshInterval = setInterval(() => router.refresh(), 30_000);
    return () => clearInterval(refreshInterval);
  }, [router]);

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

  function openBulkDeleteModal() {
    setDeleteStep(1);
    setDeleteConfirmInput("");
    setShowDeleteModal(true);
  }

  function closeBulkDeleteModal() {
    setShowDeleteModal(false);
    setDeleteStep(1);
    setDeleteConfirmInput("");
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
    const count = Array.from(selectedIds).length;
    if (action === "publish") toast.success(`${count} post${count !== 1 ? "s" : ""} published`);
    if (action === "archive") toast.success(`${count} post${count !== 1 ? "s" : ""} archived`);
    setSelectedIds(new Set());
    startTransition(() => router.refresh());
  }

  async function confirmBulkDelete() {
    closeBulkDeleteModal();
    await handleBulkAction("delete");
  }

  return (
    <div className="relative">
      <div className="overflow-x-auto" data-posts-tour-id="posts-table">
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
              <th className="px-6 py-3 text-right font-medium text-sm" data-posts-tour-id="post-actions">Actions</th>
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium">{post.title}</p>
                    {post.lockedByEmail && (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-400/30 px-1.5 py-0.5 rounded-full">
                        🔒 {post.lockedByEmail}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{post.slug}</p>
                </td>
                <td className="px-6 py-4 text-sm">
                  <p>{post.author.name}</p>
                  {post.lastEditedBy && post.lastEditedBy.name !== post.author.name && (
                    <p className="text-xs text-muted-foreground">edited by {post.lastEditedBy.name}</p>
                  )}
                </td>
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
                        <Badge
                          variant="outline"
                          className="text-yellow-600 border-yellow-400"
                          title={`Scheduled: ${formatAdminDate(post.publishedAt)}`}
                        >
                          SCHEDULED
                        </Badge>
                      )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {formatAdminDate(post.createdAt)}
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
            <Button variant="outline" size="sm" disabled={isPending} onClick={() => setPendingBulkAction("publish")}>
              Publish
            </Button>
            <Button variant="outline" size="sm" disabled={isPending} onClick={() => setPendingBulkAction("archive")}>
              Archive
            </Button>
            <Button variant="destructive" size="sm" disabled={isPending} onClick={openBulkDeleteModal}>
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Bulk delete confirmation modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={closeBulkDeleteModal}
        >
          <div
            className="bg-background border border-border rounded-2xl shadow-xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h2 className="text-base font-semibold">
                  {deleteStep === 1
                    ? `Delete ${selectedIds.size} ${selectedIds.size === 1 ? "post" : "posts"}?`
                    : "Confirm permanent deletion"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeBulkDeleteModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 text-left">
              {deleteStep === 1 ? (
                <>
                  <p className="text-sm font-medium text-foreground">
                    {selectedIds.size} {selectedIds.size === 1 ? "post" : "posts"} selected
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Before continuing, understand what this action involves:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <span className="text-destructive mt-0.5 shrink-0">•</span>
                        <span>All selected posts will be <strong>permanently deleted</strong> from the database — there is no recovery or undo.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-destructive mt-0.5 shrink-0">•</span>
                        <span>Their public URLs <code className="text-xs bg-muted px-1 py-0.5 rounded">/blog/[slug]</code> will immediately return 404.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-destructive mt-0.5 shrink-0">•</span>
                        <span>All content, metadata, SEO fields, and OG image references will be lost.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-destructive mt-0.5 shrink-0">•</span>
                        <span>Any external links or bookmarks pointing to these posts will break permanently.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={closeBulkDeleteModal}
                      className="flex-1 text-sm px-4 py-2 rounded-lg border border-border hover:bg-muted transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteStep(2)}
                      className="flex-1 inline-flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Continue →
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    This is your final confirmation. Type{" "}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded font-semibold text-foreground">delete</code>{" "}
                    to unlock the delete button. Pasting is not allowed.
                  </p>
                  <input
                    type="text"
                    value={deleteConfirmInput}
                    onChange={(e) => setDeleteConfirmInput(e.target.value)}
                    onPaste={(e) => e.preventDefault()}
                    onCopy={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                    placeholder='Type "delete" here…'
                    className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-destructive"
                    autoFocus
                  />
                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => { setDeleteStep(1); setDeleteConfirmInput(""); }}
                      className="flex-1 text-sm px-4 py-2 rounded-lg border border-border hover:bg-muted transition"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      disabled={deleteConfirmInput !== "delete" || isPending}
                      onClick={confirmBulkDelete}
                      className="flex-1 text-sm px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isPending ? "Deleting…" : "Delete permanently"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bulk publish/archive confirmation dialog */}
      <Dialog open={pendingBulkAction !== null} onOpenChange={(open) => { if (!open) setPendingBulkAction(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingBulkAction === "publish" ? "Publish posts?" : "Archive posts?"}
            </DialogTitle>
            <DialogDescription>
              {pendingBulkAction === "publish"
                ? `Publish ${selectedIds.size} post${selectedIds.size !== 1 ? "s" : ""}? They will become immediately visible on the site.`
                : `Archive ${selectedIds.size} post${selectedIds.size !== 1 ? "s" : ""}? They will be hidden from the public site.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant={pendingBulkAction === "publish" ? "default" : "secondary"}
              onClick={async () => {
                const action = pendingBulkAction!;
                setPendingBulkAction(null);
                await handleBulkAction(action);
              }}
            >
              {pendingBulkAction === "publish" ? "Publish" : "Archive"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
