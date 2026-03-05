"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BlockEditor from "@/components/admin/BlockEditor";
import { ArrowLeft, ChevronDown, ChevronUp, Check } from "lucide-react";

export default function NewPostPage() {
  const router = useRouter();
  const titleInputRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(false);
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


  async function handleSubmit(statusOverride?: "DRAFT" | "PUBLISHED") {
    setIsLoading(true);
    const finalStatus = statusOverride || status;

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slug || title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
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

      const post = await response.json();
      router.push(`/admin/posts/${post.id}/edit`);
    } catch (err) {
      console.error(err);
      setSavedMessage("Error creating post");
      setTimeout(() => setSavedMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  }

  const displaySlug = slug || title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

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
              {title || "New Post"}
            </span>
          </div>

          <div className="flex items-center gap-3 ml-4">
            {savedMessage && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <Check size={16} />
                {savedMessage}
              </div>
            )}
            <button
              type="button"
              onClick={() => handleSubmit("DRAFT")}
              disabled={isLoading || !title}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("PUBLISHED")}
              disabled={isLoading || !title}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              Publish
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
                placeholder="auto-generated"
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
