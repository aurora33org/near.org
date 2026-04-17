import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    footnote: {
      setFootnote: (id: string) => ReturnType;
      unsetFootnote: () => ReturnType;
    };
  }
}

export const Footnote = Mark.create({
  name: "footnote",

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (el) => el.getAttribute("data-footnote-id"),
        renderHTML: (attrs) => ({
          "data-footnote-id": attrs.id,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'sup[data-footnote-id]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["sup", mergeAttributes(HTMLAttributes, { class: "footnote-marker" }), 0];
  },

  addCommands() {
    return {
      setFootnote:
        (id) =>
        ({ commands }) => {
          return commands.setMark(this.name, { id });
        },

      unsetFootnote: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Shift-f": ({ editor }) => {
        // Generate a unique footnote ID
        const footnoteId = `fn-${Date.now()}`;
        return editor.chain().focus().setFootnote(footnoteId).run();
      },
    };
  },
});
