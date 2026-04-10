"use client";

import { useState, useRef, useEffect } from "react";

function expandHexColor(color: string): string {
  if (/^#[0-9a-fA-F]{3}$/.test(color)) {
    return "#" + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
  }
  return color;
}

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")      // collapse multiple dashes
    .replace(/^-+|-+$/g, ""); // trim leading/trailing dashes
}
import { useRouter } from "next/navigation";
import Link from "next/link";
import BlockEditor from "@/components/admin/editor/BlockEditor";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigationGuard } from "@/components/admin/NavigationGuardProvider";
import { formatAdminDate } from "@/lib/utils";

export default function NewPostClient() {
  const router = useRouter();
  const titleInputRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
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
  const [isCoverPickerOpen, setIsCoverPickerOpen] = useState(false);
  const [heroBgColor, setHeroBgColor] = useState("#ffffff");
  const [heroBgImage, setHeroBgImage] = useState("");
  const [isHeroBgPickerOpen, setIsHeroBgPickerOpen] = useState(false);
  const [isOgPickerOpen, setIsOgPickerOpen] = useState(false);
  const { isDirty, setIsDirty, requestNavigation } = useNavigationGuard();
  const markDirty = () => setIsDirty(true);
  const [editorKey, setEditorKey] = useState(0);
  const [autosavedAt, setAutosavedAt] = useState<Date | null>(null);
  const [draftRecovery, setDraftRecovery] = useState<{ savedAt: Date; draft: any } | null>(null);
  const autosaveStateRef = useRef({
    isDirty: false, title: "", content: {} as any, slug: "", excerpt: "",
    coverImage: "", heroBgColor: "#ffffff", heroBgImage: "", seoTitle: "",
    seoDesc: "", ogImage: "", publishedAt: "", selectedCategoryIds: [] as string[],
    selectedTagIds: [] as string[],
  });

  useEffect(() => {
    Promise.all([fetch("/api/categories"), fetch("/api/tags")]).then(
      async ([catRes, tagRes]) => {
        if (catRes.ok) setCategories(await catRes.json());
        if (tagRes.ok) setTags(await tagRes.json());
      }
    );
  }, []);

  // Check for a recovered draft on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cms_draft_new");
      if (!stored) return;
      const draft = JSON.parse(stored);
      if (draft.savedAt) {
        setDraftRecovery({ savedAt: new Date(draft.savedAt), draft });
      }
    } catch {
      localStorage.removeItem("cms_draft_new");
    }
  }, []);

  // Keep autosave ref current with latest state
  useEffect(() => {
    autosaveStateRef.current = {
      isDirty, title, content, slug, excerpt, coverImage, heroBgColor,
      heroBgImage, seoTitle, seoDesc, ogImage, publishedAt,
      selectedCategoryIds, selectedTagIds,
    };
  }, [isDirty, title, content, slug, excerpt, coverImage, heroBgColor,
      heroBgImage, seoTitle, seoDesc, ogImage, publishedAt, selectedCategoryIds, selectedTagIds]);

  // Autosave every 30s when dirty
  useEffect(() => {
    const interval = setInterval(() => {
      const s = autosaveStateRef.current;
      if (!s.isDirty) return;
      try {
        localStorage.setItem("cms_draft_new", JSON.stringify({
          title: s.title, content: s.content, slug: s.slug, excerpt: s.excerpt,
          coverImage: s.coverImage, heroBgColor: s.heroBgColor, heroBgImage: s.heroBgImage,
          seoTitle: s.seoTitle, seoDesc: s.seoDesc, ogImage: s.ogImage,
          publishedAt: s.publishedAt, selectedCategoryIds: s.selectedCategoryIds,
          selectedTagIds: s.selectedTagIds, savedAt: new Date().toISOString(),
        }));
        setAutosavedAt(new Date());
      } catch { /* storage quota exceeded */ }
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

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

  function handleRestoreDraft() {
    if (!draftRecovery) return;
    const d = draftRecovery.draft;
    setTitle(d.title || "");
    setContent(d.content || { type: "doc", content: [{ type: "paragraph" }] });
    setSlug(d.slug || "");
    setExcerpt(d.excerpt || "");
    setCoverImage(d.coverImage || "");
    setHeroBgColor(d.heroBgColor || "#ffffff");
    setHeroBgImage(d.heroBgImage || "");
    setSeoTitle(d.seoTitle || "");
    setSeoDesc(d.seoDesc || "");
    setOgImage(d.ogImage || "");
    setPublishedAt(d.publishedAt || "");
    setSelectedCategoryIds(d.selectedCategoryIds || []);
    setSelectedTagIds(d.selectedTagIds || []);
    setEditorKey((k) => k + 1);
    if (titleInputRef.current) titleInputRef.current.textContent = d.title || "";
    setDraftRecovery(null);
    markDirty();
  }

  function handleDiscardDraft() {
    localStorage.removeItem("cms_draft_new");
    setDraftRecovery(null);
  }

  // Cmd+S / Ctrl+S keyboard shortcut to save
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSubmit();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit]);

  async function handleSubmit(statusOverride?: "DRAFT" | "PUBLISHED") {
    setIsLoading(true);
    const finalStatus = statusOverride || status;

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slug || titleToSlug(title),
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
          publishedAt: finalStatus === "PUBLISHED"
            ? (publishedAt ? new Date(publishedAt + "Z").toISOString() : new Date().toISOString())
            : (publishedAt ? new Date(publishedAt + "Z").toISOString() : undefined),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || error.message || "Failed to create post");
        return;
      }

      const post = await response.json();
      setIsDirty(false);
      localStorage.removeItem("cms_draft_new");
      setAutosavedAt(null);
      router.push(`/admin/posts/${post.id}/edit`);
    } catch (err) {
      console.error(err);
      toast.error("Error creating post");
    } finally {
      setIsLoading(false);
    }
  }

  const displaySlug = slug || titleToSlug(title);
  const autosaveLabel = autosavedAt
    ? `Autosaved at ${autosavedAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" })} UTC`
    : undefined;

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
              {title || "New Post"}
            </span>
          </div>

          <div className="flex items-center gap-3 ml-4">
            {autosaveLabel && (
              <span className="text-xs text-muted-foreground hidden sm:block">{autosaveLabel}</span>
            )}
            <Button
              type="button"
              onClick={() => handleSubmit("DRAFT")}
              disabled={isLoading || !title}
              variant="outline"
              size="sm"
              className="relative"
            >
              Save Draft
              {isDirty && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-500" />
              )}
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit("PUBLISHED")}
              disabled={isLoading || !title}
              size="sm"
              className="relative"
            >
              Publish
              {isDirty && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-500" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL - Editor */}
        <div className="flex-1 flex flex-col overflow-auto bg-background">
          <div className="p-6 space-y-4 max-w-4xl mx-auto w-full">
            {/* Draft recovery banner */}
            {draftRecovery && (
              <div className="flex items-center justify-between gap-4 rounded-lg border border-amber-400/50 bg-amber-500/10 px-4 py-3">
                <span className="text-sm text-amber-700 dark:text-amber-400">
                  Draft recovered from {formatAdminDate(draftRecovery.savedAt.toISOString())}
                </span>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={handleRestoreDraft}>Restore</Button>
                  <Button size="sm" variant="ghost" onClick={handleDiscardDraft}>Discard</Button>
                </div>
              </div>
            )}

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
              /blog/{displaySlug}
            </div>

            {/* Editor */}
            <div className="mt-6">
              <BlockEditor
                key={editorKey}
                content={content}
                onChange={(v) => { markDirty(); setContent(v); }}
                autosaveLabel={autosaveLabel}
              />
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
                    placeholder={displaySlug}
                    className="bg-muted/30 border-border/70"
                  />
                  <div className="text-xs text-muted-foreground font-mono">/blog/{displaySlug}</div>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
