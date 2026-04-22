"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorOnboardingBannerProps {
  onDismiss: () => void;
}

const EDITOR_STEPS = [
  {
    title: "Title is required",
    body: "Click the large title area and write a headline for your post. Without a title, you won't be able to save or publish.",
    highlightTarget: "title",
  },
  {
    title: "The `/` menu — your main tool",
    body: "Type `/` at the start of any line to see the blocks menu. You'll find headings, images, lists, callouts, tables, code, and more.",
    highlightTarget: "editor",
    showSlashHint: true,
  },
  {
    title: "Select text to format it",
    body: "Double-click any word or select a fragment. A floating toolbar will appear where you can add bold, italic, links, colors, and change the block type.",
    highlightTarget: "editor",
  },
  {
    title: "Drag to reorder blocks",
    body: "Hover over the left side of any block to see the handle (⋮⋮). Drag it to reorganize. The `+` button inserts a new block below.",
    highlightTarget: "editor",
  },
  {
    title: "Featured Image",
    body: "This image appears at the top when people see your blog posts. It's also used on social media. It's the first visual people see before clicking.",
    highlightTarget: "featured",
    tab: "post",
  },
  {
    title: "Categories and Tags",
    body: "Tags and categories help organize your content. Visitors can filter posts by these labels. They're optional but recommended for better navigation.",
    highlightTarget: "categories",
    tab: "post",
  },
  {
    title: "SEO: Excerpt",
    body: "The excerpt is the short description shown below the title in Google, social media, and post listings. Max 160 characters so it doesn't get cut off.",
    highlightTarget: "seo",
    tab: "seo",
  },
  {
    title: "SEO: Title and Meta Description",
    body: "The 'SEO Title' is what appears in Google (max 60 chars). 'Meta Description' is the text below (max 160 chars). If you don't fill them, we use your post title and excerpt.",
    highlightTarget: "seo-fields",
    tab: "seo",
  },
  {
    title: "Advanced Settings",
    body: "Configure the hero background (header background), custom post URL, publish date for scheduling, and the Open Graph image for social media.",
    highlightTarget: "settings",
    tab: "settings",
  },
  {
    title: "Save your work",
    body: "Use `Cmd+S` to save quickly. The CMS auto-saves every 30 seconds. When you're ready, publish your post.",
    highlightTarget: "actions",
  },
];

interface EditorOnboardingStep {
  title: string;
  body: string;
  highlightTarget: string;
  showSlashHint?: boolean;
  tab?: "post" | "seo" | "settings";
}

interface EditorOnboardingBannerProps {
  onDismiss: () => void;
  onTabChange?: (tab: "post" | "seo" | "settings") => void;
}

export function EditorOnboardingBanner({ onDismiss, onTabChange }: EditorOnboardingBannerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  const step = EDITOR_STEPS[currentStep] as EditorOnboardingStep;
  const isLastStep = currentStep === EDITOR_STEPS.length - 1;

  // Change tab if step requires it
  useEffect(() => {
    if (step.tab && onTabChange) {
      onTabChange(step.tab);
    }
  }, [currentStep, step, onTabChange]);

  // Update highlight on step change
  useEffect(() => {
    // Remove highlight from previous element
    if (highlightedElement) {
      highlightedElement.classList.remove("ring-2", "ring-primary/50", "ring-offset-2");
    }

    // Add highlight to new element based on highlightTarget
    let selector = "";
    if (step.highlightTarget === "title") {
      selector = '[data-editor-highlight="title"]';
    } else if (step.highlightTarget === "editor") {
      selector = '[data-editor-highlight="editor"]';
    } else if (step.highlightTarget === "featured") {
      selector = '[data-editor-highlight="featured"]';
    } else if (step.highlightTarget === "categories") {
      selector = '[data-editor-highlight="categories"]';
    } else if (step.highlightTarget === "seo") {
      selector = '[data-editor-highlight="seo"]';
    } else if (step.highlightTarget === "seo-fields") {
      selector = '[data-editor-highlight="seo-fields"]';
    } else if (step.highlightTarget === "settings") {
      selector = '[data-editor-highlight="settings"]';
    } else if (step.highlightTarget === "actions") {
      selector = '[data-editor-highlight="actions"]';
    }

    if (selector) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        element.classList.add("ring-2", "ring-primary/50", "ring-offset-2");
        setHighlightedElement(element);
        // Scroll into view if needed
        element.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [currentStep, step, highlightedElement]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (highlightedElement) {
        highlightedElement.classList.remove("ring-2", "ring-primary/50", "ring-offset-2");
      }
    };
  }, [highlightedElement]);

  const handleNext = () => {
    if (isLastStep) {
      onDismiss();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-4 flex items-start justify-between gap-4 mb-4 space-y-3">
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-medium">
            EDITOR GUIDE — STEP {currentStep + 1} OF {EDITOR_STEPS.length}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-sm">{step.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{step.body}</p>
        </div>

        {/* Slash command hint */}
        {step.showSlashHint && (
          <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-primary/20">
            <p className="text-xs text-muted-foreground w-full">Examples:</p>
            <div className="flex gap-2 flex-wrap">
              {[
                { cmd: "/ heading", icon: "H1" },
                { cmd: "/ image", icon: "🖼" },
                { cmd: "/ callout", icon: "💡" },
                { cmd: "/ table", icon: "📊" },
              ].map((item) => (
                <span
                  key={item.cmd}
                  className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-mono"
                >
                  {item.icon} {item.cmd}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <Button size="sm" onClick={handleNext} className="gap-1">
            {isLastStep ? "Done" : "Next"}
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <button
        onClick={onDismiss}
        className="p-1.5 rounded hover:bg-muted/50 transition text-muted-foreground hover:text-foreground flex-shrink-0 mt-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
