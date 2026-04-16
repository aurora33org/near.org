import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
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
  isolating: true,

  parseHTML() {
    return [{ tag: 'div[data-type="column"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "column" }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ColumnView);
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const { selection } = this.editor.state;
        const { $from, empty } = selection;

        // Only handle simple cursor positions
        if (!empty) return false;

        // Find the depths of column and columnLayout nodes
        let columnDepth = -1;
        let columnLayoutDepth = -1;

        for (let d = $from.depth; d >= 0; d--) {
          const node = $from.node(d);
          if (node.type.name === "column" && columnDepth === -1) {
            columnDepth = d;
          }
          if (node.type.name === "columnLayout" && columnLayoutDepth === -1) {
            columnLayoutDepth = d;
          }
        }

        // If not inside column + columnLayout, let default behavior handle it
        if (columnDepth === -1 || columnLayoutDepth === -1) return false;

        // Check if we're in an empty paragraph that's the last block of the column
        const currentNode = $from.parent;
        const isEmpty = currentNode.type.name === "paragraph" && currentNode.textContent === "";
        const columnNode = $from.node(columnDepth);
        const isLastBlock = $from.index(columnDepth) === columnNode.childCount - 1;

        if (!isEmpty || !isLastBlock) {
          // Not an empty last paragraph — use default behavior
          return false;
        }

        // Exit the column layout: delete the empty paragraph and insert a new paragraph after columnLayout
        const afterColumnLayout = $from.after(columnLayoutDepth);

        // Note: deleteCurrentNode removes 2 positions (node + close tag), so we subtract 2 from afterColumnLayout
        return this.editor
          .chain()
          .deleteCurrentNode()
          .insertContentAt(afterColumnLayout - 2, { type: "paragraph" })
          .focus()
          .run();
      },
    };
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
      widths: {
        default: [],
        parseHTML: (el) => {
          const widths = el.getAttribute("data-widths");
          return widths ? widths.split(",").map(w => parseFloat(w)) : [];
        },
        renderHTML: (attrs) => ({
          "data-widths": attrs.widths?.join(",") || "",
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="column-layout"]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const cols = node.attrs.columns || 2;
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "column-layout",
        "data-columns": cols,
        style: `display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: 1rem; margin: 1rem 0;`,
      }),
      0,
    ];
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
      addColumn:
        () =>
        ({ commands, state }: any) => {
          const { $from } = state.selection;
          let layoutNode = null;

          for (let d = $from.depth; d >= 0; d--) {
            if ($from.node(d).type.name === "columnLayout") {
              layoutNode = $from.node(d);
              break;
            }
          }

          if (!layoutNode) return false;

          const newColumns = (layoutNode.attrs.columns || 2) + 1;
          return commands.updateAttributes("columnLayout", {
            columns: newColumns,
            widths: [...(layoutNode.attrs.widths || []), 1],
          });
        },
      removeColumn:
        () =>
        ({ commands, state }: any) => {
          const { $from } = state.selection;
          let layoutNode = null;

          for (let d = $from.depth; d >= 0; d--) {
            if ($from.node(d).type.name === "columnLayout") {
              layoutNode = $from.node(d);
              break;
            }
          }

          if (!layoutNode || layoutNode.attrs.columns <= 1) return false;

          const newColumns = layoutNode.attrs.columns - 1;
          const widths = layoutNode.attrs.widths || [];
          widths.pop();

          return commands.updateAttributes("columnLayout", {
            columns: newColumns,
            widths,
          });
        },
    };
  },
});
