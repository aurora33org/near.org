"use client";

import { NodeViewWrapper } from "@tiptap/react";
import { useState } from "react";
import { Trash2, Link as LinkIcon } from "lucide-react";
import { Button } from "@cms/components/ui/button";

const ALLOWED_DOMAINS = [
  "youtube.com",
  "youtu.be",
  "vimeo.com",
  "dailymotion.com",
  "twitch.tv",
];

function extractEmbedUrl(url: string): string | null {
  try {
    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("youtu.be")
        ? url.split("youtu.be/")[1]?.split("?")[0]
        : url.split("v=")[1]?.split("&")[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    // Vimeo
    if (url.includes("vimeo.com")) {
      const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }
    // Generic embed
    return url;
  } catch {
    return null;
  }
}

function isValidEmbedUrl(url: string): boolean {
  try {
    new URL(url);
    return ALLOWED_DOMAINS.some((domain) =>
      url.toLowerCase().includes(domain)
    );
  } catch {
    return false;
  }
}

export function EmbedBlockView({
  node,
  updateAttributes,
  deleteNode,
}: any) {
  const [isEditing, setIsEditing] = useState(!node.attrs.url);
  const [inputUrl, setInputUrl] = useState(node.attrs.url || "");
  const embedUrl = node.attrs.url ? extractEmbedUrl(node.attrs.url) : null;

  const handleSave = () => {
    if (isValidEmbedUrl(inputUrl)) {
      updateAttributes({ url: inputUrl });
      setIsEditing(false);
    } else {
      alert(
        "Invalid URL. Please use YouTube, Vimeo, Dailymotion, or Twitch links."
      );
    }
  };

  return (
    <NodeViewWrapper className="my-4">
      <div className="rounded-lg border border-border overflow-hidden bg-muted/30">
        {isEditing ? (
          <div className="p-4 space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Video/Embed URL
            </label>
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") setIsEditing(false);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Supported: YouTube, Vimeo, Dailymotion, Twitch
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>
                Embed
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : embedUrl ? (
          <div className="space-y-2">
            <div className="aspect-video bg-black rounded-t-lg overflow-hidden">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
            <div className="flex gap-2 p-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                <LinkIcon className="w-4 h-4 mr-1" />
                Change URL
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={deleteNode}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </NodeViewWrapper>
  );
}
