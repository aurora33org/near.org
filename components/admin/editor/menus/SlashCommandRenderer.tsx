"use client";

import { ReactRenderer } from "@tiptap/react";
import tippy, { type Instance } from "tippy.js";
import { SlashCommandMenu } from "./SlashCommandMenu";
import { slashCommandItems, type SlashCommandItem } from "../SlashCommandItems";

export function createSlashCommandSuggestion(openMediaPicker: () => void) {
  return {
    items: ({ query }: { query: string }) => {
      return slashCommandItems.filter((item) => {
        const q = query.toLowerCase();
        if (!q) return true;
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.searchTerms.some((term) => term.includes(q))
        );
      });
    },

    render: () => {
      let component: ReactRenderer | null = null;
      let popup: Instance[] | null = null;

      return {
        onStart: (props: any) => {
          component = new ReactRenderer(SlashCommandMenu, {
            props: {
              ...props,
              command: (item: SlashCommandItem) => {
                props.command({
                  command: item.command,
                  openMediaPicker,
                });
              },
            },
            editor: props.editor,
          });

          if (!props.clientRect) return;

          popup = tippy("body", {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
            maxWidth: "none",
          });
        },

        onUpdate: (props: any) => {
          component?.updateProps({
            ...props,
            command: (item: SlashCommandItem) => {
              props.command({
                command: item.command,
                openMediaPicker,
              });
            },
          });

          if (popup?.[0] && props.clientRect) {
            popup[0].setProps({ getReferenceClientRect: props.clientRect });
          }
        },

        onKeyDown: (props: any) => {
          if (props.event.key === "Escape") {
            popup?.[0]?.hide();
            return true;
          }
          return (component?.ref as any)?.onKeyDown?.(props) ?? false;
        },

        onExit: () => {
          popup?.[0]?.destroy();
          component?.destroy();
        },
      };
    },
  };
}
