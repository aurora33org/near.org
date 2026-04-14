"use client";

import { useEffect, useRef } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { ChevronLeft, ChevronRight, Edit2, Trash2 } from "lucide-react";
import EmblaCarousel from "embla-carousel";
import { Button } from "@/components/ui/button";

interface CarouselImage {
  src: string;
  alt: string;
}

const SLIDE_OPTIONS = [1, 1.5, 2, 2.5, 3];
const ASPECT_RATIO_OPTIONS = ["auto", "16:9", "4:3", "1:1", "3:4", "9:16"];

export function CarouselNodeView(props: any) {
  const { node, updateAttributes, deleteNode } = props;
  const emblaRef = useRef<HTMLDivElement>(null);
  const emblaApiRef = useRef<any>(null);

  const images: CarouselImage[] = (() => {
    try {
      return JSON.parse(node.attrs.images || "[]");
    } catch {
      return [];
    }
  })();

  const slidesPerView = node.attrs.slidesPerView ?? 1;
  const aspectRatio = node.attrs.aspectRatio ?? "auto";

  useEffect(() => {
    if (!emblaRef.current || images.length <= 1) return;
    const api = EmblaCarousel(emblaRef.current, { loop: true }) as any;
    emblaApiRef.current = api;
    return () => api.destroy();
  }, [images]);

  const handlePrev = () => emblaApiRef.current?.scrollPrev();
  const handleNext = () => emblaApiRef.current?.scrollNext();

  const handleEdit = () => {
    const event = new CustomEvent("editCarouselNode", {
      detail: {
        updateAttributes,
      },
    });
    document.dispatchEvent(event);
  };

  if (images.length === 0) {
    return (
      <NodeViewWrapper className="bg-muted rounded-lg p-4 my-4 text-center">
        <p className="text-muted-foreground mb-4">Carousel (empty)</p>
        <Button onClick={handleEdit} variant="outline" size="sm">
          <Edit2 className="w-4 h-4 mr-2" />
          Add Images
        </Button>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="my-4">
      <div className="bg-transparent rounded-lg overflow-hidden">
        {/* Carousel */}
        <div ref={emblaRef} className="w-full" style={{ overflow: slidesPerView < 2 ? "hidden" : "visible" }}>
          <div className="flex">
            {images.map((image, i) => (
              <div
                key={i}
                className="min-w-0 flex items-center justify-center bg-transparent pr-4"
                style={{
                  flex: `0 0 ${100 / slidesPerView}%`,
                  minHeight: "300px",
                }}
              >
                {aspectRatio !== "auto" ? (
                  <div
                    className="rounded-lg overflow-hidden"
                    style={{
                      aspectRatio: aspectRatio.replace(":", " / "),
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <img
                      src={image.src}
                      alt={image.alt || `Slide ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <img
                    src={image.src}
                    alt={image.alt || `Slide ${i + 1}`}
                    className="rounded-lg max-h-full max-w-full object-contain"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-2 p-3 bg-background border-t flex-wrap">
          <Button
            onClick={handlePrev}
            variant="ghost"
            size="sm"
            disabled={images.length <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <span>{images.length} image{images.length !== 1 ? "s" : ""}</span>
            <span>•</span>
            <select
              value={slidesPerView}
              onChange={(e) => updateAttributes({ slidesPerView: parseFloat(e.target.value) })}
              className="px-2 py-1 rounded border border-border bg-background text-foreground text-xs font-medium hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {SLIDE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option} per view
                </option>
              ))}
            </select>
            <span>•</span>
            <select
              value={aspectRatio}
              onChange={(e) => updateAttributes({ aspectRatio: e.target.value })}
              className="px-2 py-1 rounded border border-border bg-background text-foreground text-xs font-medium hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {ASPECT_RATIO_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option === "auto" ? "Auto" : option}
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={handleNext}
            variant="ghost"
            size="sm"
            disabled={images.length <= 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          <div className="flex-1" />

          <Button onClick={handleEdit} variant="outline" size="sm">
            <Edit2 className="w-4 h-4" />
          </Button>

          <Button onClick={deleteNode} variant="destructive" size="sm">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
