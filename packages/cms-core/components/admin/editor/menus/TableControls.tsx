"use client";

import type { Editor } from "@tiptap/react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@cms/components/ui/button";

interface TableControlsProps {
  editor: Editor;
}

export default function TableControls({ editor }: TableControlsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [columnCount, setColumnCount] = useState(0);

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
        const toolbarHeight = 48;
        const toolbarWidth = 600; // approximate toolbar width

        // Get current table and count columns
        const table = editor.state.selection.$anchor.node(-2);
        let cols = 0;
        if (table && table.type.name === "table") {
          const firstRow = table.firstChild;
          if (firstRow) {
            cols = firstRow.childCount;
          }
        }
        setColumnCount(cols);

        // Always position above the table for better UX
        let top = coords.top - editorRect.top - toolbarHeight - 56;
        let left = coords.left - editorRect.left;

        // Clamp horizontal position to prevent overflow
        const maxLeft = editorRect.width - toolbarWidth - 16;
        if (left > maxLeft) {
          left = maxLeft;
        }
        left = Math.max(4, left);

        setPosition({ top, left });
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

  return (
    <div
      className="absolute z-40 flex gap-1 items-center rounded-lg border border-border bg-card shadow-lg p-2 flex-wrap max-w-2xl"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        pointerEvents: "auto",
        maxWidth: "600px",
      }}
    >
      {/* Columns */}
      <Button
        size="sm"
        variant="outline"
        disabled={columnCount >= 8}
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().addColumnBefore().run();
        }}
        title={columnCount >= 8 ? "Maximum 8 columns reached" : "Add column before (left)"}
        className="h-8 px-2 text-xs whitespace-nowrap"
      >
        <Plus size={14} className="mr-1" />
        Before
      </Button>

      <Button
        size="sm"
        variant="outline"
        disabled={columnCount >= 8}
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().addColumnAfter().run();
        }}
        title={columnCount >= 8 ? "Maximum 8 columns reached" : "Add column after (right)"}
        className="h-8 px-2 text-xs whitespace-nowrap"
      >
        <Plus size={14} className="mr-1" />
        After
      </Button>

      <Button
        size="sm"
        variant="outline"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().deleteColumn().run();
        }}
        title="Delete column"
        className="h-8 px-2 text-xs whitespace-nowrap"
      >
        <Trash2 size={14} className="mr-1" />
        Col
      </Button>

      {/* Separator */}
      <div className="w-px h-5 bg-border mx-1" />

      {/* Rows */}
      <Button
        size="sm"
        variant="outline"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().addRowBefore().run();
        }}
        title="Add row above"
        className="h-8 px-2 text-xs whitespace-nowrap"
      >
        <ArrowUp size={14} className="mr-1" />
        Above
      </Button>

      <Button
        size="sm"
        variant="outline"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().addRowAfter().run();
        }}
        title="Add row below"
        className="h-8 px-2 text-xs whitespace-nowrap"
      >
        <ArrowDown size={14} className="mr-1" />
        Below
      </Button>

      <Button
        size="sm"
        variant="outline"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().deleteRow().run();
        }}
        title="Delete row"
        className="h-8 px-2 text-xs whitespace-nowrap"
      >
        <Trash2 size={14} className="mr-1" />
        Row
      </Button>

      {/* Separator */}
      <div className="w-px h-5 bg-border mx-1" />

      {/* Headers */}
      <Button
        size="sm"
        variant="outline"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeaderRow().run();
        }}
        title="Toggle header row"
        className="h-8 px-2 text-xs whitespace-nowrap"
      >
        Row Header
      </Button>

      <Button
        size="sm"
        variant="outline"
        disabled={!editor.can().toggleHeaderColumn()}
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeaderColumn().run();
        }}
        title="Toggle header column"
        className="h-8 px-2 text-xs whitespace-nowrap"
      >
        Col Header
      </Button>
    </div>
  );
}
