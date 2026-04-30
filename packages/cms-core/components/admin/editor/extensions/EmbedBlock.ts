import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { EmbedBlockView } from "../node-views/EmbedBlockView";

export const EmbedBlock = Node.create({
  name: "embedBlock",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      url: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-url") || "",
        renderHTML: (attributes) => ({
          "data-url": attributes.url,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="embed-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { "data-type": "embed-block", ...HTMLAttributes }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(EmbedBlockView);
  },
});
