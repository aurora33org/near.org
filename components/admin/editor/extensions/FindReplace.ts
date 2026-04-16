import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

export const FindReplace = Extension.create({
  name: "findReplace",

  addStorage() {
    return {
      searchTerm: "",
      replaceTerm: "",
      caseSensitive: false,
      matchIndex: 0,
      matches: [] as Array<{ from: number; to: number }>,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("findReplace"),
        state: {
          init: () => ({
            searchTerm: "",
            decorationSet: DecorationSet.empty,
            matches: [] as Array<{ from: number; to: number }>,
            matchIndex: 0,
          }),
          apply(tr, value, _oldState, newState) {
            const meta = tr.getMeta("findReplace");

            if (meta?.searchTerm !== undefined) {
              const searchTerm = meta.searchTerm;
              const caseSensitive = meta.caseSensitive ?? false;

              try {
                new RegExp(searchTerm, caseSensitive ? "g" : "gi");
              } catch {
                return {
                  searchTerm,
                  decorationSet: DecorationSet.empty,
                  matches: [],
                  matchIndex: 0,
                };
              }

              // Find all text positions
              const nodeMatches: Array<{ from: number; to: number }> = [];

              newState.doc.descendants((node, nodeStart) => {
                if (node.isText) {
                  const text = node.text || "";
                  let localMatch;
                  const localRegex = new RegExp(searchTerm, caseSensitive ? "g" : "gi");

                  while ((localMatch = localRegex.exec(text)) !== null) {
                    nodeMatches.push({
                      from: nodeStart + localMatch.index,
                      to: nodeStart + localMatch.index + localMatch[0].length,
                    });
                  }
                }
              });

              const decorations = nodeMatches.map((match, idx) =>
                Decoration.inline(
                  match.from,
                  match.to,
                  {
                    class: idx === meta.matchIndex ? "find-match-active" : "find-match",
                  }
                )
              );

              return {
                searchTerm,
                decorationSet: DecorationSet.create(newState.doc, decorations),
                matches: nodeMatches,
                matchIndex: meta.matchIndex ?? 0,
              };
            }

            if (meta?.clearSearch) {
              return {
                searchTerm: "",
                decorationSet: DecorationSet.empty,
                matches: [],
                matchIndex: 0,
              };
            }

            if (meta?.findNext) {
              const nextIndex = (value.matchIndex + 1) % value.matches.length;
              const decorations = value.matches.map((match, idx) =>
                Decoration.inline(
                  match.from,
                  match.to,
                  {
                    class: idx === nextIndex ? "find-match-active" : "find-match",
                  }
                )
              );
              return {
                ...value,
                decorationSet: DecorationSet.create(newState.doc, decorations),
                matchIndex: nextIndex,
              };
            }

            if (meta?.findPrev) {
              const prevIndex = (value.matchIndex - 1 + value.matches.length) % value.matches.length;
              const decorations = value.matches.map((match, idx) =>
                Decoration.inline(
                  match.from,
                  match.to,
                  {
                    class: idx === prevIndex ? "find-match-active" : "find-match",
                  }
                )
              );
              return {
                ...value,
                decorationSet: DecorationSet.create(newState.doc, decorations),
                matchIndex: prevIndex,
              };
            }

            return value;
          },
        },
        props: {
          decorations(state) {
            return this.getState(state)?.decorationSet ?? DecorationSet.empty;
          },
        },
      }),
    ];
  },

  addCommands() {
    return {} as any;
  },

  addKeyboardShortcuts() {
    return {
      "Mod-f": ({ editor }) => {
        editor.view.dispatch(
          editor.state.tr.setMeta("findReplace", { showDialog: true })
        );
        return true;
      },
    };
  },
});
