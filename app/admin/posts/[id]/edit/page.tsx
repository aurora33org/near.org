"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import BlockEditor from "@/components/admin/BlockEditor";
import { ArrowLeft, ChevronDown, ChevronUp, Check } from "lucide-react";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const titleInputRef = useRef<HTMLTextAreaElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState<any>({ type: "doc", content: [] });
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  // Auto-resize title textarea
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.style.height = "auto";
      titleInputRef.current.style.height = titleInputRef.current.scrollHeight + "px";
    }
  }, [title]);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/posts/${postId}`);
        if (!response.ok) throw new Error("Failed to fetch post");
        const post = await response.json();

        setTitle(post.title);
        setSlug(post.slug);
        setExcerpt(post.excerpt || "");
        setContent(post.content || { type: "doc", content: [] });
        setStatus(post.status);
        setSeoTitle(post.seoTitle || "");
        setSeoDesc(post.seoDesc || "");
      } catch (err) {
        console.error(err);
        setSavedMessage("Error loading post");
        setTimeout(() => setSavedMessage(""), 3000);
        // Redirect after delay
        setTimeout(() => router.push("/admin/posts"), 2000);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPost();
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
          seoTitle,
          seoDesc,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setSavedMessage(`Error: ${error.message}`);
        setTimeout(() => setSavedMessage(""), 3000);
        return;
      }

      // Update status state if it was changed
      setStatus(finalStatus);
      setSavedMessage("Saved");
      setTimeout(() => setSavedMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setSavedMessage("Error saving post");
      setTimeout(() => setSavedMessage(""), 3000);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="-m-8 flex flex-col h-screen bg-gray-50">
        {/* Header skeleton */}
        <div className="sticky top-0 z-20 border-b bg-white shadow-sm">
          <div className="flex items-center justify-between h-[53px] px-6">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="w-12 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-1 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse flex-1" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-auto">
            <div className="p-6 space-y-4">
              <div className="w-2/3 h-12 bg-gray-200 rounded animate-pulse" />
              <div className="w-1/3 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="mt-6 space-y-2">
                <div className="w-full h-96 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
          <div className="w-72 border-l bg-white p-6 space-y-6">
            <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
            <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
            <div className="w-full h-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const displaySlug = slug;
  const isPublished = status === "PUBLISHED";

  return (
    <div className="-m-8 flex flex-col h-screen bg-gray-50">
      {/* STICKY HEADER */}
      <div className="sticky top-0 z-20 border-b bg-white shadow-sm">
        <div className="flex items-center justify-between h-[53px] px-6">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/admin/posts"
              className="text-gray-500 hover:text-gray-700 transition flex-shrink-0"
              title="Back to Posts"
            >
              <ArrowLeft size={20} />
            </Link>
            <span className="text-sm text-gray-600">Posts</span>
            <span className="text-sm text-gray-400">/</span>
            <span className="text-sm font-medium text-gray-800 truncate">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-3 ml-4">
            {savedMessage && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <Check size={16} />
                {savedMessage}
              </div>
            )}
            {!isPublished && (
              <button
                type="button"
                onClick={() => handleSubmit("DRAFT")}
                disabled={isSaving}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isSaving ? "Saving..." : "Save Draft"}
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSubmit(isPublished ? "PUBLISHED" : "PUBLISHED")}
              disabled={isSaving}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isSaving ? "Saving..." : isPublished ? "Update" : "Publish"}
            </button>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL - Editor */}
        <div className="flex-1 flex flex-col overflow-auto">
          <div className="p-6 space-y-4">
            {/* Title */}
            <div>
              <textarea
                ref={titleInputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title..."
                className="w-full text-3xl font-bold border-0 bg-transparent focus:outline-none resize-none overflow-hidden"
                rows={1}
              />
            </div>

            {/* Slug preview */}
            <div className="text-sm text-gray-500 font-mono">
              /blog/{displaySlug}
            </div>

            {/* Editor */}
            <div className="mt-6">
              <BlockEditor content={content} onChange={setContent} />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Metadata (Sticky) */}
        <aside className="w-72 border-l bg-white overflow-y-auto sticky top-[53px] h-[calc(100vh-53px)]">
          <div className="p-6 space-y-6">
            {/* Status Card */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>

            {/* URL Slug Card */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-xs text-gray-500 font-mono">
                /blog/{displaySlug}
              </div>
            </div>

            {/* Excerpt Card */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Excerpt
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary shown in listings"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* SEO Accordion */}
            <div className="border-t pt-6">
              <button
                type="button"
                onClick={() => setIsSeoOpen(!isSeoOpen)}
                className="w-full flex items-center justify-between text-xs font-semibold text-gray-600 uppercase tracking-wide hover:text-gray-900 transition"
              >
                <span>SEO</span>
                {isSeoOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {isSeoOpen && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="Optimized title for search engines"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      value={seoDesc}
                      onChange={(e) => setSeoDesc(e.target.value)}
                      placeholder="Description for search results (160 chars)"
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
