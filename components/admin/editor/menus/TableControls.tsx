"use client";

import type { Editor } from "@tiptap/react";
import {
  Minus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface TableControlsProps {
  editor: Editor;
}

export default function TableControls({ editor }: TableControlsProps) {
  if (!editor.isActive("table")) return null;

  const btnClass =
    "p-1 rounded hover:bg-secondary/80 transition text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none";

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-border bg-card shadow-sm p-1 mb-2">
      <span className="text-[10px] text-muted-foreground font-medium px-1.5">Table</span>
      <div className="w-px h-4 bg-border mx-0.5" />

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().addColumnBefore().run();
        }}
        className={btnClass}
        title="Add column before"
      >
        <ArrowLeft size={14} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().addColumnAfter().run();
        }}
        className={btnClass}
        title="Add column after"
      >
        <ArrowRight size={14} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().deleteColumn().run();
        }}
        className={btnClass}
        title="Delete column"
      >
        <Minus size={14} />
      </button>

      <div className="w-px h-4 bg-border mx-0.5" />

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().addRowBefore().run();
        }}
        className={btnClass}
        title="Add row above"
      >
        <ArrowUp size={14} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().addRowAfter().run();
        }}
        className={btnClass}
        title="Add row below"
      >
        <ArrowDown size={14} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().deleteRow().run();
        }}
        className={btnClass}
        title="Delete row"
      >
        <Minus size={14} />
      </button>

      <div className="w-px h-4 bg-border mx-0.5" />

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeaderRow().run();
        }}
        className={`${btnClass} text-xs font-medium`}
        title="Toggle header row"
      >
        H
      </button>

      <div className="w-px h-4 bg-border mx-0.5" />

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().deleteTable().run();
        }}
        className="p-1 rounded hover:bg-destructive/20 transition text-muted-foreground hover:text-destructive"
        title="Delete table"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
