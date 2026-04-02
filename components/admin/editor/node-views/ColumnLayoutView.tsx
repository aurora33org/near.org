"use client";

import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { Trash2 } from "lucide-react";

export function ColumnLayoutView({ node, deleteNode }: any) {
  const columns = node.attrs.columns || 2;

  return (
    <NodeViewWrapper className="my-4" data-drag-handle>
      <div className="relative group rounded-lg border border-dashed border-border/60 hover:border-border p-2 transition">
        {/* Controls */}
        <div className="absolute -top-3 right-2 hidden group-hover:flex items-center gap-1 bg-card border border-border rounded px-1.5 py-0.5 shadow-sm z-10">
          <span className="text-[10px] text-muted-foreground font-medium">
            {columns} cols
          </span>
          <button
            type="button"
            onClick={deleteNode}
            className="p-0.5 rounded hover:bg-destructive/20 transition text-muted-foreground hover:text-destructive"
            title="Remove columns"
          >
            <Trash2 size={12} />
          </button>
        </div>

        <NodeViewContent
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: "1rem",
          }}
        />
      </div>
    </NodeViewWrapper>
  );
}
