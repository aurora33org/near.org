"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  alt: string | null;
  createdAt: string;
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [editFilename, setEditFilename] = useState("");
  const [editAlt, setEditAlt] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
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
      setSelectedItem(null);
    }
  }

  async function handleSave() {
    if (!selectedItem) return;
    setIsSaving(true);
    const res = await fetch(`/api/media/${selectedItem.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: editFilename, alt: editAlt }),
    });
    if (res.ok) {
      const updated = await res.json();
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      setSelectedItem(updated);
    }
    setIsSaving(false);
  }

  async function copyUrl(item: MediaItem) {
    await navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function openOptions(item: MediaItem) {
    setSelectedItem(item);
    setEditFilename(item.filename);
    setEditAlt(item.alt ?? "");
    setConfirmDelete(false);
  }

  function closeModal() {
    setSelectedItem(null);
    setConfirmDelete(false);
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
            <div key={i} className="aspect-video bg-muted animate-pulse rounded-lg" />
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
                className="group relative border border-border rounded-t-lg rounded-b-2xl overflow-hidden bg-muted/20 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div className="aspect-video cursor-pointer" onClick={() => openOptions(item)}>
                  <img
                    src={item.url}
                    alt={item.alt ?? item.filename}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2 pt-2 space-y-2">
                  <p className="text-sm font-medium break-words" title={item.filename}>
                    {item.filename}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(item.size / 1024).toFixed(1)} KB
                  </p>
                  <button
                    type="button"
                    onClick={() => openOptions(item)}
                    className="w-full text-sm px-2 py-2 rounded-lg border border-border hover:bg-muted transition"
                  >
                    Options
                  </button>
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

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={closeModal}
        >
          <div className="relative w-full max-w-[1280px] mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={closeModal}
              className="absolute -top-4 -right-4 w-8 h-8 flex items-center justify-center rounded-full bg-background hover:bg-muted text-foreground shadow-md transition text-lg leading-none z-10"
            >
              ×
            </button>
          <div
            className="bg-background border border-border rounded-2xl shadow-xl w-full max-h-[940px] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Body: image left, info right */}
            <div className="flex flex-1 min-h-0">
              {/* Image preview — 65% */}
              <div className="w-[65%] bg-muted/30 flex items-center justify-center p-6">
                <img
                  src={selectedItem.url}
                  alt={selectedItem.alt ?? selectedItem.filename}
                  className="w-full object-contain rounded-lg max-h-[840px]"
                />
              </div>

              {/* Info + actions — 35% */}
              <div className="w-[35%] flex flex-col border-l border-border">
                {/* Fields */}
                <div className="flex-1 px-5 py-5 space-y-4">
                  <p className="text-base font-semibold truncate" title={selectedItem.filename}>
                    {selectedItem.filename}
                  </p>
                  <p className="text-sm text-muted-foreground -mt-2">
                    {(selectedItem.size / 1024).toFixed(1)} KB · {selectedItem.filename.split('.').pop()?.toUpperCase()}
                  </p>
                  <hr className="border-border" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground block mb-1">
                      Filename
                    </label>
                    <input
                      type="text"
                      value={editFilename}
                      onChange={(e) => setEditFilename(e.target.value)}
                      className="w-full text-base border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground block mb-1">
                      Alt text (SEO)
                    </label>
                    <input
                      type="text"
                      value={editAlt}
                      onChange={(e) => setEditAlt(e.target.value)}
                      placeholder="Describe the image for accessibility and SEO…"
                      className="w-full text-base border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 px-5 py-4 border-t border-border">
                  <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => copyUrl(selectedItem)}
                    className="flex-[2] text-sm px-3 py-2 rounded-lg border border-border hover:bg-muted transition text-center"
                  >
                    {copiedId === selectedItem.id ? "Copied!" : "Copy URL"}
                  </button>
                  <a
                    href={selectedItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-[2] text-sm px-3 py-2 rounded-lg border border-border hover:bg-muted transition text-center"
                  >
                    Open in new tab
                  </a>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="flex-1 text-sm px-3 py-2 rounded-lg border border-border text-destructive hover:bg-destructive hover:text-destructive-foreground transition"
                  >
                    Delete
                  </button>
                  </div>

                  {confirmDelete && (
                    <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-3 space-y-2">
                      <p className="text-sm font-medium text-destructive">
                        Delete this file? This action cannot be undone.
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(false)}
                          className="flex-1 text-sm px-3 py-2 rounded-lg border border-border hover:bg-muted transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(selectedItem.id)}
                          className="flex-1 text-sm px-3 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition"
                        >
                          Yes, delete
                        </button>
                      </div>
                    </div>
                  )}

                  <hr className="border-border" />
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full text-sm px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
                  >
                    {isSaving ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
