"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useState, useCallback, useRef } from "react";
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

  if (!editor) {
    return <div className="text-muted-foreground">Loading editor...</div>;
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        Content
      </label>

      <div className="relative border border-border rounded-lg overflow-hidden bg-background">
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
