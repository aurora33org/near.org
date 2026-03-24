"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useState, useCallback, useEffect, useRef } from "react";
import { GripVertical, Plus } from "lucide-react";
import { getExtensions } from "./extensions";
import EditorBubbleMenu from "./menus/EditorBubbleMenu";
import TableControls from "./menus/TableControls";
import { createSlashCommandSuggestion } from "./menus/SlashCommandRenderer";
import MediaPickerModal from "@/components/admin/MediaPickerModal";

interface BlockEditorProps {
  content: object;
  onChange: (json: object) => void;
}

export default function BlockEditor({ content, onChange }: BlockEditorProps) {
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const mediaPickerCallback = useRef<((url: string) => void) | null>(null);
  const [dragHandlePos, setDragHandlePos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const openMediaPicker = useCallback(() => {
    setIsMediaPickerOpen(true);
  }, []);

  const suggestion = createSlashCommandSuggestion(openMediaPicker);

  const editor = useEditor({
    extensions: getExtensions().map((ext) => {
      if (ext.name === "slashCommand") {
        return ext.configure({ suggestion });
      }
      return ext;
    }),
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  // Drag handle positioning on mouse move
  useEffect(() => {
    const container = editorContainerRef.current;
    if (!container || !editor) return;

    function handleMouseMove(e: MouseEvent) {
      const editorEl = container!.querySelector(".ProseMirror");
      if (!editorEl) return;

      const editorRect = editorEl.getBoundingClientRect();
      const containerRect = container!.getBoundingClientRect();

      // Only show when mouse is near the left edge of the editor
      if (e.clientX > editorRect.left + 50 || e.clientX < containerRect.left) {
        setDragHandlePos(null);
        return;
      }

      // Find the closest block-level node
      const pos = editor!.view.posAtCoords({ left: editorRect.left + 10, top: e.clientY });
      if (!pos) {
        setDragHandlePos(null);
        return;
      }

      const resolvedPos = editor!.state.doc.resolve(pos.pos);
      const node = resolvedPos.node(1); // top-level block
      if (!node) {
        setDragHandlePos(null);
        return;
      }

      // Get the DOM element for this node
      const depth1Pos = resolvedPos.before(1);
      const domNode = editor!.view.nodeDOM(depth1Pos);
      if (!domNode || !(domNode instanceof HTMLElement)) {
        setDragHandlePos(null);
        return;
      }

      const nodeRect = domNode.getBoundingClientRect();
      setDragHandlePos({
        top: nodeRect.top - containerRect.top,
        left: 0,
      });
    }

    function handleMouseLeave() {
      setDragHandlePos(null);
    }

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [editor]);

  if (!editor) {
    return <div className="text-muted-foreground">Loading editor...</div>;
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        Content
      </label>

      <div
        ref={editorContainerRef}
        className="relative border border-border rounded-lg overflow-hidden bg-background"
      >
        {/* Drag Handle */}
        {dragHandlePos && (
          <div
            className="absolute z-10 flex items-center gap-0.5 opacity-0 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
            style={{
              top: dragHandlePos.top,
              left: dragHandlePos.left,
            }}
            contentEditable={false}
          >
            <button
              type="button"
              className="p-0.5 rounded hover:bg-secondary/80 text-muted-foreground/50 hover:text-muted-foreground"
              draggable
              onDragStart={(e) => {
                // ProseMirror handles the actual drag
                e.preventDefault();
              }}
            >
              <GripVertical size={16} />
            </button>
            <button
              type="button"
              className="p-0.5 rounded hover:bg-secondary/80 text-muted-foreground/50 hover:text-muted-foreground"
              title="Add block below"
              onClick={() => {
                // Insert a slash at current position to open command menu
                editor.chain().focus().insertContent("/").run();
              }}
            >
              <Plus size={16} />
            </button>
          </div>
        )}

        {/* Table Controls */}
        <TableControls editor={editor} />

        {/* Bubble Menu */}
        <EditorBubbleMenu editor={editor} />

        {/* Editor Content */}
        <EditorContent
          editor={editor}
          className="prose dark:prose-invert max-w-none p-4 pl-10 focus:outline-none [&_.ProseMirror]:outline-none"
          style={{ minHeight: "60vh" }}
        />
      </div>

      {/* Media Picker */}
      <MediaPickerModal
        open={isMediaPickerOpen}
        onClose={() => {
          setIsMediaPickerOpen(false);
          mediaPickerCallback.current = null;
        }}
        onSelect={(url) => {
          editor?.chain().focus().setImage({ src: url }).run();
          setIsMediaPickerOpen(false);
        }}
      />
    </div>
  );
}
