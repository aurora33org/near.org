"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Image, AlertTriangle, Search } from "lucide-react";

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
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [oversizedFiles, setOversizedFiles] = useState<File[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function fetchMedia(p: number, append = false, q = "", type = "all") {
    const params = new URLSearchParams({ page: String(p) });
    if (q) params.set("q", q);
    if (type !== "all") params.set("type", type);
    const res = await fetch(`/api/media?${params}`);
    if (!res.ok) return;
    const data = await res.json();
    setItems((prev) => (append ? [...prev, ...data.items] : data.items));
    setTotal(data.total);
    setPage(p);
  }

  useEffect(() => {
    setIsLoading(true);
    setItems([]);
    const timer = setTimeout(() => {
      fetchMedia(1, false, search, typeFilter).finally(() => setIsLoading(false));
    }, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [search, typeFilter]);

  function closeUploadModal() {
    setShowUploadModal(false);
    setOversizedFiles([]);
    setDragOver(false);
  }

  function handleFilesSelected(files: File[]) {
    if (files.length === 0) return;
    const WEB_OPTIMAL_BYTES = 500 * 1024;
    const ok = files.filter((f) => f.size <= WEB_OPTIMAL_BYTES);
    const oversized = files.filter((f) => f.size > WEB_OPTIMAL_BYTES);

    if (ok.length > 0) handleUploadMany(ok);
    if (oversized.length > 0) {
      setOversizedFiles(oversized);
    } else {
      closeUploadModal();
    }
  }

  async function handleUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    await fetch("/api/upload", { method: "POST", body: formData });
  }

  async function handleUploadMany(files: File[]) {
    setIsUploading(true);
    try {
      await Promise.all(files.map((f) => handleUpload(f)));
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
          onClick={() => setShowUploadModal(true)}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Image"}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          {(["all", "image", "other"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 text-sm rounded-md transition ${
                typeFilter === t
                  ? "bg-background shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "all" ? "All" : t === "image" ? "Images" : "Other"}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-video bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : items.length === 0 ? (
        search || typeFilter !== "all" ? (
          <div className="w-full border border-border rounded-lg py-24 flex flex-col items-center gap-3 text-muted-foreground">
            <Search className="w-10 h-10 opacity-30" />
            <span className="text-sm">No results for your search.</span>
          </div>
        ) : (
        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          className="w-full border-2 border-dashed border-border rounded-lg py-24 flex flex-col items-center gap-3 text-muted-foreground hover:border-primary/50 hover:text-foreground transition"
        >
          <Image className="w-10 h-10 opacity-40" />
          <span className="text-sm">No media yet. Click to upload your first image.</span>
        </button>
        )
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
                onClick={() => fetchMedia(page + 1, true, search, typeFilter)}
              >
                Load More
              </Button>
            </div>
          )}
        </>
      )}

      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={closeUploadModal}
        >
          <div
            className="relative bg-background border border-border rounded-2xl shadow-xl w-full max-w-3xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold">Upload Image</h2>
              <button
                type="button"
                onClick={closeUploadModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition text-xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {oversizedFiles.length > 0 ? (
                /* Warning view */
                <div className="space-y-5">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" />
                    <div className="space-y-3 flex-1">
                      <p className="font-semibold text-base">
                        {oversizedFiles.length === 1
                          ? "This image may slow down your site"
                          : `${oversizedFiles.length} images may slow down your site`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        For fast page loads, images should be under 500 KB. Compress or resize them first using{" "}
                        <a
                          href="https://croma.aurora33.live"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline hover:no-underline"
                        >
                          croma.aurora33.live
                        </a>
                        .
                      </p>
                      <ul className="space-y-1">
                        {oversizedFiles.map((f) => (
                          <li key={f.name} className="flex items-center justify-between text-sm rounded-lg border border-border px-3 py-2">
                            <span className="font-medium truncate mr-3">{f.name}</span>
                            <span className="text-muted-foreground shrink-0">{(f.size / (1024 * 1024)).toFixed(2)} MB</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setOversizedFiles([])}
                      className="flex-1 text-sm px-4 py-2 rounded-lg border border-border hover:bg-muted transition"
                    >
                      Choose other images
                    </button>
                  </div>
                </div>
              ) : (
                /* Drop zone */
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const files = Array.from(e.dataTransfer.files);
                    if (files.length) handleFilesSelected(files);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`min-h-[480px] flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed cursor-pointer transition ${
                    dragOver
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  <Image className="w-16 h-16 opacity-30" />
                  <p className="text-xl font-semibold">Drop your images here</p>
                  <p className="text-base">or click to browse</p>
                  <p className="text-sm text-muted-foreground mt-2">JPEG · PNG · WebP · GIF · SVG</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      if (files.length) handleFilesSelected(files);
                      e.target.value = "";
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
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

      {confirmDelete && selectedItem && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
          onClick={() => setConfirmDelete(false)}
        >
          <div
            className="bg-background border border-border rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              <p className="font-semibold text-base">Delete this file?</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{selectedItem.filename}</span> will be permanently removed. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="flex-1 text-sm px-4 py-2 rounded-lg border border-border hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(selectedItem.id)}
                className="flex-1 text-sm px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
