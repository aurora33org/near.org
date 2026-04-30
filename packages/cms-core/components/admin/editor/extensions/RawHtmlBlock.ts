import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { RawHtmlBlockView } from "../node-views/RawHtmlBlockView";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    rawHtmlBlock: {
      insertRawHtml: () => ReturnType;
    };
  }
}

export const RawHtmlBlock = Node.create({
  name: "rawHtmlBlock",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      content: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="raw-html"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "raw-html" }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(RawHtmlBlockView);
  },

  addCommands() {
    return {
      insertRawHtml:
        () =>
        ({ chain }) => {
          return chain()
            .insertContent({ type: this.name, attrs: { content: "" } })
            .run();
        },
    };
  },
});
