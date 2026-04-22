"use client";

import { useState, useEffect } from "react";
import { ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorOnboardingBannerProps {
  onDismiss: () => void;
}

const EDITOR_STEPS = [
  {
    title: "Give your post a title",
    body: "Click the large title area above and type your first post's headline.",
    highlightTarget: "data-editor-highlight",
  },
  {
    title: "Write your content",
    body: "Click below the divider to start writing. Type '/' at the start of any line to see block types: headings, images, callouts, and more.",
    highlightTarget: "data-editor-highlight",
  },
  {
    title: "Save or publish",
    body: "Hit 'Save Draft' to save your work, or 'Publish' to make it live. Your work autosaves every 30 seconds.",
    highlightTarget: "data-editor-highlight",
  },
];

export function EditorOnboardingBanner({ onDismiss }: EditorOnboardingBannerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  const step = EDITOR_STEPS[currentStep];
  const isLastStep = currentStep === EDITOR_STEPS.length - 1;

  // Update highlight on step change
  useEffect(() => {
    // Remove highlight from previous element
    if (highlightedElement) {
      highlightedElement.classList.remove("ring-2", "ring-primary/50", "ring-offset-2");
    }

    // Add highlight to new element
    // Map step indices to specific targets
    let selector = "";
    if (currentStep === 0) {
      selector = '[data-editor-highlight="title"]';
    } else if (currentStep === 1) {
      selector = '[data-editor-highlight="editor"]';
    } else if (currentStep === 2) {
      selector = '[data-editor-highlight="actions"]';
    }

    if (selector) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        element.classList.add("ring-2", "ring-primary/50", "ring-offset-2");
        setHighlightedElement(element);
      }
    }
  }, [currentStep, highlightedElement]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (highlightedElement) {
        highlightedElement.classList.remove("ring-2", "ring-primary/50", "ring-offset-2");
      }
    };
  }, []);

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
    <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 flex items-start justify-between gap-4 mb-4">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground font-medium">
            EDITOR GUIDE — STEP {currentStep + 1} OF {EDITOR_STEPS.length}
          </p>
        </div>
        <h3 className="font-semibold text-sm">{step.title}</h3>
        <p className="text-sm text-muted-foreground">{step.body}</p>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button size="sm" onClick={handleNext} className="gap-1">
            {isLastStep ? "Got it" : "Next"}
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <button
        onClick={onDismiss}
        className="p-1.5 rounded hover:bg-muted/50 transition text-muted-foreground hover:text-foreground flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
