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
  autosaveLabel?: string;
}

export default function BlockEditor({ content, onChange, autosaveLabel }: BlockEditorProps) {
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const mediaPickerCallback = useRef<((url: string) => void) | null>(null);
  const [wordCount, setWordCount] = useState(0);

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
      const text = editor.getText().trim();
      setWordCount(text ? text.split(/\s+/).length : 0);
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
        <EditorBubbleMenu editor={editor} openMediaPicker={openMediaPicker} />

        {/* Editor Content */}
        <EditorContent
          editor={editor}
          className="prose dark:prose-invert max-w-none p-4 pl-10 focus:outline-none [&_.ProseMirror]:outline-none"
          style={{ minHeight: "60vh" }}
        />
      </div>

      {/* Word count footer */}
      <div className="text-xs text-muted-foreground/60 text-right pr-1">
        {wordCount} {wordCount === 1 ? "word" : "words"} · ~{Math.ceil(wordCount / 200)} min read
      </div>

      {/* Autosave footer */}
      {autosaveLabel && (
        <div className="border-t border-border px-4 py-1.5 text-xs text-muted-foreground font-mono">
          {autosaveLabel}
        </div>
      )}

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
