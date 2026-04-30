"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { ChevronLeft, ChevronRight, Edit2, Trash2 } from "lucide-react";
import EmblaCarousel from "embla-carousel";
import { Button } from "@cms/components/ui/button";

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
  const [isEditingAlt, setIsEditingAlt] = useState(false);

  const images: CarouselImage[] = useMemo(() => {
    try {
      return JSON.parse(node.attrs.images || "[]");
    } catch {
      return [];
    }
  }, [node.attrs.images]);

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
    setIsEditingAlt(true);
  };

  const handleAltUpdate = (index: number, newAlt: string) => {
    const updated = [...images];
    updated[index].alt = newAlt;
    updateAttributes({ images: JSON.stringify(updated) });
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

        {/* Alt text editing section */}
        {isEditingAlt && (
          <div className="border-t p-4 bg-muted/50">
            <div className="text-sm font-medium mb-3">Edit Alt Text</div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {images.map((image, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-xs text-muted-foreground pt-2 min-w-fit">Slide {i + 1}:</span>
                  <input
                    type="text"
                    value={image.alt}
                    onChange={(e) => handleAltUpdate(i, e.target.value)}
                    placeholder="Describe image..."
                    className="flex-1 px-2 py-1 border rounded text-sm bg-background"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditingAlt(false)}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
