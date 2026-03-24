"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import BlockEditor from "@/components/admin/BlockEditor";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ChevronDown, ChevronUp, ImageIcon, X, Eye } from "lucide-react";
import { PostDeleteButton } from "@/components/admin/PostDeleteButton";
import SharePreviewButton from "@/components/admin/SharePreviewButton";
import { toast } from "sonner";

function toDatetimeLocalString(date: string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 16);
}

export default function EditPostClient() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const titleInputRef = useRef<HTMLTextAreaElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCoverPickerOpen, setIsCoverPickerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState<any>({ type: "doc", content: [] });
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [coverImage, setCoverImage] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [publishedAt, setPublishedAt] = useState("");

  async function handleCoverImageUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) return;
    const { url } = await res.json();
    setCoverImage(url);
  }

  // Auto-resize title textarea
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.style.height = "auto";
      titleInputRef.current.style.height = titleInputRef.current.scrollHeight + "px";
    }
  }, [title]);

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
        setContent(post.content || { type: "doc", content: [] });
        setStatus(post.status);
        setCoverImage(post.coverImage || "");
        setSeoTitle(post.seoTitle || "");
        setSeoDesc(post.seoDesc || "");
        setOgImage(post.ogImage || "");
        setSelectedCategoryIds((post.categories ?? []).map((c: any) => c.id));
        setSelectedTagIds((post.tags ?? []).map((t: any) => t.id));
        setPublishedAt(toDatetimeLocalString(post.publishedAt));

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
          categoryIds: selectedCategoryIds,
          tagIds: selectedTagIds,
          publishedAt: finalStatus === "PUBLISHED"
            ? (publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString())
            : (publishedAt ? new Date(publishedAt).toISOString() : undefined),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || "Failed to save post");
        return;
      }

      setStatus(finalStatus);
      toast.success("Post saved");
    } catch (err) {
      console.error(err);
      toast.error("Error saving post");
    } finally {
      setIsSaving(false);
    }
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
            <Link
              href="/admin/posts"
              className="text-muted-foreground hover:text-foreground transition flex-shrink-0"
              title="Back to Posts"
            >
              <ArrowLeft size={20} />
            </Link>
            <span className="text-sm text-muted-foreground">Posts</span>
            <span className="text-sm text-muted-foreground/50">/</span>
            <span className="text-sm font-medium text-foreground truncate">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-3 ml-4">
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
            {!isPublished && (
              <Button
                type="button"
                onClick={() => handleSubmit("DRAFT")}
                disabled={isSaving}
                variant="outline"
                size="sm"
              >
                {isSaving ? "Saving..." : "Save Draft"}
              </Button>
            )}
            <Button
              type="button"
              onClick={() => handleSubmit(isPublished ? "PUBLISHED" : "PUBLISHED")}
              disabled={isSaving}
              size="sm"
            >
              {isSaving ? "Saving..." : isPublished ? "Update" : "Publish"}
            </Button>
            <PostDeleteButton
              postId={postId}
              postTitle={title}
              redirectAfter="/admin/posts"
            />
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL - Editor */}
        <div className="flex-1 flex flex-col overflow-auto bg-background">
          <div className="p-6 space-y-4">
            {/* Title */}
            <div>
              <textarea
                ref={titleInputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title..."
                className="w-full text-3xl font-bold border-0 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none resize-none overflow-hidden"
                rows={1}
              />
            </div>

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
              <BlockEditor content={content} onChange={setContent} />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Metadata (Sticky) */}
        <aside className="w-72 border-l border-border bg-card overflow-y-auto sticky top-[53px] h-[calc(100vh-53px)]">
          <div className="p-6 space-y-6">
            {/* Cover Image */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide">Featured Image</Label>
              {coverImage ? (
                <div className="relative">
                  <img src={coverImage} alt="Cover" className="w-full rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
                    className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded p-0.5 transition"
                    title="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => coverImageInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-border rounded-lg py-6 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-foreground transition"
                  >
                    <ImageIcon size={20} />
                    <span className="text-xs">Upload image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCoverPickerOpen(true)}
                    className="w-full text-xs text-muted-foreground hover:text-foreground transition text-center"
                  >
                    Or pick from library →
                  </button>
                </div>
              )}
              <input
                ref={coverImageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCoverImageUpload(file);
                  e.target.value = "";
                }}
              />
              <MediaPickerModal
                open={isCoverPickerOpen}
                onClose={() => setIsCoverPickerOpen(false)}
                onSelect={(url) => setCoverImage(url)}
              />
            </div>

            {/* Status Card */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-xs font-semibold uppercase tracking-wide">
                Status
              </Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full border border-border/70 rounded-[var(--radius)] px-3 py-2 text-sm bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>

            {/* Publish Date */}
            <div className="space-y-2">
              <Label htmlFor="publishedAt" className="text-xs font-semibold uppercase tracking-wide">
                Publish Date
              </Label>
              <input
                id="publishedAt"
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full border border-border/70 rounded-[var(--radius)] px-3 py-2 text-sm bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 dark:[color-scheme:dark]"
              />
              <p className="text-xs text-muted-foreground">
                {status === "DRAFT"
                  ? "Set a future date to schedule. Post won't appear until then."
                  : "Leave empty to publish immediately."}
              </p>
            </div>

            {/* URL Slug Card */}
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-xs font-semibold uppercase tracking-wide">
                URL Slug
              </Label>
              <Input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="bg-muted/30 border-border/70"
              />
              <div className="text-xs text-muted-foreground font-mono">
                /blog/{displaySlug}
              </div>
            </div>

            {/* Excerpt Card */}
            <div className="space-y-2">
              <Label htmlFor="excerpt" className="text-xs font-semibold uppercase tracking-wide">
                Excerpt
              </Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary shown in listings"
                rows={3}
                className="bg-muted/30 border-border/70"
              />
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
                        onChange={(e) =>
                          setSelectedCategoryIds((prev) =>
                            e.target.checked ? [...prev, cat.id] : prev.filter((id) => id !== cat.id)
                          )
                        }
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
                        onChange={(e) =>
                          setSelectedTagIds((prev) =>
                            e.target.checked ? [...prev, tag.id] : prev.filter((id) => id !== tag.id)
                          )
                        }
                      />
                      {tag.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* SEO Accordion */}
            <div className="border-t border-border pt-6">
              <button
                type="button"
                onClick={() => setIsSeoOpen(!isSeoOpen)}
                className="w-full flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground transition"
              >
                <span>SEO</span>
                {isSeoOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {isSeoOpen && (
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="seoTitle" className="text-xs font-medium mb-1">
                      SEO Title
                    </Label>
                    <Input
                      id="seoTitle"
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="Optimized title for search engines"
                      className="bg-muted/30 border-border/70"
                    />
                  </div>

                  <div>
                    <Label htmlFor="seoDesc" className="text-xs font-medium mb-1">
                      Meta Description
                    </Label>
                    <Textarea
                      id="seoDesc"
                      value={seoDesc}
                      onChange={(e) => setSeoDesc(e.target.value)}
                      placeholder="Description for search results (160 chars)"
                      rows={2}
                      className="bg-muted/30 border-border/70"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ogImage" className="text-xs font-medium mb-1">
                      OG Image URL
                    </Label>
                    <Input
                      id="ogImage"
                      type="text"
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                      placeholder="https://... (Open Graph image)"
                      className="bg-muted/30 border-border/70"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
