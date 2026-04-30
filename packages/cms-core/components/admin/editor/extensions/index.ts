import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { common, createLowlight } from "lowlight";
import { SlashCommand } from "./SlashCommand";
import { RawHtmlBlock } from "./RawHtmlBlock";
import { ColumnLayout, Column } from "./ColumnLayout";
import { DragHandle } from "./DragHandle";
import { CarouselNode } from "./CarouselNode";
import { EmbedBlock } from "./EmbedBlock";
import { FindReplace } from "./FindReplace";
import { Callout } from "./Callout";
import { Footnote } from "./Footnote";

const lowlight = createLowlight(common);

export function getExtensions() {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4, 5] },
      codeBlock: false,
      link: false,
      underline: false,
    }),
    Link.configure({ openOnClick: false }),
    CodeBlockLowlight.configure({ lowlight }),
    Image,
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    TaskList,
    TaskItem.configure({ nested: true }),
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === "heading") {
          return `Heading ${node.attrs.level}`;
        }
        return "Type '/' for commands...";
      },
      includeChildren: true,
      showOnlyCurrent: false,
    }),
    Underline,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    TextStyle,
    Color.configure({ types: ["textStyle"] }),
    Highlight.configure({ multicolor: true }),
    SlashCommand,
    RawHtmlBlock,
    ColumnLayout,
    Column,
    CarouselNode,
    EmbedBlock,
    DragHandle,
    FindReplace,
    Callout,
    Footnote,
  ];
}
