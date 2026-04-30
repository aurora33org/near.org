import {
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  List,
  ListOrdered,
  ListChecks,
  Code,
  Quote,
  Minus,
  ImageIcon,
  GalleryHorizontal,
  Video,
  Table,
  Columns2,
  Columns3,
  FileCode,
  Palette,
  Highlighter,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { Editor } from "@tiptap/react";

export interface SlashCommandItem {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
  category: "text" | "lists" | "media" | "advanced" | "callout" | "colors";
  searchTerms: string[];
  command: (editor: Editor, openMediaPicker?: (mode?: "single" | "carousel") => void) => void;
}

export const slashCommandItems: SlashCommandItem[] = [
  // Text
  {
    title: "Heading 2",
    description: "Medium section heading",
    icon: Heading2,
    category: "text",
    searchTerms: ["h2", "heading", "subtitle"],
    command: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    icon: Heading3,
    category: "text",
    searchTerms: ["h3", "heading"],
    command: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    title: "Heading 4",
    description: "Subsection heading",
    icon: Heading4,
    category: "text",
    searchTerms: ["h4", "heading"],
    command: (editor) => editor.chain().focus().toggleHeading({ level: 4 }).run(),
  },
  {
    title: "Heading 5",
    description: "Minor heading",
    icon: Heading5,
    category: "text",
    searchTerms: ["h5", "heading"],
    command: (editor) => editor.chain().focus().toggleHeading({ level: 5 }).run(),
  },
  {
    title: "Quote",
    description: "Capture a quote",
    icon: Quote,
    category: "text",
    searchTerms: ["blockquote", "quote", "cite"],
    command: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    title: "Divider",
    description: "Horizontal separator",
    icon: Minus,
    category: "text",
    searchTerms: ["hr", "divider", "separator", "horizontal", "rule"],
    command: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
  // Lists
  {
    title: "Bullet List",
    description: "Unordered list",
    icon: List,
    category: "lists",
    searchTerms: ["ul", "bullet", "list", "unordered"],
    command: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    title: "Numbered List",
    description: "Ordered list",
    icon: ListOrdered,
    category: "lists",
    searchTerms: ["ol", "numbered", "list", "ordered"],
    command: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    title: "Task List",
    description: "Checklist with checkboxes",
    icon: ListChecks,
    category: "lists",
    searchTerms: ["todo", "task", "checklist", "checkbox"],
    command: (editor) => editor.chain().focus().toggleTaskList().run(),
  },
  // Media
  {
    title: "Image",
    description: "Upload or pick an image",
    icon: ImageIcon,
    category: "media",
    searchTerms: ["image", "photo", "picture", "upload"],
    command: (_editor, openMediaPicker) => {
      openMediaPicker?.("single");
    },
  },
  {
    title: "Carousel",
    description: "Insert a scrollable image carousel",
    icon: GalleryHorizontal,
    category: "media",
    searchTerms: ["carousel", "gallery", "slider", "images"],
    command: (_editor, openMediaPicker) => {
      openMediaPicker?.("carousel");
    },
  },
  {
    title: "Video/Embed",
    description: "YouTube, Vimeo, or other video",
    icon: Video,
    category: "media",
    searchTerms: ["video", "embed", "youtube", "vimeo", "media"],
    command: (editor) =>
      editor.chain().focus().insertContent({ type: "embedBlock", attrs: { url: "" } }).run(),
  },
  {
    title: "Code Block",
    description: "Code with syntax highlighting",
    icon: Code,
    category: "advanced",
    searchTerms: ["code", "codeblock", "snippet", "programming"],
    command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  // Advanced
  {
    title: "Table",
    description: "Insert a table",
    icon: Table,
    category: "advanced",
    searchTerms: ["table", "grid", "spreadsheet"],
    command: (editor) =>
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
  {
    title: "2 Columns",
    description: "Side by side layout",
    icon: Columns2,
    category: "advanced",
    searchTerms: ["columns", "layout", "two", "side"],
    command: (editor) =>
      editor.chain().focus().insertColumnLayout({ columns: 2 }).run(),
  },
  {
    title: "3 Columns",
    description: "Three column layout",
    icon: Columns3,
    category: "advanced",
    searchTerms: ["columns", "layout", "three", "grid"],
    command: (editor) =>
      editor.chain().focus().insertColumnLayout({ columns: 3 }).run(),
  },
  {
    title: "HTML Block",
    description: "Raw HTML content",
    icon: FileCode,
    category: "advanced",
    searchTerms: ["html", "raw", "embed", "code", "custom"],
    command: (editor) => editor.chain().focus().insertRawHtml().run(),
  },
  // Colors — text
  {
    title: "Default Color",
    description: "Remove text color",
    icon: Palette,
    category: "colors",
    searchTerms: ["color", "text", "default", "reset", "remove"],
    command: (editor) => editor.chain().focus().unsetColor().run(),
  },
  {
    title: "Red Text",
    description: "Red text color",
    icon: Palette,
    color: "#ef4444",
    category: "colors",
    searchTerms: ["color", "text", "red"],
    command: (editor) => editor.chain().focus().setColor("#ef4444").run(),
  },
  {
    title: "Blue Text",
    description: "Blue text color",
    icon: Palette,
    color: "#3b82f6",
    category: "colors",
    searchTerms: ["color", "text", "blue"],
    command: (editor) => editor.chain().focus().setColor("#3b82f6").run(),
  },
  {
    title: "Green Text",
    description: "Green text color",
    icon: Palette,
    color: "#22c55e",
    category: "colors",
    searchTerms: ["color", "text", "green"],
    command: (editor) => editor.chain().focus().setColor("#22c55e").run(),
  },
  {
    title: "Purple Text",
    description: "Purple text color",
    icon: Palette,
    color: "#a855f7",
    category: "colors",
    searchTerms: ["color", "text", "purple"],
    command: (editor) => editor.chain().focus().setColor("#a855f7").run(),
  },
  {
    title: "Orange Text",
    description: "Orange text color",
    icon: Palette,
    color: "#f97316",
    category: "colors",
    searchTerms: ["color", "text", "orange"],
    command: (editor) => editor.chain().focus().setColor("#f97316").run(),
  },
  // Colors — background / highlight
  {
    title: "No Highlight",
    description: "Remove background highlight",
    icon: Highlighter,
    category: "colors",
    searchTerms: ["highlight", "background", "remove", "none"],
    command: (editor) => editor.chain().focus().unsetHighlight().run(),
  },
  {
    title: "Yellow Highlight",
    description: "Yellow background",
    icon: Highlighter,
    color: "#fef08a",
    category: "colors",
    searchTerms: ["highlight", "background", "yellow"],
    command: (editor) => editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run(),
  },
  {
    title: "Green Highlight",
    description: "Green background",
    icon: Highlighter,
    color: "#bbf7d0",
    category: "colors",
    searchTerms: ["highlight", "background", "green"],
    command: (editor) => editor.chain().focus().toggleHighlight({ color: "#bbf7d0" }).run(),
  },
  {
    title: "Blue Highlight",
    description: "Blue background",
    icon: Highlighter,
    color: "#bfdbfe",
    category: "colors",
    searchTerms: ["highlight", "background", "blue"],
    command: (editor) => editor.chain().focus().toggleHighlight({ color: "#bfdbfe" }).run(),
  },
  {
    title: "Pink Highlight",
    description: "Pink background",
    icon: Highlighter,
    color: "#fbcfe8",
    category: "colors",
    searchTerms: ["highlight", "background", "pink"],
    command: (editor) => editor.chain().focus().toggleHighlight({ color: "#fbcfe8" }).run(),
  },
  // Callouts
  {
    title: "Info Callout",
    description: "Blue info box",
    icon: AlertCircle,
    category: "callout",
    searchTerms: ["callout", "info", "note", "blue"],
    command: (editor) => editor.chain().focus().insertCallout({ type: "info" }).run(),
  },
  {
    title: "Warning Callout",
    description: "Yellow warning box",
    icon: AlertTriangle,
    category: "callout",
    searchTerms: ["callout", "warning", "yellow"],
    command: (editor) => editor.chain().focus().insertCallout({ type: "warning" }).run(),
  },
  {
    title: "Success Callout",
    description: "Green success box",
    icon: CheckCircle,
    category: "callout",
    searchTerms: ["callout", "success", "green"],
    command: (editor) => editor.chain().focus().insertCallout({ type: "success" }).run(),
  },
  {
    title: "Error Callout",
    description: "Red error box",
    icon: XCircle,
    category: "callout",
    searchTerms: ["callout", "error", "red"],
    command: (editor) => editor.chain().focus().insertCallout({ type: "error" }).run(),
  },
];

const categoryLabels: Record<string, string> = {
  text: "Text",
  lists: "Lists",
  media: "Media",
  advanced: "Advanced",
  callout: "Callout",
  colors: "Colors",
};

export function getGroupedItems(query: string) {
  const filtered = slashCommandItems.filter((item) => {
    const q = query.toLowerCase();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.searchTerms.some((term) => term.includes(q))
    );
  });

  const groups: { label: string; items: SlashCommandItem[] }[] = [];
  const categoryOrder = ["text", "lists", "media", "advanced", "callout", "colors"];

  for (const cat of categoryOrder) {
    const items = filtered.filter((item) => item.category === cat);
    if (items.length > 0) {
      groups.push({ label: categoryLabels[cat], items });
    }
  }

  return groups;
}
