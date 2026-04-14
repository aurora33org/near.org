"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EmblaCarousel from "embla-carousel";

interface CarouselImage {
  src: string;
  alt: string;
}

interface BlogCarouselProps {
  images: CarouselImage[];
  slidesPerView?: number;
  aspectRatio?: string;
}

export function BlogCarousel({ images, slidesPerView = 1, aspectRatio = "auto" }: BlogCarouselProps) {
  const emblaRef = useRef<HTMLDivElement>(null);
  const emblaApiRef = useRef<any>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!emblaRef.current) return;

    const emblaApi = EmblaCarousel(emblaRef.current, { loop: true }) as any;
    emblaApiRef.current = emblaApi;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    const onInit = () => setScrollSnaps(emblaApi.scrollSnapList());

    emblaApi.on("init", onInit);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onInit);

    return () => {
      emblaApi.destroy();
    };
  }, []);

  const handlePrev = () => emblaApiRef.current?.scrollPrev();
  const handleNext = () => emblaApiRef.current?.scrollNext();

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="not-prose my-6 w-full">
      <div className="relative bg-muted rounded-lg overflow-hidden">
        {/* Carousel container */}
        <div ref={emblaRef} className="w-full" style={{ overflow: slidesPerView < 2 ? "hidden" : "visible" }}>
          <div className="flex gap-4">
            {images.map((image, i) => (
              <div
                key={i}
                className="min-w-0 flex items-center justify-center bg-transparent"
                style={{
                  flex: `0 0 ${100 / slidesPerView}%`,
                  minHeight: "400px",
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

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 rounded-full bg-black/30 text-white p-2 hover:bg-black/50 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 rounded-full bg-black/30 text-white p-2 hover:bg-black/50 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="flex gap-2 justify-center mt-4">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApiRef.current?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === selectedIndex ? "bg-foreground" : "bg-muted-foreground"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
