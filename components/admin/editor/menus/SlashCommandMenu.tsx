"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import { getGroupedItems, type SlashCommandItem } from "../SlashCommandItems";

interface SlashCommandMenuProps {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
  query: string;
}

export const SlashCommandMenu = forwardRef<any, SlashCommandMenuProps>(
  ({ command, query }, ref) => {
    const groups = getGroupedItems(query);
    const allItems = groups.flatMap((g) => g.items);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const menuRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

    useEffect(() => {
      setSelectedIndex(0);
    }, [query]);

    // Scroll selected item into view
    useLayoutEffect(() => {
      const el = itemRefs.current.get(selectedIndex);
      if (el) {
        el.scrollIntoView({ block: "nearest" });
      }
    }, [selectedIndex]);

    const upHandler = useCallback(() => {
      setSelectedIndex((prev) => (prev + allItems.length - 1) % allItems.length);
    }, [allItems.length]);

    const downHandler = useCallback(() => {
      setSelectedIndex((prev) => (prev + 1) % allItems.length);
    }, [allItems.length]);

    const enterHandler = useCallback(() => {
      const item = allItems[selectedIndex];
      if (item) command(item);
    }, [allItems, selectedIndex, command]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === "ArrowUp") {
          upHandler();
          return true;
        }
        if (event.key === "ArrowDown") {
          downHandler();
          return true;
        }
        if (event.key === "Enter") {
          enterHandler();
          return true;
        }
        return false;
      },
    }));

    if (allItems.length === 0) {
      return (
        <div
          ref={menuRef}
          className="z-50 rounded-lg border border-border bg-accent/10 shadow-lg p-3 text-sm text-foreground/70"
        >
          No results
        </div>
      );
    }

    let flatIndex = 0;

    return (
      <div
        ref={menuRef}
        className="z-50 w-72 max-h-80 overflow-y-auto rounded-lg border border-border bg-background shadow-lg py-1"
      >
        {groups.map((group) => (
          <div key={group.label}>
            <div className="px-3 py-1.5 text-[11px] font-semibold text-foreground/50 uppercase tracking-wider">
              {group.label}
            </div>
            {group.items.map((item) => {
              const index = flatIndex++;
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  ref={(el) => {
                    if (el) itemRefs.current.set(index, el);
                  }}
                  type="button"
                  className={`flex items-center gap-3 w-full px-3 py-2 text-left text-sm transition-colors ${
                    index === selectedIndex
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground/80 hover:bg-accent/30"
                  }`}
                  onClick={() => command(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded border border-border bg-muted shrink-0"
                    style={item.color ? { backgroundColor: item.color, borderColor: "transparent" } : undefined}
                  >
                    <Icon size={16} style={item.color ? { color: "rgba(0,0,0,0.5)" } : undefined} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{item.title}</div>
                    <div className="text-xs text-foreground/60 truncate">
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  }
);

SlashCommandMenu.displayName = "SlashCommandMenu";
