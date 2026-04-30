"use client";

import { NodeViewWrapper } from "@tiptap/react";
import { useState } from "react";
import { Code, Eye, EyeOff, Trash2 } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";

export function RawHtmlBlockView({ node, updateAttributes, deleteNode }: any) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <NodeViewWrapper className="my-4" data-drag-handle>
      <div className="rounded-lg border border-border overflow-hidden bg-muted/30">
        {/* Warning Banner */}
        <div className="px-3 py-2 bg-yellow-500/10 border-b border-yellow-500/30 text-xs text-yellow-700 dark:text-yellow-400">
          ⚠️ Inline <code className="bg-yellow-500/20 px-1 rounded">style</code> attributes and form elements will be removed for security.
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-muted border-b border-border">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Code size={14} />
            <span>HTML Block</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="p-1 rounded hover:bg-secondary/80 transition text-muted-foreground hover:text-foreground"
              title={showPreview ? "Show code" : "Show preview"}
            >
              {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <button
              type="button"
              onClick={deleteNode}
              className="p-1 rounded hover:bg-destructive/20 transition text-muted-foreground hover:text-destructive"
              title="Remove block"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {showPreview ? (
          <div
            className="p-4 prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(node.attrs.content ?? "", {
                FORBID_TAGS: ["form", "input", "button", "select", "textarea", "base", "meta"],
                FORBID_ATTR: ["style"],
              }),
            }}
          />
        ) : (
          <textarea
            value={node.attrs.content}
            onChange={(e) => updateAttributes({ content: e.target.value })}
            className="w-full p-4 bg-transparent text-sm font-mono text-foreground resize-y focus:outline-none min-h-[120px]"
            placeholder="<div>Your HTML here...</div>"
            spellCheck={false}
          />
        )}
      </div>
    </NodeViewWrapper>
  );
}
