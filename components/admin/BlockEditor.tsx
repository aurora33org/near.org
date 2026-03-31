"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import { createLowlight } from "lowlight";
import { useState } from "react";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Link as LinkIcon,
  Minus,
  ImageIcon,
} from "lucide-react";
import MediaPickerModal from "@/components/admin/MediaPickerModal";

interface BlockEditorProps {
  content: object;
  onChange: (json: object) => void;
}

export default function BlockEditor({ content, onChange }: BlockEditorProps) {
  const lowlight = createLowlight();
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Link.configure({
        openOnClick: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Image,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  if (!editor) {
    return <div className="text-muted-foreground">Loading editor...</div>;
  }

  const buttonClass =
    "p-2 rounded border border-border hover:bg-secondary/50 transition disabled:opacity-50 disabled:cursor-not-allowed text-foreground";
  const activeButtonClass = "bg-secondary border-primary/30";

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">Content</label>

      {/* Toolbar */}
      <div className="sticky top-[53px] z-[5] flex flex-wrap gap-1 border border-border rounded-t-lg bg-muted p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`${buttonClass} ${
            editor.isActive("heading", { level: 1 }) ? activeButtonClass : ""
          }`}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${buttonClass} ${
            editor.isActive("heading", { level: 2 }) ? activeButtonClass : ""
          }`}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`${buttonClass} ${
            editor.isActive("heading", { level: 3 }) ? activeButtonClass : ""
          }`}
          title="Heading 3"
        >
          <Heading3 size={18} />
        </button>

        <div className="w-px bg-border" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${buttonClass} ${editor.isActive("bold") ? activeButtonClass : ""}`}
          title="Bold"
        >
          <Bold size={18} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${buttonClass} ${editor.isActive("italic") ? activeButtonClass : ""}`}
          title="Italic"
        >
          <Italic size={18} />
        </button>

        <div className="w-px bg-border" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${buttonClass} ${
            editor.isActive("bulletList") ? activeButtonClass : ""
          }`}
          title="Bullet List"
        >
          <List size={18} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${buttonClass} ${
            editor.isActive("orderedList") ? activeButtonClass : ""
          }`}
          title="Ordered List"
        >
          <ListOrdered size={18} />
        </button>

        <div className="w-px bg-border" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`${buttonClass} ${
            editor.isActive("codeBlock") ? activeButtonClass : ""
          }`}
          title="Code Block"
        >
          <Code size={18} />
        </button>

        <button
          type="button"
          onClick={() => {
            const url = window.prompt("Enter URL:");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`${buttonClass} ${editor.isActive("link") ? activeButtonClass : ""}`}
          title="Link"
        >
          <LinkIcon size={18} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={buttonClass}
          title="Horizontal Rule"
        >
          <Minus size={18} />
        </button>

        <button
          type="button"
          onClick={() => setIsMediaPickerOpen(true)}
          className={buttonClass}
          title="Insert Image"
        >
          <ImageIcon size={18} />
        </button>

        <MediaPickerModal
          open={isMediaPickerOpen}
          onClose={() => setIsMediaPickerOpen(false)}
          onSelect={(url) => editor?.chain().focus().setImage({ src: url }).run()}
        />
      </div>

      {/* Editor */}
      <div className="border border-t-0 border-border rounded-b-lg overflow-hidden bg-background">
        <EditorContent
          editor={editor}
          className="prose dark:prose-invert max-w-none p-4 focus:outline-none"
          style={{
            minHeight: "60vh",
          }}
        />
      </div>
    </div>
  );
}
