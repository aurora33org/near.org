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

  useEffect(() => {
    if (!emblaRef.current || images.length <= 1) return;
    const api = EmblaCarousel(emblaRef.current, { loop: true }) as any;
    emblaApiRef.current = api;
    return () => api.destroy();
  }, [images]);

  const handlePrev = () => emblaApiRef.current?.scrollPrev();
  const handleNext = () => emblaApiRef.current?.scrollNext();

  const handleEdit = () => {
    // Dispatch event to open media picker in carousel mode
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
      <div className="bg-muted rounded-lg overflow-hidden">
        {/* Carousel */}
        <div ref={emblaRef} className="w-full overflow-hidden">
          <div className="flex">
            {images.map((image, i) => (
              <div
                key={i}
                className="flex-[0_0_100%] min-w-0 flex items-center justify-center bg-background"
                style={{ minHeight: "300px" }}
              >
                <img
                  src={image.src}
                  alt={image.alt || `Slide ${i + 1}`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-2 p-3 bg-background border-t">
          <Button
            onClick={handlePrev}
            variant="ghost"
            size="sm"
            disabled={images.length <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <span className="text-xs text-muted-foreground">
            {images.length} image{images.length !== 1 ? "s" : ""}
          </span>

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
