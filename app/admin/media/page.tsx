"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function fetchMedia(p: number, append = false) {
    const res = await fetch(`/api/media?page=${p}`);
    if (!res.ok) return;
    const data = await res.json();
    setItems((prev) => (append ? [...prev, ...data.items] : data.items));
    setTotal(data.total);
    setPage(p);
  }

  useEffect(() => {
    fetchMedia(1).finally(() => setIsLoading(false));
  }, []);

  async function handleUpload(file: File) {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) return;
      // Refresh from page 1 to get the new item at top
      await fetchMedia(1);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setTotal((t) => t - 1);
    }
  }

  async function copyUrl(item: MediaItem) {
    await navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const hasMore = items.length < total;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Media Library</h1>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Image"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = "";
          }}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-border rounded-lg py-24 flex flex-col items-center gap-3 text-muted-foreground hover:border-primary/50 hover:text-foreground transition"
        >
          <span className="text-4xl">🖼️</span>
          <span className="text-sm">No media yet. Click to upload your first image.</span>
        </button>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative border border-border rounded-lg overflow-hidden bg-muted/20"
              >
                <div className="aspect-square">
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2 space-y-1">
                  <p className="text-xs font-medium truncate" title={item.filename}>
                    {item.filename}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(item.size / 1024).toFixed(1)} KB
                  </p>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => copyUrl(item)}
                      className="flex-1 text-xs px-2 py-1 rounded border border-border hover:bg-muted transition"
                    >
                      {copiedId === item.id ? "Copied!" : "Copy URL"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="text-xs px-2 py-1 rounded border border-border text-destructive hover:bg-destructive hover:text-destructive-foreground transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => fetchMedia(page + 1, true)}
              >
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
