"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon, Loader2, CheckCircle2, UploadCloud, AlertTriangle, Search } from "lucide-react";
import { useAdminTheme } from "@/components/admin/ThemeProvider";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  alt: string | null;
}

interface MediaPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

const PAGE_SIZE = 24;

export default function MediaPickerModal({
  open,
  onClose,
  onSelect,
}: MediaPickerModalProps) {
  const { theme } = useAdminTheme();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [oversizedFile, setOversizedFile] = useState<File | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const WEB_OPTIMAL_BYTES = 500 * 1024; // 500 KB

  const fetchMedia = useCallback(async (pageNum: number, reset = false, q = "") => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(pageNum), limit: String(PAGE_SIZE) });
      if (q) params.set("q", q);
      const res = await fetch(`/api/media?${params}`);
      if (!res.ok) return;
      const data = await res.json();
      setItems((prev) => (reset ? data.items : [...prev, ...data.items]));
      setTotal(data.total);
      setPage(pageNum);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      setSelected(null);
      setUploadSuccess(false);
    } else {
      setItems([]);
      setSearch("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setItems([]);
    const timer = setTimeout(() => {
      fetchMedia(1, true, search);
    }, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [search, open, fetchMedia]);

  async function handleUpload(file: File) {
    setOversizedFile(null);
    setIsUploading(true);
    setUploadSuccess(false);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) return;
      const { url } = await res.json();
      await fetchMedia(1, true, search);
      setSelected(url);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 2000);
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileSelected(file: File) {
    if (file.size > WEB_OPTIMAL_BYTES) {
      setOversizedFile(file);
    } else {
      handleUpload(file);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleFileSelected(file);
  }

  function handleSelect() {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  }

  const hasMore = items.length < total;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[70vw] max-w-[70vw] sm:max-w-[70vw] h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
        <div className={`${theme === "dark" ? "dark" : ""} relative flex flex-col flex-1 overflow-hidden bg-background text-foreground rounded-[inherit]`}>
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-border flex-shrink-0">
            <DialogTitle>Insert Image</DialogTitle>
          </DialogHeader>

          <div className="flex flex-1 overflow-hidden">
            {/* LEFT PANEL — Library */}
            <div className="flex-[3] flex flex-col overflow-hidden border-r border-border">
              <p className="px-4 pt-3 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground flex-shrink-0">
                Media Library
              </p>
              <div className="px-4 pb-2 flex-shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by filename…"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                {isLoading && items.length === 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <Skeleton key={i} className="aspect-square rounded-lg" />
                    ))}
                  </div>
                ) : items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground text-sm">
                    <ImageIcon size={32} className="opacity-30" />
                    <span>No media uploaded yet.</span>
                    <span className="text-xs">Upload an image using the panel on the right.</span>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      {items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelected(item.url)}
                          className={`group relative rounded-lg overflow-hidden border-2 transition focus:outline-none ${
                            selected === item.url
                              ? "border-primary"
                              : "border-transparent hover:border-border"
                          }`}
                        >
                          <div className="aspect-square bg-muted">
                            <img
                              src={item.url}
                              alt={item.alt ?? item.filename}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="px-1 py-0.5 text-[10px] text-muted-foreground truncate text-left">
                            {item.filename}
                          </p>
                          {selected === item.url && (
                            <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                              ✓
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {hasMore && (
                      <div className="flex justify-center mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fetchMedia(page + 1, false, search)}
                          disabled={isLoading}
                        >
                          {isLoading ? "Loading..." : "Load more"}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* RIGHT PANEL — Upload */}
            <div className="flex-[2] flex flex-col p-4 gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Upload New Image
              </p>

              <div
                className={`flex-1 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition cursor-pointer ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/30"
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => !isUploading && uploadInputRef.current?.click()}
              >
                {isUploading ? (
                  <>
                    <Loader2 size={36} className="animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                  </>
                ) : uploadSuccess ? (
                  <>
                    <CheckCircle2 size={36} className="text-green-500" />
                    <p className="text-sm text-muted-foreground">Upload complete!</p>
                  </>
                ) : (
                  <>
                    <UploadCloud size={36} className="text-muted-foreground/50" />
                    <div className="text-center px-4">
                      <p className="text-sm font-medium text-foreground">
                        {isDragging ? "Drop to upload" : "Drag & drop an image"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground mt-3 opacity-60">
                        JPG, PNG, WebP, GIF, SVG
                      </p>
                    </div>
                  </>
                )}
              </div>

              <input
                ref={uploadInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelected(file);
                  e.target.value = "";
                }}
              />
            </div>
          </div>

          {/* Oversized file warning */}
          {oversizedFile && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-[inherit]">
              <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-sm mx-6 p-6 space-y-4">
                <div className="flex items-center gap-2 text-amber-500">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <h3 className="font-semibold text-foreground">Image is too large</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{oversizedFile.name}</span> is{" "}
                  <span className="font-medium text-foreground">
                    {(oversizedFile.size / 1024).toFixed(0)} KB
                  </span>{" "}
                  — over the recommended 500 KB for web.
                </p>
                <p className="text-sm text-muted-foreground">
                  Large images slow down page load. Consider compressing it first at{" "}
                  <a
                    href="https://croma.aurora33.live"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    croma.aurora33.live
                  </a>
                  .
                </p>
                <div className="flex gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setOversizedFile(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleUpload(oversizedFile)}
                  >
                    Upload anyway
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-border flex-shrink-0">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!selected}
              onClick={handleSelect}
            >
              Insert image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
