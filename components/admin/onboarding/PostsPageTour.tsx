"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "onboarding_posts_page_seen";

interface TourStep {
  targetSelector: string;
  title: string;
  body: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    targetSelector: '[data-posts-tour-id="new-post"]',
    title: "Create a new post",
    body: "Click here to open the editor and start writing your first blog post.",
  },
  {
    targetSelector: '[data-posts-tour-id="filter-bar"]',
    title: "Search and filter",
    body: "Find posts by title or filter by status: Draft, Published, or Archived.",
  },
  {
    targetSelector: '[data-posts-tour-id="posts-table"]',
    title: "Your posts",
    body: "Each row shows the title, author, status, and creation date. Click Edit to make changes.",
  },
  {
    targetSelector: '[data-posts-tour-id="post-actions"]',
    title: "Post actions",
    body: "Edit, duplicate, or delete individual posts. Select multiple rows to bulk publish, archive, or delete.",
  },
];

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function PostsPageTour() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null);
  const [cardPos, setCardPos] = useState<{ top: number; left: number } | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    setMounted(true);
    const seen = localStorage.getItem(STORAGE_KEY) === "true";
    if (!seen) setShow(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setShow(false);
  };

  const currentStep = TOUR_STEPS[step];

  const updatePositions = () => {
    if (!show || !currentStep) return;

    const target = document.querySelector(currentStep.targetSelector) as HTMLElement | null;
    if (!target) {
      setTimeout(updatePositions, 100);
      return;
    }

    const rect = target.getBoundingClientRect();
    const pad = 5;

    setSpotlightRect({
      top: rect.top - pad,
      left: rect.left - pad,
      width: rect.width + pad * 2,
      height: rect.height + pad * 2,
    });

    const cardWidth = 320;
    const cardHeight = 190;
    const gap = 14;

    let top = rect.bottom + gap;
    let left = rect.left;

    if (top + cardHeight > window.innerHeight) {
      top = rect.top - cardHeight - gap;
    }
    if (left + cardWidth > window.innerWidth) {
      left = window.innerWidth - cardWidth - 16;
    }
    if (left < 16) left = 16;

    setCardPos({ top, left });
  };

  useLayoutEffect(() => {
    if (!show) return;
    updatePositions();

    if (!resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver(updatePositions);
      resizeObserverRef.current.observe(document.documentElement);
    }
  }, [show, step]);

  useEffect(() => {
    return () => resizeObserverRef.current?.disconnect();
  }, []);

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
      else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (step < TOUR_STEPS.length - 1) setStep((s) => s + 1);
        else dismiss();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (step > 0) setStep((s) => s - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, step]);

  if (!mounted || !show || !spotlightRect || !cardPos || !currentStep) return null;

  const isLast = step === TOUR_STEPS.length - 1;

  return (
    <>
      {/* Spotlight */}
      <div
        style={{
          position: "fixed",
          top: spotlightRect.top,
          left: spotlightRect.left,
          width: spotlightRect.width,
          height: spotlightRect.height,
          boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)",
          border: "2px solid var(--primary)",
          borderRadius: "10px",
          pointerEvents: "none",
          zIndex: 61,
          transition: "all 200ms ease",
        }}
      />

      {/* Callout card */}
      <div
        style={{
          position: "fixed",
          top: cardPos.top,
          left: cardPos.left,
          width: 320,
          zIndex: 62,
        }}
        className="bg-card border border-border rounded-xl shadow-xl p-4 space-y-3"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              STEP {step + 1} OF {TOUR_STEPS.length}
            </p>
            <h3 className="font-semibold text-sm mt-1">{currentStep.title}</h3>
          </div>
          <button
            onClick={dismiss}
            className="p-1 rounded hover:bg-muted/50 transition text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground">{currentStep.body}</p>

        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <Button size="sm" className="flex-1" onClick={isLast ? dismiss : () => setStep((s) => s + 1)}>
            {isLast ? "Done" : "Next"}
            {!isLast && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </div>
    </>
  );
}
