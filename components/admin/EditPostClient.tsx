"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import BlockEditor from "@/components/admin/editor/BlockEditor";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, ImageIcon, X, Eye } from "lucide-react";
import { PostDeleteButton } from "@/components/admin/PostDeleteButton";
import SharePreviewButton from "@/components/admin/SharePreviewButton";
import { toast } from "sonner";
import { useNavigationGuard } from "@/components/admin/NavigationGuardProvider";
import { formatAdminDate } from "@/lib/utils";

function toDatetimeLocalString(date: string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 16);
}

function expandHexColor(color: string): string {
  if (/^#[0-9a-fA-F]{3}$/.test(color)) {
    return "#" + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
  }
  return color;
}

export default function EditPostClient() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const titleInputRef = useRef<HTMLDivElement>(null);
  const titleInitialized = useRef(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lockBlocked, setLockBlocked] = useState(false);
  const [lockBlockedBy, setLockBlockedBy] = useState("");
  const [isCoverPickerOpen, setIsCoverPickerOpen] = useState(false);
  const [isOgPickerOpen, setIsOgPickerOpen] = useState(false);
  const [heroBgColor, setHeroBgColor] = useState("#ffffff");
  const [heroBgImage, setHeroBgImage] = useState("");
  const [isHeroBgPickerOpen, setIsHeroBgPickerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState<any>({ type: "doc", content: [{ type: "paragraph" }] });
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [coverImage, setCoverImage] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [activeTab, setActiveTab] = useState<"post" | "seo" | "settings">("post");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [publishedAt, setPublishedAt] = useState("");
  const [excludeFromSitemap, setExcludeFromSitemap] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const { isDirty, setIsDirty, requestNavigation } = useNavigationGuard();
  const markDirty = () => setIsDirty(true);

  // Initialize contentEditable title div once when post loads
  useEffect(() => {
    if (!isLoading && titleInputRef.current && title && !titleInitialized.current) {
      titleInputRef.current.textContent = title;
      titleInitialized.current = true;
    }
  }, [title, isLoading]);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [postRes, catRes, tagRes] = await Promise.all([
          fetch(`/api/posts/${postId}`),
          fetch("/api/categories"),
          fetch("/api/tags"),
        ]);

        if (!postRes.ok) throw new Error("Failed to fetch post");
        const post = await postRes.json();

        setTitle(post.title);
        setSlug(post.slug);
        setExcerpt(post.excerpt || "");
        setContent(post.content || { type: "doc", content: [{ type: "paragraph" }] });
        setStatus(post.status);
        setCoverImage(post.coverImage || "");
        setSeoTitle(post.seoTitle || "");
        setSeoDesc(post.seoDesc || "");
        setOgImage(post.ogImage || "");
        setSelectedCategoryIds((post.categories ?? []).map((c: any) => c.id));
        setSelectedTagIds((post.tags ?? []).map((t: any) => t.id));
        // Only pre-fill publishedAt if it's a future date (explicitly scheduled)
        const storedDate = post.publishedAt ? new Date(post.publishedAt) : null;
        setPublishedAt(storedDate && storedDate > new Date()
          ? toDatetimeLocalString(post.publishedAt)
          : "");
        setHeroBgColor(expandHexColor(post.heroBgColor || "#ffffff"));
        setHeroBgImage(post.heroBgImage || "");
        setExcludeFromSitemap(post.excludeFromSitemap === true);

        if (catRes.ok) setCategories(await catRes.json());
        if (tagRes.ok) setTags(await tagRes.json());
      } catch (err) {
        console.error(err);
        toast.error("Error loading post");
        setTimeout(() => router.push("/admin/posts"), 2000);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAll();
  }, [postId, router]);

  // Acquire edit lock once post is loaded, keep alive with heartbeat
  useEffect(() => {
    if (isLoading) return;

    let heartbeat: ReturnType<typeof setInterval>;

    async function acquireLock() {
      try {
        const res = await fetch(`/api/posts/${postId}/lock`, { method: "POST" });
        if (res.status === 409) {
          const data = await res.json();
          setLockBlocked(true);
          setLockBlockedBy(data.lockedByEmail || "another user");
          return;
        }
        // Acquired — start heartbeat every 30s
        heartbeat = setInterval(() => {
          fetch(`/api/posts/${postId}/lock`, { method: "POST" }).catch(() => {});
        }, 30_000);
      } catch {
        // Network error — allow editing optimistically
      }
    }

    acquireLock();

    function releaseLock() {
      clearInterval(heartbeat);
      fetch(`/api/posts/${postId}/lock`, { method: "DELETE", keepalive: true }).catch(() => {});
    }

    window.addEventListener("beforeunload", releaseLock);
    return () => {
      window.removeEventListener("beforeunload", releaseLock);
      releaseLock();
    };
  }, [postId, isLoading]);

  // Auto-retry lock acquisition when blocked, in case the lock expires
  useEffect(() => {
    if (!lockBlocked) return;

    const retryInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/posts/${postId}/lock`, { method: "POST" });
        if (res.ok) {
          setLockBlocked(false);
          setLockBlockedBy("");
        }
      } catch {
        // Network error — retry again next interval
      }
    }, 5_000);

    return () => clearInterval(retryInterval);
  }, [lockBlocked, postId]);

  // Warn browser-level navigation (tab close, hard refresh, address bar) when dirty
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  async function handleSubmit(statusOverride?: "DRAFT" | "PUBLISHED") {
    setIsSaving(true);
    const finalStatus = statusOverride || status;

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          status: finalStatus,
          coverImage,
          seoTitle,
          seoDesc,
          ogImage,
          heroBgColor: heroBgColor,
          heroBgImage: heroBgImage,
          categoryIds: selectedCategoryIds,
          tagIds: selectedTagIds,
          publishedAt: (() => {
            const now = new Date();
            const parsedDate = publishedAt ? new Date(publishedAt + "Z") : null;
            if (finalStatus === "PUBLISHED") {
              // If published date is in future, publish now instead
              return parsedDate && parsedDate > now ? now.toISOString() : (parsedDate ?? now).toISOString();
            }
            return parsedDate ? parsedDate.toISOString() : undefined;
          })(),
          excludeFromSitemap,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || error.message || "Failed to save post");
        return;
      }

      setStatus(finalStatus);
      setIsDirty(false);
      toast.success("Post saved");
    } catch (err) {
      console.error(err);
      toast.error("Error saving post");
    } finally {
      setIsSaving(false);
    }
  }

  if (lockBlocked) {
    return (
      <div className="-m-8 flex flex-col h-screen bg-background items-center justify-center gap-6">
        <div className="max-w-md w-full mx-auto text-center space-y-4 p-8 bg-card border border-border rounded-2xl shadow-lg">
          <div className="text-4xl">🔒</div>
          <h2 className="text-xl font-bold">Post is being edited</h2>
          <p className="text-muted-foreground text-sm">
            <span className="font-medium text-foreground">{lockBlockedBy}</span> is currently editing this post.
            You cannot edit it at the same time.
          </p>
          <p className="text-xs text-muted-foreground">The lock expires automatically after 90 seconds of inactivity.</p>
          <Button asChild variant="outline">
            <Link href="/admin/posts">← Back to Posts</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="-m-8 flex flex-col h-screen bg-background">
        {/* Header skeleton */}
        <div className="sticky top-0 z-20 border-b border-border bg-card shadow-sm">
          <div className="flex items-center justify-between h-[53px] px-6">
            <div className="flex items-center gap-3 min-w-0">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="w-12 h-4 rounded" />
              <Skeleton className="w-1 h-4 rounded" />
              <Skeleton className="w-32 h-4 rounded flex-1" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="w-24 h-8 rounded" />
              <Skeleton className="w-20 h-8 rounded" />
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-auto bg-background">
            <div className="p-6 space-y-4">
              <Skeleton className="w-2/3 h-12 rounded" />
              <Skeleton className="w-1/3 h-4 rounded" />
              <div className="mt-6 space-y-2">
                <Skeleton className="w-full h-96 rounded" />
              </div>
            </div>
          </div>
          <div className="w-72 border-l border-border bg-card p-6 space-y-6">
            <Skeleton className="w-full h-10 rounded" />
            <Skeleton className="w-full h-10 rounded" />
            <Skeleton className="w-full h-24 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const displaySlug = slug;
  const isPublished = status === "PUBLISHED";

  return (
    <div className="-m-8 flex flex-col h-screen bg-background">
      {/* STICKY HEADER */}
      <div className="sticky top-0 z-20 border-b border-border bg-card shadow-sm">
        <div className="flex items-center justify-between h-[53px] px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => requestNavigation("/admin/posts")}
              className="text-muted-foreground hover:text-foreground transition flex-shrink-0"
              title="Back to Posts"
            >
              <ArrowLeft size={20} />
            </button>
            <span className="text-sm text-muted-foreground">Posts</span>
            <span className="text-sm text-muted-foreground/50">/</span>
            <span className="text-sm font-medium text-foreground truncate">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-3 ml-4">
            {/* Preview & Share Section */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                asChild
                variant="ghost"
                size="sm"
                title="Preview post"
              >
                <a href={`/admin/posts/${postId}/preview`} target="_blank" rel="noopener noreferrer">
                  <Eye size={16} className="mr-1" />
                  Preview
                </a>
              </Button>
              <SharePreviewButton postId={postId} postTitle={title} />
            </div>

            {/* Separator */}
            <div className="w-px h-5 bg-border" />

            {/* Publish & Delete Section */}
            <div className="flex items-center gap-2">
              {!isPublished && (
                <Button
                  type="button"
                  onClick={() => handleSubmit("DRAFT")}
                  disabled={isSaving}
                  variant="outline"
                  size="sm"
                  className="relative"
                >
                  {isSaving ? "Saving..." : "Save Draft"}
                  {isDirty && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-500" />
                  )}
                </Button>
              )}
              <Button
                type="button"
                onClick={() => isPublished ? setShowUpdateConfirm(true) : handleSubmit("PUBLISHED")}
                disabled={isSaving}
                size="sm"
                className="relative"
              >
                {isSaving ? "Saving..." : isPublished ? "Update" : "Publish"}
                {isDirty && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-500" />
                )}
              </Button>
              <PostDeleteButton
                postId={postId}
                postTitle={title}
                redirectAfter="/admin/posts"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL - Editor */}
        <div className="flex-1 flex flex-col overflow-auto bg-background">
          <div className="p-6 space-y-4 max-w-4xl mx-auto w-full">
            {/* Title */}
            <div
              ref={titleInputRef}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => { markDirty(); setTitle(e.currentTarget.textContent ?? ""); }}
              data-placeholder="Post title..."
              className="w-full text-3xl font-bold bg-transparent text-foreground focus:outline-none outline-none break-words empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none"
            />
            <hr className="border-border" />

            {/* Slug preview */}
            <div className="text-sm text-muted-foreground font-mono">
              {isPublished ? (
                <a
                  href={`/blog/${displaySlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground hover:underline transition"
                >
                  /blog/{displaySlug} ↗
                </a>
              ) : (
                <span>/blog/{displaySlug}</span>
              )}
            </div>

            {/* Editor */}
            <div className="mt-6">
              <BlockEditor content={content} onChange={(v) => { markDirty(); setContent(v); }} />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Metadata (Sticky) */}
        <aside className="w-[380px] min-[1480px]:w-[28rem] shrink-0 border-l border-border bg-card flex flex-col sticky top-[53px] h-[calc(100vh-53px)]">
          {/* Tab headers */}
          <div className="flex border-b border-border shrink-0">
            {(["post", "seo", "settings"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wide transition border-b-2 -mb-px ${
                  activeTab === tab
                    ? "text-foreground border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                {tab === "post" ? "Post" : tab === "seo" ? "SEO" : "Settings"}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="overflow-y-auto flex-1 p-6 space-y-6">
            {activeTab === "post" && (
              <>
                {/* Featured Image */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide">Featured Image</Label>
                  {coverImage ? (
                    <div className="relative">
                      <img src={coverImage} alt="Cover" className="w-full rounded-lg object-cover" />
                      <button
                        type="button"
                        onClick={() => { setCoverImage(""); markDirty(); }}
                        className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded p-0.5 transition"
                        title="Remove image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsCoverPickerOpen(true)}
                      className="w-full border-2 border-dashed border-border rounded-lg py-6 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-foreground transition"
                    >
                      <ImageIcon size={20} />
                      <span className="text-xs">Pick or upload image</span>
                    </button>
                  )}
                  <MediaPickerModal
                    open={isCoverPickerOpen}
                    onClose={() => setIsCoverPickerOpen(false)}
                    onSelect={(url) => { setCoverImage(url); markDirty(); }}
                  />
                </div>

                {/* Hero Background */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide">Hero Background</Label>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Color</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded border border-border cursor-pointer overflow-hidden flex-shrink-0"
                          style={{ backgroundColor: heroBgColor || "#ffffff" }}
                        >
                          <input
                            type="color"
                            value={heroBgColor || "#ffffff"}
                            onChange={(e) => { setHeroBgColor(e.target.value); markDirty(); }}
                            className="opacity-0 w-full h-full cursor-pointer"
                            title="Pick hero background color"
                          />
                        </div>
                        <input
                          type="text"
                          value={heroBgColor}
                          onChange={(e) => { setHeroBgColor(e.target.value); markDirty(); }}
                          onBlur={(e) => setHeroBgColor(expandHexColor(e.target.value))}
                          placeholder="#ffffff"
                          maxLength={9}
                          className="text-xs font-mono flex-1 bg-transparent border border-border/70 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground"
                        />
                        {heroBgColor !== "#ffffff" && (
                          <button
                            type="button"
                            onClick={() => { setHeroBgColor("#ffffff"); markDirty(); }}
                            className="text-muted-foreground hover:text-foreground transition"
                            title="Reset to white"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Background Image</span>
                      {heroBgImage ? (
                        <div className="relative">
                          <img src={heroBgImage} alt="Hero bg" className="w-full h-20 rounded-lg object-cover" />
                          <button
                            type="button"
                            onClick={() => { setHeroBgImage(""); markDirty(); }}
                            className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded p-0.5 transition"
                            title="Remove image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsHeroBgPickerOpen(true)}
                          className="w-full border-2 border-dashed border-border rounded-lg py-3 flex items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-foreground transition text-xs"
                        >
                          <ImageIcon size={14} />
                          Pick background image
                        </button>
                      )}
                      <MediaPickerModal
                        open={isHeroBgPickerOpen}
                        onClose={() => setIsHeroBgPickerOpen(false)}
                        onSelect={(url) => { setHeroBgImage(url); markDirty(); }}
                      />
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide">Categories</Label>
                  {categories.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No categories yet.{" "}
                      <Link href="/admin/categories" className="underline hover:text-foreground transition">
                        Create categories →
                      </Link>
                    </p>
                  ) : (
                    <div className="max-h-40 overflow-y-auto space-y-1 border border-border/70 rounded-[var(--radius)] p-2 bg-muted/30">
                      {categories.map((cat) => (
                        <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCategoryIds.includes(cat.id)}
                            onChange={(e) => {
                              markDirty();
                              setSelectedCategoryIds((prev) =>
                                e.target.checked ? [...prev, cat.id] : prev.filter((id) => id !== cat.id)
                              );
                            }}
                          />
                          {cat.name}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide">Tags</Label>
                  {tags.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No tags yet.{" "}
                      <Link href="/admin/categories" className="underline hover:text-foreground transition">
                        Manage tags →
                      </Link>
                    </p>
                  ) : (
                    <div className="max-h-40 overflow-y-auto space-y-1 border border-border/70 rounded-[var(--radius)] p-2 bg-muted/30">
                      {tags.map((tag) => (
                        <label key={tag.id} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedTagIds.includes(tag.id)}
                            onChange={(e) => {
                              markDirty();
                              setSelectedTagIds((prev) =>
                                e.target.checked ? [...prev, tag.id] : prev.filter((id) => id !== tag.id)
                              );
                            }}
                          />
                          {tag.name}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === "seo" && (
              <>
                {/* Excerpt */}
                <div className="space-y-2">
                  <Label htmlFor="excerpt" className="text-xs font-semibold uppercase tracking-wide">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => { markDirty(); setExcerpt(e.target.value); }}
                    placeholder="Brief summary shown in listings"
                    rows={3}
                    className="bg-muted/30 border-border/70"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {excerpt.trim() === "" ? 0 : excerpt.trim().split(/\s+/).length} words
                  </p>
                </div>

                {/* SEO */}
                <div className="space-y-4 border-t border-border pt-6">
                  <Label className="text-xs font-semibold uppercase tracking-wide">SEO</Label>
                  <div className="space-y-2">
                    <Label htmlFor="seoTitle" className="text-xs font-medium">SEO Title</Label>
                    <Input
                      id="seoTitle"
                      type="text"
                      value={seoTitle}
                      onChange={(e) => { markDirty(); setSeoTitle(e.target.value); }}
                      placeholder="Optimized title for search engines"
                      className="bg-muted/30 border-border/70"
                    />
                    <p className={`text-xs text-right ${
                      seoTitle.length > 60 ? "text-red-500" :
                      seoTitle.length > 50 ? "text-amber-500" :
                      "text-muted-foreground"
                    }`}>
                      {seoTitle.length} / 60
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seoDesc" className="text-xs font-medium">Meta Description</Label>
                    <Textarea
                      id="seoDesc"
                      value={seoDesc}
                      onChange={(e) => { markDirty(); setSeoDesc(e.target.value); }}
                      placeholder="Description for search results (160 chars)"
                      rows={2}
                      className="bg-muted/30 border-border/70"
                    />
                    <p className={`text-xs text-right ${
                      seoDesc.length > 160 ? "text-red-500" :
                      seoDesc.length > 150 ? "text-amber-500" :
                      "text-muted-foreground"
                    }`}>
                      {seoDesc.length} / 160
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">OG Image</Label>
                    {coverImage && !ogImage && (
                      <button
                        type="button"
                        onClick={() => { setOgImage(coverImage); markDirty(); }}
                        className="text-xs text-primary underline"
                      >
                        Use featured image
                      </button>
                    )}
                    {ogImage ? (
                      <div className="relative">
                        <img src={ogImage} alt="OG" className="w-full rounded-lg object-cover" />
                        <button
                          type="button"
                          onClick={() => { setOgImage(""); markDirty(); }}
                          className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded p-0.5 transition"
                          title="Remove OG image"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsOgPickerOpen(true)}
                        className="w-full border-2 border-dashed border-border rounded-lg py-4 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-foreground transition"
                      >
                        <ImageIcon size={16} />
                        <span className="text-xs">Pick or upload OG image</span>
                      </button>
                    )}
                    <MediaPickerModal
                      open={isOgPickerOpen}
                      onClose={() => setIsOgPickerOpen(false)}
                      onSelect={(url) => { setOgImage(url); markDirty(); }}
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === "settings" && (
              <>
                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-xs font-semibold uppercase tracking-wide">Status</Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => { markDirty(); setStatus(e.target.value as any); }}
                    className="w-full border border-border/70 rounded-[var(--radius)] px-3 py-2 text-sm bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>

                {/* Publish Date */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="publishedAt" className="text-xs font-semibold uppercase tracking-wide">
                      Publish Date
                    </Label>
                    <span className="text-xs text-muted-foreground font-medium">Times are in UTC</span>
                  </div>
                  <input
                    id="publishedAt"
                    type="datetime-local"
                    value={publishedAt}
                    onChange={(e) => { markDirty(); setPublishedAt(e.target.value); }}
                    className="w-full border border-border/70 rounded-[var(--radius)] px-3 py-2 text-sm bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 dark:[color-scheme:dark]"
                  />
                  {publishedAt && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-mono">
                      {formatAdminDate(publishedAt + "Z")}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {status === "DRAFT"
                      ? "Set a future date to schedule. Post won't appear until then."
                      : "Leave empty to publish immediately."}
                  </p>
                </div>

                {/* URL Slug */}
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-xs font-semibold uppercase tracking-wide">URL Slug</Label>
                  <Input
                    id="slug"
                    type="text"
                    value={slug}
                    onChange={(e) => { markDirty(); setSlug(e.target.value); }}
                    className="bg-muted/30 border-border/70"
                  />
                  <div className="text-xs text-muted-foreground font-mono">/blog/{displaySlug}</div>
                </div>

                {/* Sitemap */}
                <div className="space-y-2 pt-1">
                  <Label className="text-xs font-semibold uppercase tracking-wide">SEO / Sitemap</Label>
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={excludeFromSitemap}
                      onChange={(e) => { markDirty(); setExcludeFromSitemap(e.target.checked); }}
                      className="rounded"
                    />
                    <span className="text-sm">Exclude from sitemap.xml</span>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    When checked, this post won't appear in sitemap.xml and may be deprioritized by search engines.
                  </p>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      {/* Update Confirmation Dialog */}
      <Dialog open={showUpdateConfirm} onOpenChange={setShowUpdateConfirm}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Update published post?</DialogTitle>
            <DialogDescription className="text-foreground/70">
              This post is live. Changes will be visible immediately to all readers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowUpdateConfirm(false);
                handleSubmit("PUBLISHED");
              }}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
