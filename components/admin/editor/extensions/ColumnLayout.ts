import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ColumnLayoutView } from "../node-views/ColumnLayoutView";
import { ColumnView } from "../node-views/ColumnView";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    columnLayout: {
      insertColumnLayout: (attrs: { columns: number }) => ReturnType;
    };
  }
}

export const Column = Node.create({
  name: "column",
  group: "block",
  content: "block+",

  parseHTML() {
    return [{ tag: 'div[data-type="column"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "column" }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ColumnView);
  },
});

export const ColumnLayout = Node.create({
  name: "columnLayout",
  group: "block",
  content: "column+",
  defining: true,

  addAttributes() {
    return {
      columns: { default: 2 },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="column-layout"]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "column-layout",
        "data-columns": node.attrs.columns,
        style: `display:grid;grid-template-columns:repeat(${node.attrs.columns},1fr);gap:1rem`,
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ColumnLayoutView);
  },

  addCommands() {
    return {
      insertColumnLayout:
        ({ columns }) =>
        ({ chain }) => {
          const columnNodes = Array.from({ length: columns }, () => ({
            type: "column",
            content: [{ type: "paragraph" }],
          }));

          return chain()
            .insertContent({
              type: this.name,
              attrs: { columns },
              content: columnNodes,
            })
            .run();
        },
    };
  },
});
