"use client";

import type { Editor } from "@tiptap/react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface TableControlsProps {
  editor: Editor;
}

const MAX_COLUMNS = 8;

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
        const toolbarHeight = 44;
        const toolbarWidth = 600;

        // Position: 12px above the cursor instead of 56px
        let top = coords.top - editorRect.top - toolbarHeight - 12;
        let left = coords.left - editorRect.left;

        // If toolbar would go above the editor, place it below the cursor instead
        if (top < 0) {
          top = coords.bottom - editorRect.top + 8;
        }

        // Clamp horizontal position to prevent overflow
        const maxLeft = editorRect.width - toolbarWidth - 16;
        if (left > maxLeft) {
          left = maxLeft;
        }
        left = Math.max(4, left);

        setPosition({ top: Math.max(4, top), left });
        setIsVisible(true);

        // Count columns in the table by checking the first row
        try {
          let colCount = 0;
          editor.state.doc.descendants((node) => {
            // Count cells in the first row we find
            if (node.type.name === "tableRow" && colCount === 0) {
              colCount = node.childCount;
            }
          });
          setColumnCount(colCount);
        } catch {
          setColumnCount(0);
        }
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
      className="absolute z-40 flex gap-2 items-center rounded-lg border-2 border-primary/40 bg-card shadow-xl p-3 flex-wrap max-w-2xl backdrop-blur-sm"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        pointerEvents: "auto",
        maxWidth: "620px",
        background: "rgba(var(--card-rgb), 0.95)",
      }}
    >
      {/* Columns */}
      <Button
        size="sm"
        variant="outline"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().addColumnBefore().run();
        }}
        title="Add column before (left)"
        className="h-8 px-2.5 text-xs whitespace-nowrap font-medium"
      >
        <Plus size={14} className="mr-1" />
        Before
      </Button>

      <Button
        size="sm"
        variant="outline"
        disabled={columnCount >= MAX_COLUMNS}
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().addColumnAfter().run();
        }}
        title={columnCount >= MAX_COLUMNS ? `Maximum ${MAX_COLUMNS} columns reached` : "Add column after (right)"}
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
      <div className="w-px h-6 bg-border/60" />

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
      <div className="w-px h-6 bg-border/60" />

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
