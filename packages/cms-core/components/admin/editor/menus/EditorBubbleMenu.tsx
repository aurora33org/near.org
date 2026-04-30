"use client";

import type { Editor } from "@tiptap/react";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  LayoutGrid,
} from "lucide-react";
import { SlashCommandMenu } from "./SlashCommandMenu";
import type { SlashCommandItem } from "../SlashCommandItems";

interface EditorBubbleMenuProps {
  editor: Editor;
  openMediaPicker?: (mode?: "single" | "carousel") => void;
}

export default function EditorBubbleMenu({ editor, openMediaPicker }: EditorBubbleMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showAltInput, setShowAltInput] = useState(false);
  const [altText, setAltText] = useState("");
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    const { from, to } = editor.state.selection;

    // Check if we have an image selected
    if (editor.isActive("image")) {
      setIsImageSelected(true);
      setAltText(editor.getAttributes("image").alt || "");
      setShowMenu(true);
      return;
    }
    setIsImageSelected(false);

    if (from === to) {
      setShowMenu(false);
      return;
    }

    if (editor.isActive("codeBlock") || editor.isActive("rawHtmlBlock")) {
      setShowMenu(false);
      return;
    }

    // Get coordinates from ProseMirror
    const start = editor.view.coordsAtPos(from);
    const end = editor.view.coordsAtPos(to);
    const editorEl = editor.view.dom.closest(".relative");
    if (!editorEl) {
      setShowMenu(false);
      return;
    }

    const editorRect = editorEl.getBoundingClientRect();
    const menuWidth = menuRef.current?.offsetWidth ?? 320;

    const centerX = (start.left + end.right) / 2 - editorRect.left;
    const top = start.top - editorRect.top - 48;

    setMenuPos({
      top: Math.max(4, top),
      left: Math.max(8, Math.min(centerX - menuWidth / 2, editorRect.width - menuWidth - 8)),
    });
    setShowMenu(true);
  }, [editor]);

  useEffect(() => {
    const selectionHandler = () => {
      // Small delay to let selection settle
      requestAnimationFrame(updatePosition);
    };

    const blurHandler = () => {
      // Delay hiding to allow clicking buttons
      setTimeout(() => {
        if (!menuRef.current?.contains(document.activeElement)) {
          setShowMenu(false);
          setShowLinkInput(false);
        }
      }, 200);
    };

    editor.on("selectionUpdate", selectionHandler);
    editor.on("blur", blurHandler);

    return () => {
      editor.off("selectionUpdate", selectionHandler);
      editor.off("blur", blurHandler);
    };
  }, [editor, updatePosition]);

  useEffect(() => {
    if (!showCommandPalette) return;
    function onMouseDown(e: MouseEvent) {
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) {
        setShowCommandPalette(false);
        setCommandQuery("");
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [showCommandPalette]);

  const setLink = useCallback(() => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  if (!showMenu) return null;

  const btnClass =
    "p-1.5 rounded hover:bg-secondary/80 transition text-foreground/80 hover:text-foreground";
  const activeClass = "bg-secondary text-foreground";

  return (
    <div
      ref={menuRef}
      className="absolute z-50 animate-in fade-in duration-150"
      style={{ top: menuPos.top, left: menuPos.left }}
    >
      {showCommandPalette && (
        <div
          ref={paletteRef}
          className="absolute bottom-full mb-1 left-0 z-50"
        >
          <div className="rounded-lg border border-border bg-card shadow-lg overflow-hidden w-72">
            <div className="p-2 border-b border-border">
              <input
                type="text"
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                placeholder="Search commands..."
                className="w-full text-sm bg-transparent outline-none text-foreground placeholder-muted-foreground"
                autoFocus
              />
            </div>
            <div className="max-h-72 overflow-y-auto">
              <SlashCommandMenu
                items={[]}
                query={commandQuery}
                command={(item: SlashCommandItem) => {
                  item.command(editor, openMediaPicker);
                  setShowCommandPalette(false);
                  setCommandQuery("");
                }}
              />
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center gap-0.5 rounded-lg border border-border bg-card shadow-lg p-1">
        {showAltInput ? (
          <div className="flex items-center gap-1 px-1">
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editor.chain().focus().updateAttributes("image", { alt: altText }).run();
                  setShowAltInput(false);
                }
                if (e.key === "Escape") {
                  setShowAltInput(false);
                }
              }}
              placeholder="Describe image..."
              className="text-sm bg-transparent border-none outline-none text-foreground placeholder-muted-foreground w-48"
              autoFocus
            />
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().updateAttributes("image", { alt: altText }).run();
                setShowAltInput(false);
              }}
              className="text-xs text-primary font-medium px-2 py-1 hover:bg-secondary rounded"
            >
              Save
            </button>
          </div>
        ) : showLinkInput ? (
          <div className="flex items-center gap-1 px-1">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setLink();
                if (e.key === "Escape") {
                  setShowLinkInput(false);
                  setLinkUrl("");
                }
              }}
              placeholder="Paste link..."
              className="text-sm bg-transparent border-none outline-none text-foreground placeholder-muted-foreground w-48"
              autoFocus
            />
            <button
              type="button"
              onClick={setLink}
              className="text-xs text-primary font-medium px-2 py-1 hover:bg-secondary rounded"
            >
              Apply
            </button>
          </div>
        ) : isImageSelected ? (
          <>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setShowAltInput(true);
              }}
              className={`${btnClass}`}
              title="Edit alt text"
            >
              Edit Alt
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setShowCommandPalette((v) => !v);
                setCommandQuery("");
              }}
              className={`${btnClass} ${showCommandPalette ? activeClass : ""}`}
              title="More options"
            >
              <LayoutGrid size={16} />
            </button>

            <div className="w-px h-5 bg-border mx-0.5" />

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleHeading({ level: 2 }).run();
              }}
              className={`${btnClass} ${editor.isActive("heading", { level: 2 }) ? activeClass : ""}`}
              title="Heading 2"
            >
              <Heading2 size={16} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleHeading({ level: 3 }).run();
              }}
              className={`${btnClass} ${editor.isActive("heading", { level: 3 }) ? activeClass : ""}`}
              title="Heading 3"
            >
              <Heading3 size={16} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleHeading({ level: 4 }).run();
              }}
              className={`${btnClass} ${editor.isActive("heading", { level: 4 }) ? activeClass : ""}`}
              title="Heading 4"
            >
              <Heading4 size={16} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleHeading({ level: 5 }).run();
              }}
              className={`${btnClass} ${editor.isActive("heading", { level: 5 }) ? activeClass : ""}`}
              title="Heading 5"
            >
              <Heading5 size={16} />
            </button>

            <div className="w-px h-5 bg-border mx-0.5" />

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleBold().run();
              }}
              className={`${btnClass} ${editor.isActive("bold") ? activeClass : ""}`}
              title="Bold (Cmd+B)"
            >
              <Bold size={16} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleItalic().run();
              }}
              className={`${btnClass} ${editor.isActive("italic") ? activeClass : ""}`}
              title="Italic (Cmd+I)"
            >
              <Italic size={16} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleUnderline().run();
              }}
              className={`${btnClass} ${editor.isActive("underline") ? activeClass : ""}`}
              title="Underline (Cmd+U)"
            >
              <Underline size={16} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleStrike().run();
              }}
              className={`${btnClass} ${editor.isActive("strike") ? activeClass : ""}`}
              title="Strikethrough"
            >
              <Strikethrough size={16} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleBlockquote().run();
              }}
              className={`${btnClass} ${editor.isActive("blockquote") ? activeClass : ""}`}
              title="Blockquote"
            >
              <Quote size={16} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleCode().run();
              }}
              className={`${btnClass} ${editor.isActive("code") ? activeClass : ""}`}
              title="Inline Code"
            >
              <Code size={16} />
            </button>

            <div className="w-px h-5 bg-border mx-0.5" />

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                if (editor.isActive("link")) {
                  editor.chain().focus().unsetLink().run();
                } else {
                  setLinkUrl(editor.getAttributes("link").href || "");
                  setShowLinkInput(true);
                }
              }}
              className={`${btnClass} ${editor.isActive("link") ? activeClass : ""}`}
              title="Link"
            >
              <LinkIcon size={16} />
            </button>

            <div className="w-px h-5 bg-border mx-0.5" />

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().setTextAlign("left").run();
              }}
              className={`${btnClass} ${editor.isActive({ textAlign: "left" }) ? activeClass : ""}`}
              title="Align Left"
            >
              <AlignLeft size={16} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().setTextAlign("center").run();
              }}
              className={`${btnClass} ${editor.isActive({ textAlign: "center" }) ? activeClass : ""}`}
              title="Align Center"
            >
              <AlignCenter size={16} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().setTextAlign("right").run();
              }}
              className={`${btnClass} ${editor.isActive({ textAlign: "right" }) ? activeClass : ""}`}
              title="Align Right"
            >
              <AlignRight size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
