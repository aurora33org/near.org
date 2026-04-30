"use client";

import { Editor } from "@tiptap/react";
import { ChevronUp, ChevronDown, X, RotateCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@cms/components/ui/button";

interface FindReplaceBarProps {
  editor: Editor;
  onClose: () => void;
}

export function FindReplaceBar({ editor, onClose }: FindReplaceBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [showReplace, setShowReplace] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      const tr = editor.state.tr;
      tr.setMeta("findReplace", { searchTerm: term, caseSensitive, matchIndex: 0 });
      editor.view.dispatch(tr);
    } else {
      const tr = editor.state.tr;
      tr.setMeta("findReplace", { clearSearch: true });
      editor.view.dispatch(tr);
    }
  };

  const handleFindNext = () => {
    const tr = editor.state.tr;
    tr.setMeta("findReplace", { findNext: true });
    editor.view.dispatch(tr);
  };

  const handleFindPrev = () => {
    const tr = editor.state.tr;
    tr.setMeta("findReplace", { findPrev: true });
    editor.view.dispatch(tr);
  };

  const handleReplace = () => {
    const tr = editor.state.tr;
    tr.setMeta("findReplace", { replace: replaceTerm });
    editor.view.dispatch(tr);
    handleFindNext();
  };

  const handleReplaceAll = () => {
    const tr = editor.state.tr;
    tr.setMeta("findReplace", { replaceAll: replaceTerm });
    editor.view.dispatch(tr);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 rounded-lg border border-border bg-card shadow-lg p-4 space-y-3">
      {/* Find Input */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Find</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search..."
            className="flex-1 px-3 py-2 text-sm border border-border rounded bg-background text-foreground"
            autoFocus
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleFindPrev}
            title="Previous match"
          >
            <ChevronUp size={16} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleFindNext}
            title="Next match"
          >
            <ChevronDown size={16} />
          </Button>
        </div>
      </div>

      {/* Case Sensitive Toggle */}
      <label className="flex items-center gap-2 text-xs cursor-pointer">
        <input
          type="checkbox"
          checked={caseSensitive}
          onChange={(e) => {
            setCaseSensitive(e.target.checked);
            handleSearch(searchTerm);
          }}
          className="rounded"
        />
        <span className="text-muted-foreground">Match case</span>
      </label>

      {/* Replace Section */}
      <button
        onClick={() => setShowReplace(!showReplace)}
        className="text-xs font-medium text-primary hover:underline"
      >
        {showReplace ? "Hide Replace" : "Show Replace"}
      </button>

      {showReplace && (
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Replace with</label>
            <input
              type="text"
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
              placeholder="Replace..."
              className="w-full px-3 py-2 text-sm border border-border rounded bg-background text-foreground"
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleReplace}
              className="flex-1"
            >
              Replace
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={handleReplaceAll}
              className="flex-1"
            >
              <RotateCw size={14} className="mr-1" />
              All
            </Button>
          </div>
        </div>
      )}

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 hover:bg-secondary/80 rounded transition"
        title="Close (Esc)"
      >
        <X size={18} />
      </button>
    </div>
  );
}
