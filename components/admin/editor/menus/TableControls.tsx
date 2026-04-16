"use client";

import type { Editor } from "@tiptap/react";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Merge,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableControlsProps {
  editor: Editor;
}

export default function TableControls({ editor }: TableControlsProps) {
  if (!editor.isActive("table")) return null;

  const iconSize = 16;

  return (
    <div className="bg-primary/5 border-2 border-primary/30 rounded-lg p-4 mb-4 shadow-md">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-sm font-bold text-foreground">📊 Table Controls</h3>
      </div>

      <div className="space-y-3">
        {/* Columns Section */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Columns</p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().addColumnBefore().run();
              }}
              title="Add column before (left)"
            >
              <Plus size={iconSize} className="mr-1" />
              Before
            </Button>
            <Button
              size="sm"
              variant="outline"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().addColumnAfter().run();
              }}
              title="Add column after (right)"
            >
              <Plus size={iconSize} className="mr-1" />
              After
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().deleteColumn().run();
              }}
              title="Delete column"
            >
              <Trash2 size={iconSize} className="mr-1" />
              Delete
            </Button>
          </div>
        </div>

        {/* Rows Section */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Rows</p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().addRowBefore().run();
              }}
              title="Add row above"
            >
              <ArrowUp size={iconSize} className="mr-1" />
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
            >
              <ArrowDown size={iconSize} className="mr-1" />
              Below
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().deleteRow().run();
              }}
              title="Delete row"
            >
              <Trash2 size={iconSize} className="mr-1" />
              Delete
            </Button>
          </div>
        </div>

        {/* Headers Section */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Headers</p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleHeaderRow().run();
              }}
              title="Toggle header row"
            >
              Toggle Row Header
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
            >
              Toggle Column Header
            </Button>
          </div>
        </div>

        {/* Merge/Split Section */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Cells</p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={!editor.can().mergeCells()}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().mergeCells().run();
              }}
              title="Merge selected cells"
            >
              <Merge size={iconSize} className="mr-1" />
              Merge
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!editor.can().splitCell()}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().splitCell().run();
              }}
              title="Split cell"
            >
              <Square size={iconSize} className="mr-1" />
              Split
            </Button>
          </div>
        </div>

        {/* Delete Table */}
        <div className="border-t border-border pt-3">
          <Button
            size="sm"
            variant="destructive"
            className="w-full"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().deleteTable().run();
            }}
            title="Delete entire table"
          >
            <Trash2 size={iconSize} className="mr-2" />
            Delete Entire Table
          </Button>
        </div>
      </div>
    </div>
  );
}
