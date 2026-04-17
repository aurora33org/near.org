"use client";

import type { Editor } from "@tiptap/react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface TableControlsProps {
  editor: Editor;
}

export default function TableControls({ editor }: TableControlsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (!editor.isActive("table")) {
        setIsVisible(false);
        return;
      }

      try {
        const { from } = editor.state.selection;
        const coords = editor.view.coordsAtPos(from);
        const editorEl = editor.view.dom.closest(".relative");

        if (!editorEl) return;

        const editorRect = editorEl.getBoundingClientRect();
        const top = coords.top - editorRect.top - 48; // 48px = toolbar height + spacing
        const left = Math.max(8, coords.left - editorRect.left);

        setPosition({ top: Math.max(4, top), left });
        setIsVisible(true);
      } catch {
        setIsVisible(false);
      }
    };

    const handleBlur = () => setIsVisible(false);

    editor.on("selectionUpdate", updatePosition);
    editor.on("blur", handleBlur);
    editor.on("focus", updatePosition);

    return () => {
      editor.off("selectionUpdate", updatePosition);
      editor.off("blur", handleBlur);
      editor.off("focus", updatePosition);
    };
  }, [editor]);

  if (!isVisible) return null;

  const btnSize = "sm";

  return (
    <div
      className="absolute z-40 flex gap-1 items-center rounded-lg border border-border bg-card shadow-lg p-2"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        pointerEvents: "auto",
      }}
    >
      {/* Columns */}
      <Button
        size={btnSize}
        variant="outline"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().addColumnBefore().run();
        }}
        title="Add column before (left)"
        className="h-8 px-2"
      >
        <Plus size={14} className="mr-1" />
        Col Before
      </Button>

      <Button
        size={btnSize}
        variant="outline"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().addColumnAfter().run();
        }}
        title="Add column after (right)"
        className="h-8 px-2"
      >
        <Plus size={14} className="mr-1" />
        Col After
      </Button>

      <Button
        size={btnSize}
        variant="outline"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().deleteColumn().run();
        }}
        title="Delete column"
        className="h-8 px-2"
      >
        <Trash2 size={14} className="mr-1" />
        Col Del
      </Button>

      {/* Separator */}
      <div className="w-px h-5 bg-border mx-1" />

      {/* Rows */}
      <Button
        size={btnSize}
        variant="outline"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().addRowBefore().run();
        }}
        title="Add row above"
        className="h-8 px-2"
      >
        <ArrowUp size={14} className="mr-1" />
        Row Above
      </Button>

      <Button
        size={btnSize}
        variant="outline"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().addRowAfter().run();
        }}
        title="Add row below"
        className="h-8 px-2"
      >
        <ArrowDown size={14} className="mr-1" />
        Row Below
      </Button>

      <Button
        size={btnSize}
        variant="outline"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().deleteRow().run();
        }}
        title="Delete row"
        className="h-8 px-2"
      >
        <Trash2 size={14} className="mr-1" />
        Row Del
      </Button>

      {/* Separator */}
      <div className="w-px h-5 bg-border mx-1" />

      {/* Headers */}
      <Button
        size={btnSize}
        variant="outline"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeaderRow().run();
        }}
        title="Toggle header row"
        className="h-8 px-2 text-xs"
      >
        Header Row
      </Button>

      <Button
        size={btnSize}
        variant="outline"
        disabled={!editor.can().toggleHeaderColumn()}
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeaderColumn().run();
        }}
        title="Toggle header column"
        className="h-8 px-2 text-xs"
      >
        Header Col
      </Button>
    </div>
  );
}
