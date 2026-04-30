"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@cms/components/ui/button";
import { WelcomeModal } from "./WelcomeModal";
import { useOnboarding } from "./useOnboarding";

interface TourStep {
  id: string;
  targetSelector: string;
  title: string;
  body: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "dashboard",
    targetSelector: '[data-tour-id="dashboard"]',
    title: "Dashboard",
    body: "Your command center — see post counts, recent activity, and quick stats.",
  },
  {
    id: "posts",
    targetSelector: '[data-tour-id="posts"]',
    title: "Blog Posts",
    body: "Create, edit, publish, and bulk-manage all your blog posts from here.",
  },
  {
    id: "media",
    targetSelector: '[data-tour-id="media"]',
    title: "Media Library",
    body: "Upload images and files. Any image picker in the CMS pulls from this library.",
  },
  {
    id: "categories",
    targetSelector: '[data-tour-id="categories"]',
    title: "Categories & Tags",
    body: "Organise your content. Assign categories and tags when writing posts.",
  },
  {
    id: "settings",
    targetSelector: '[data-tour-id="settings"]',
    title: "Settings",
    body: "Update your profile, change your password, or restart this tour any time.",
  },
];

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function AdminTour({ userName }: { userName: string }) {
  const onboarding = useOnboarding();
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null);
  const [cardPosition, setCardPosition] = useState<{ top: number; left: number } | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const currentStep = TOUR_STEPS[onboarding.tourStep];

  // Recalculate spotlight and card positions
  const updatePositions = () => {
    if (!onboarding.showTour || !currentStep) return;

    const target = document.querySelector(currentStep.targetSelector);
    if (!target) {
      // Retry if target not found (hydration timing)
      setTimeout(updatePositions, 100);
      return;
    }

    const rect = (target as HTMLElement).getBoundingClientRect();
    const padding = 4;

    const newSpotlightRect: SpotlightRect = {
      top: rect.top - padding,
      left: rect.left - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
    };

    setSpotlightRect(newSpotlightRect);

    // Position card below or to the right
    const cardWidth = 320;
    const cardHeight = 200;
    const gapFromSpotlight = 16;

    let top = rect.bottom + gapFromSpotlight;
    let left = rect.left;

    // If card would go off-screen vertically, place above instead
    if (top + cardHeight > window.innerHeight) {
      top = rect.top - cardHeight - gapFromSpotlight;
    }

    // If card would go off-screen horizontally, adjust
    if (left + cardWidth > window.innerWidth) {
      left = window.innerWidth - cardWidth - 16;
    }

    setCardPosition({ top, left });
  };

  // Update positions on step change and window resize
  useLayoutEffect(() => {
    updatePositions();

    if (!resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver(updatePositions);
      resizeObserverRef.current.observe(window.document.documentElement);
    }

    return () => {
      // Keep the observer alive for the lifetime of the component
    };
  }, [onboarding.showTour, onboarding.tourStep, currentStep]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!onboarding.showTour || onboarding.showWelcome) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onboarding.skipTour();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (onboarding.tourStep < TOUR_STEPS.length - 1) {
          onboarding.advanceTour();
        } else {
          onboarding.skipTour();
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (onboarding.tourStep > 0) {
          onboarding.goToStep(onboarding.tourStep - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onboarding]);

  const handleNext = () => {
    if (onboarding.tourStep < TOUR_STEPS.length - 1) {
      onboarding.advanceTour();
    } else {
      onboarding.skipTour();
    }
  };

  const handlePrev = () => {
    if (onboarding.tourStep > 0) {
      onboarding.goToStep(onboarding.tourStep - 1);
    }
  };

  const isLastStep = onboarding.tourStep === TOUR_STEPS.length - 1;

  return (
    <>
      <WelcomeModal
        userName={userName}
        open={onboarding.showWelcome}
        onTakeTour={onboarding.dismissWelcome}
        onSkip={() => {
          onboarding.dismissWelcome();
          onboarding.skipTour();
        }}
      />

      {onboarding.showTour && spotlightRect && cardPosition && currentStep && (
        <>
          {/* Spotlight highlight */}
          <div
            style={{
              position: "fixed",
              top: spotlightRect.top,
              left: spotlightRect.left,
              width: spotlightRect.width,
              height: spotlightRect.height,
              boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.65)",
              border: "2px solid var(--primary)",
              borderRadius: "12px",
              pointerEvents: "none",
              zIndex: 61,
              transition: "all 200ms ease",
            }}
          />

          {/* Callout card */}
          <div
            style={{
              position: "fixed",
              top: cardPosition.top,
              left: cardPosition.left,
              width: 320,
              zIndex: 62,
            }}
            className="bg-card border border-border rounded-xl shadow-xl p-4 space-y-3"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  STEP {onboarding.tourStep + 1} OF {TOUR_STEPS.length}
                </p>
                <h3 className="font-semibold text-sm mt-1">{currentStep.title}</h3>
              </div>
              <button
                onClick={onboarding.skipTour}
                className="p-1 rounded hover:bg-muted/50 transition text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <p className="text-sm text-muted-foreground">{currentStep.body}</p>

            {/* Footer */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={onboarding.tourStep === 0}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <Button size="sm" onClick={handleNext} className="flex-1">
                {isLastStep ? "Finish" : "Next"}
                {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
