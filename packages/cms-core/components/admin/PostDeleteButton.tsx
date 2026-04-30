"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

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
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [confirmInput, setConfirmInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  function closeModal() {
    setShowModal(false);
    setStep(1);

    setConfirmInput("");
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        toast.error(`Failed to delete: ${err.error}`);
        return;
      }
      closeModal();
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
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-destructive text-destructive hover:bg-destructive/10 transition"
        title="Delete post"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={closeModal}
        >
          <div
            className="bg-background border border-border rounded-2xl shadow-xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h2 className="text-base font-semibold">
                  {step === 1 ? "Delete this post?" : "Confirm permanent deletion"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition text-xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5 text-left">
              {step === 1 ? (
                <>
                  <p className="text-sm font-medium truncate text-foreground">
                    &ldquo;{postTitle}&rdquo;
                  </p>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Before continuing, understand what this action involves:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <span className="text-destructive mt-0.5 shrink-0">•</span>
                        <span>The post will be <strong>permanently deleted</strong> from the database — there is no recovery or undo.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-destructive mt-0.5 shrink-0">•</span>
                        <span>The public URL <code className="text-xs bg-muted px-1 py-0.5 rounded">/blog/[slug]</code> will immediately return 404.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-destructive mt-0.5 shrink-0">•</span>
                        <span>All content, metadata, SEO fields, and OG image references will be lost.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-destructive mt-0.5 shrink-0">•</span>
                        <span>Any external links or bookmarks pointing to this post will break permanently.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 text-sm px-4 py-2 rounded-lg border border-border hover:bg-muted transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
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
                    value={confirmInput}
                    onChange={(e) => setConfirmInput(e.target.value)}
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
                      onClick={() => { setStep(1); setConfirmInput(""); }}
                      className="flex-1 text-sm px-4 py-2 rounded-lg border border-border hover:bg-muted transition"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      disabled={confirmInput !== "delete" || isDeleting}
                      onClick={handleDelete}
                      className="flex-1 text-sm px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? "Deleting…" : "Delete permanently"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
