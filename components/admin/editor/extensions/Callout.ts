import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { CalloutView } from "../node-views/CalloutView";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: {
      insertCallout: (attrs: { type: "info" | "warning" | "success" | "error" }) => ReturnType;
      setCalloutType: (type: "info" | "warning" | "success" | "error") => ReturnType;
    };
  }
}

export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      type: {
        default: "info",
        parseHTML: (el) => el.getAttribute("data-type") || "info",
        renderHTML: (attrs) => ({
          "data-type": attrs.type,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="callout"]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const calloutType = node.attrs.type || "info";
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "callout",
        "data-callout-type": calloutType,
        class: `callout callout-${calloutType}`,
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutView);
  },

  addCommands() {
    return {
      insertCallout:
        ({ type = "info" }) =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: this.name,
              attrs: { type },
              content: [{ type: "paragraph" }],
            })
            .run();
        },

      setCalloutType:
        (type) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { type });
        },
    };
  },
});
