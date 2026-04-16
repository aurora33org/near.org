import { Extension } from "@tiptap/core";
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion";

export const SlashCommand = Extension.create({
  name: "slashCommand",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        startOfLine: false,
        allow: ({ state, range }: any) => {
          // Block slash in the middle of words (like "1/2") but allow at word boundaries
          const $before = state.doc.resolve(range.from);
          const textBefore = $before.parent.textContent.slice(Math.max(0, $before.parentOffset - 1), $before.parentOffset);

          // Allow if: start of document, after space, after newline, or after opening bracket
          if (!textBefore) return true; // At start
          return /[\s\[\(]/.test(textBefore);
        },
        command: ({ editor, range, props }: any) => {
          editor.chain().focus().deleteRange(range).run();
          props.command(editor, props.openMediaPicker);
        },
      } as Partial<SuggestionOptions>,
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
