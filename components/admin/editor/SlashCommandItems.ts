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
  Table,
  Columns2,
  Columns3,
  FileCode,
  type LucideIcon,
} from "lucide-react";
import type { Editor } from "@tiptap/react";

export interface SlashCommandItem {
  title: string;
  description: string;
  icon: LucideIcon;
  category: "text" | "lists" | "media" | "advanced";
  searchTerms: string[];
  command: (editor: Editor, openMediaPicker?: () => void) => void;
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
      openMediaPicker?.();
    },
  },
  {
    title: "Code Block",
    description: "Code with syntax highlighting",
    icon: Code,
    category: "media",
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
];

const categoryLabels: Record<string, string> = {
  text: "Text",
  lists: "Lists",
  media: "Media",
  advanced: "Advanced",
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
  const categoryOrder = ["text", "lists", "media", "advanced"];

  for (const cat of categoryOrder) {
    const items = filtered.filter((item) => item.category === cat);
    if (items.length > 0) {
      groups.push({ label: categoryLabels[cat], items });
    }
  }

  return groups;
}
