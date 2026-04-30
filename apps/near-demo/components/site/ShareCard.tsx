"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface ShareCardProps {
  url: string;
  title: string;
}

export default function ShareCard({ url, title }: ShareCardProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareOnLinkedIn = () => {
    const encodedUrl = encodeURIComponent(url);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl px-4 py-3 shadow-sm space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        Share
      </p>
      <div className="flex gap-2">
        <button
          onClick={shareOnTwitter}
          className="flex-1 inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 transition"
          title="Share on X (Twitter)"
          aria-label="Share on X"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.207-6.8-5.974 6.8h-3.315l7.71-8.82-8.158-10.68h6.614l4.888 6.336 5.432-6.336zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>
        <button
          onClick={shareOnLinkedIn}
          className="flex-1 inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 transition"
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.8 0-9.714h3.554v1.375c.427-.659 1.191-1.597 2.898-1.597 2.117 0 3.704 1.385 3.704 4.362v5.574zM5.337 9.432c-1.144 0-1.915-.761-1.915-1.713 0-.957.767-1.715 1.964-1.715 1.192 0 1.911.758 1.937 1.715 0 .952-.745 1.713-1.986 1.713zm1.946 11.02H3.38V9.718h3.903v10.734zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
          </svg>
        </button>
        <button
          onClick={copyLink}
          className="flex-1 inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
          title="Copy link"
          aria-label="Copy link"
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-600" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
