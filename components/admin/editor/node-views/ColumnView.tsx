"use client";

import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";

export function ColumnView() {
  return (
    <NodeViewWrapper className="min-h-12 rounded border border-dashed border-transparent hover:border-border focus-within:border-primary transition-colors p-1">
      <NodeViewContent />
    </NodeViewWrapper>
  );
}
