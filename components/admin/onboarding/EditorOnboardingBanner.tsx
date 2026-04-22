"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorOnboardingBannerProps {
  onDismiss: () => void;
}

const EDITOR_STEPS = [
  {
    title: "El título es obligatorio",
    body: "Haz click en el área grande y escribe un headline para tu post. Sin título no podrás guardar ni publicar.",
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
    title: "Featured Image",
    body: "Esta imagen aparece en la portada del blog cuando la gente ve el listado de posts. También se usa en redes sociales. Es el primer elemento visual que la gente ve antes de hacer click.",
    highlightTarget: "featured",
    tab: "post",
  },
  {
    title: "Categorías y Tags",
    body: "Los tags y categorías ayudan a organizar tu contenido. Los visitantes pueden filtrar posts por estas etiquetas. Son opcionales pero recomendados para mejor navegabilidad.",
    highlightTarget: "categories",
    tab: "post",
  },
  {
    title: "SEO: Excerpt (resumen)",
    body: "El excerpt es la descripción corta que aparece debajo del título en Google, redes sociales y en el listado de posts. Máximo 160 caracteres para que no se corte.",
    highlightTarget: "seo",
    tab: "seo",
  },
  {
    title: "SEO: Título y descripción",
    body: "El 'SEO Title' es lo que aparece en Google (máx. 60 caracteres). La 'Meta description' es el texto debajo (máx. 160 caracteres). Si no completas, usamos el título y excerpt del post.",
    highlightTarget: "seo-fields",
    tab: "seo",
  },
  {
    title: "Settings avanzados",
    body: "Aquí configuras el Hero background (fondo del header), la URL personalizada del post, la fecha de publicación para programar posts, y la imagen para Open Graph en redes.",
    highlightTarget: "settings",
    tab: "settings",
  },
  {
    title: "Guarda tu trabajo",
    body: "Usa `Cmd+S` para guardar rápido. El CMS guarda automáticamente cada 30 segundos. Cuando estés listo, publica tu post.",
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
