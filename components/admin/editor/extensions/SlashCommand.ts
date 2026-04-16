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
          // Only allow slash at start of line or after whitespace
          const before = range.from - 1;
          if (before < 0) return true; // At the very start
          const charBefore = state.doc.textBetween(before, range.from);
          return charBefore === " " || charBefore === "\n";
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
