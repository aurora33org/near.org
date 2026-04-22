"use client";

import { useState, useEffect } from "react";

export function useOnboarding() {
  // Welcome modal
  const [showWelcome, setShowWelcome] = useState(false);

  // Platform tour
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Editor guide
  const [showEditorGuide, setShowEditorGuide] = useState(false);

  // Hydrate from localStorage after mount (SSR-safe)
  useEffect(() => {
    const welcomeSeen = localStorage.getItem("onboarding_welcome_seen") === "true";
    const tourSeen = localStorage.getItem("onboarding_admin_tour_seen") === "true";
    const savedStep = parseInt(localStorage.getItem("onboarding_admin_tour_step") ?? "0");
    const editorSeen = localStorage.getItem("onboarding_editor_seen") === "true";

    setShowWelcome(!welcomeSeen);
    // Tour shows only if welcome was already dismissed in a previous session
    setShowTour(welcomeSeen && !tourSeen);
    setTourStep(savedStep);
    setShowEditorGuide(!editorSeen);
  }, []);

  const dismissWelcome = () => {
    localStorage.setItem("onboarding_welcome_seen", "true");
    setShowWelcome(false);
    // Auto-start tour after welcome is dismissed
    const tourSeen = localStorage.getItem("onboarding_admin_tour_seen") === "true";
    if (!tourSeen) {
      setShowTour(true);
    }
  };

  const advanceTour = () => {
    const nextStep = tourStep + 1;
    setTourStep(nextStep);
    localStorage.setItem("onboarding_admin_tour_step", String(nextStep));
  };

  const skipTour = () => {
    localStorage.setItem("onboarding_admin_tour_seen", "true");
    setShowTour(false);
  };

  const goToStep = (step: number) => {
    setTourStep(step);
    localStorage.setItem("onboarding_admin_tour_step", String(step));
  };

  const dismissEditorGuide = () => {
    localStorage.setItem("onboarding_editor_seen", "true");
    setShowEditorGuide(false);
  };

  const restartTour = () => {
    localStorage.removeItem("onboarding_welcome_seen");
    localStorage.removeItem("onboarding_admin_tour_seen");
    localStorage.removeItem("onboarding_admin_tour_step");
    localStorage.removeItem("onboarding_editor_seen");
    localStorage.removeItem("onboarding_posts_page_seen");

    setShowWelcome(true);
    setShowTour(false);
    setTourStep(0);
    setShowEditorGuide(true);
  };

  return {
    showWelcome,
    dismissWelcome,
    showTour,
    tourStep,
    goToStep,
    advanceTour,
    skipTour,
    restartTour,
    showEditorGuide,
    dismissEditorGuide,
  };
}
