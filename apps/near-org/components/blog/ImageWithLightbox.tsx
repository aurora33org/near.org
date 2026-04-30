"use client";

import { useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@near/cms-core/components/ui/dialog";
import { Button } from "@near/cms-core/components/ui/button";

interface ImageWithLightboxProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
}

export function ImageWithLightbox({
  src,
  alt,
  title,
  className = "rounded-lg max-w-full",
}: ImageWithLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));

  return (
    <>
      <img
        src={src}
        alt={alt}
        title={title}
        className={`cursor-pointer transition-opacity hover:opacity-90 ${className}`}
        onClick={() => setIsOpen(true)}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent showCloseButton className="w-full max-h-[90vh] overflow-hidden sm:max-w-4xl p-0 z-[9999]">
          <DialogTitle className="sr-only">Image Lightbox</DialogTitle>
          <div className="flex flex-col gap-4 h-full">
            {/* Image container with zoom */}
            <div className="flex items-center justify-center bg-muted rounded-lg overflow-auto flex-1" style={{ minHeight: "500px" }}>
              <div
                style={{
                  transform: `scale(${zoom})`,
                  transition: "transform 0.2s ease-in-out",
                  transformOrigin: "center",
                }}
              >
                <img src={src} alt={alt} className="max-h-[80vh] max-w-[80vw]" />
              </div>
            </div>

            {/* Zoom controls */}
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
              >
                <ZoomOut className="size-4 mr-2" />
                Zoom Out
              </Button>
              <span className="inline-flex items-center px-3 py-1 bg-muted rounded text-sm font-medium">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
              >
                <ZoomIn className="size-4 mr-2" />
                Zoom In
              </Button>
            </div>

            {/* Caption */}
            {alt && (
              <div className="text-center text-sm text-muted-foreground border-t pt-4">
                {alt}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
