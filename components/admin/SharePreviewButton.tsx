"use client";

import { useState, useEffect } from "react";
import { Share2, Copy, Check, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SharePreviewButtonProps {
  postId: string;
  postTitle: string;
}

export default function SharePreviewButton({
  postId,
  postTitle,
}: SharePreviewButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewToken, setPreviewToken] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [password, setPassword] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSlack, setCopiedSlack] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setIsFetching(true);
    fetch(`/api/posts/${postId}`)
      .then((r) => r.json())
      .then((post) => {
        if (post.previewToken) {
          setPreviewToken(post.previewToken);
          setPreviewUrl(`${window.location.origin}/preview/${post.previewToken}`);
          // Don't load the hash — password field stays blank for user to set a new one
        }
      })
      .catch(() => {})
      .finally(() => setIsFetching(false));
  }, [isOpen, postId]);

  async function handleCreateOrUpdate(regenerate = false) {
    if (!password.trim()) {
      toast.error("Please enter a password");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/preview-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, regenerate }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to create preview link");
        return;
      }
      setPreviewToken(data.token);
      setPreviewUrl(`${window.location.origin}/preview/${data.token}`);
      toast.success(regenerate ? "Preview link regenerated" : "Preview link created");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(previewUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  function copySlackMessage() {
    const msg =
      `👀 Preview ready for review\n` +
      `Post: ${postTitle}\n` +
      `Link: ${previewUrl}\n` +
      `Password: ${password}\n` +
      `Please review and share feedback before we publish!`;
    navigator.clipboard.writeText(msg);
    setCopiedSlack(true);
    setTimeout(() => setCopiedSlack(false), 2000);
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        title="Share preview"
        onClick={() => setIsOpen(true)}
      >
        <Share2 size={16} className="mr-1" />
        Share
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-foreground">Share Preview</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition"
              >
                <X size={18} />
              </button>
            </div>

            {isFetching ? (
              <div className="text-sm text-muted-foreground py-4 text-center">Loading…</div>
            ) : !previewToken ? (
              // No token yet — create flow
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Generate a shareable link with password protection. Anyone with the link and password can view the draft.
                </p>
                <div className="space-y-1.5">
                  <Label htmlFor="share-password" className="text-xs font-semibold uppercase tracking-wide">
                    Password
                  </Label>
                  <Input
                    id="share-password"
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="e.g. review2024"
                    className="bg-muted/30 border-border/70"
                  />
                </div>
                <Button
                  onClick={() => handleCreateOrUpdate(false)}
                  disabled={isSubmitting}
                  className="w-full"
                  size="sm"
                >
                  {isSubmitting ? "Creating…" : "Create link"}
                </Button>
              </div>
            ) : (
              // Token exists — manage flow
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide">
                    Preview URL
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={previewUrl}
                      className="bg-muted/30 border-border/70 text-xs font-mono"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyLink}
                      className="flex-shrink-0"
                    >
                      {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="share-password-edit" className="text-xs font-semibold uppercase tracking-wide">
                    Password
                  </Label>
                  <Input
                    id="share-password-edit"
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-muted/30 border-border/70"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleCreateOrUpdate(false)}
                    disabled={isSubmitting}
                    size="sm"
                    className="flex-1"
                  >
                    {isSubmitting ? "Saving…" : "Update"}
                  </Button>
                  <Button
                    onClick={() => handleCreateOrUpdate(true)}
                    disabled={isSubmitting}
                    variant="outline"
                    size="sm"
                    title="Revokes old link and creates a new one"
                  >
                    <RefreshCw size={14} className="mr-1" />
                    Regenerate link
                  </Button>
                </div>

                <div className="border-t border-border pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copySlackMessage}
                    className="w-full"
                  >
                    {copiedSlack ? (
                      <>
                        <Check size={14} className="mr-1" /> Copied!
                      </>
                    ) : (
                      "Copy Slack message"
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Copies a formatted Slack message with link and password
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
