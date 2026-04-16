"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useState, useCallback, useMemo } from "react";
import { Undo2, Redo2 } from "lucide-react";
import { getExtensions } from "./extensions";
import EditorBubbleMenu from "./menus/EditorBubbleMenu";
import TableControls from "./menus/TableControls";
import { createSlashCommandSuggestion } from "./menus/SlashCommandRenderer";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import { SlideCountPickerDialog } from "./SlideCountPickerDialog";
import { Button } from "@/components/ui/button";

interface BlockEditorProps {
  content: object;
  onChange: (json: object) => void;
  autosaveLabel?: string;
}

export default function BlockEditor({ content, onChange, autosaveLabel }: BlockEditorProps) {
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaPickerMode, setMediaPickerMode] = useState<"single" | "carousel">("single");
  const [isSlideCountPickerOpen, setIsSlideCountPickerOpen] = useState(false);
  const [pendingCarouselImages, setPendingCarouselImages] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState(0);

  const openMediaPicker = useCallback((mode: "single" | "carousel" = "single") => {
    setMediaPickerMode(mode);
    setIsMediaPickerOpen(true);
  }, []);

  const suggestion = useMemo(
    () => createSlashCommandSuggestion(openMediaPicker),
    [openMediaPicker]
  );

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
        {/* Undo/Redo Controls */}
        <div className="flex gap-1 border-b border-border px-2 py-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Cmd+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Cmd+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>

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
        multiSelect={mediaPickerMode === "carousel"}
        onClose={() => {
          setIsMediaPickerOpen(false);
        }}
        onSelect={(urlOrUrls) => {
          if (mediaPickerMode === "carousel") {
            const urls = Array.isArray(urlOrUrls) ? urlOrUrls : [urlOrUrls];
            setPendingCarouselImages(urls);
            setIsSlideCountPickerOpen(true);
          } else {
            const url = Array.isArray(urlOrUrls) ? urlOrUrls[0] : urlOrUrls;
            editor?.chain().focus().setImage({ src: url }).run();
          }
          setIsMediaPickerOpen(false);
        }}
      />

      {/* Slide Count Picker */}
      <SlideCountPickerDialog
        open={isSlideCountPickerOpen}
        onClose={() => {
          setIsSlideCountPickerOpen(false);
          setPendingCarouselImages([]);
        }}
        onConfirm={(slidesPerView) => {
          const images = pendingCarouselImages.map((src) => ({ src, alt: "" }));
          editor?.chain().focus().insertContent({
            type: "carousel",
            attrs: {
              images: JSON.stringify(images),
              slidesPerView,
            },
          }).run();
          setIsSlideCountPickerOpen(false);
          setPendingCarouselImages([]);
        }}
      />
    </div>
  );
}
