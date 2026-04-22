"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorOnboardingBannerProps {
  onDismiss: () => void;
}

const EDITOR_STEPS = [
  {
    title: "Dale un título a tu post",
    body: "Haz click en el área grande de arriba y escribe el headline de tu primer post.",
    highlightTarget: "title",
  },
  {
    title: "El menú `/` — tu herramienta principal",
    body: "Escribe `/` al inicio de cualquier línea para ver el menú de bloques. Ahí encontrarás headings, imágenes, listas, callouts, tablas, código y más.",
    highlightTarget: "editor",
    showSlashHint: true,
  },
  {
    title: "Selecciona texto para formatearlo",
    body: "Haz doble click en una palabra o selecciona un fragmento. Aparecerá una barra flotante donde puedes poner negrita, itálica, links, colores y cambiar el tipo de bloque.",
    highlightTarget: "editor",
  },
  {
    title: "Arrastra para reordenar bloques",
    body: "Pasa el cursor por el lado izquierdo de cualquier bloque para ver el handle (⋮⋮). Arrástralo para reorganizar. El botón `+` al lado inserta un bloque debajo.",
    highlightTarget: "editor",
  },
  {
    title: "Guarda tu trabajo",
    body: "Usa `Cmd+S` para guardar rápido. El CMS guarda automáticamente cada 30 segundos. Cuando estés listo, publica tu post.",
    highlightTarget: "actions",
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

    // Add highlight to new element based on highlightTarget
    let selector = "";
    if (step.highlightTarget === "title") {
      selector = '[data-editor-highlight="title"]';
    } else if (step.highlightTarget === "editor") {
      selector = '[data-editor-highlight="editor"]';
    } else if (step.highlightTarget === "actions") {
      selector = '[data-editor-highlight="actions"]';
    }

    if (selector) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        element.classList.add("ring-2", "ring-primary/50", "ring-offset-2");
        setHighlightedElement(element);
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
            <p className="text-xs text-muted-foreground w-full">Ejemplos:</p>
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
            Atrás
          </Button>
          <Button size="sm" onClick={handleNext} className="gap-1">
            {isLastStep ? "Listo" : "Siguiente"}
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
