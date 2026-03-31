"use client";

import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";

export function ColumnView() {
  return (
    <NodeViewWrapper data-type="column">
      <NodeViewContent />
    </NodeViewWrapper>
  );
}
