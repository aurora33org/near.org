"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const SLIDE_OPTIONS = [1, 1.5, 2, 2.5, 3];

interface SlideCountPickerDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (slidesPerView: number) => void;
}

export function SlideCountPickerDialog({ open, onClose, onConfirm }: SlideCountPickerDialogProps) {
  const [selected, setSelected] = useState<number>(1);

  const handleConfirm = () => {
    onConfirm(selected);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>How many slides to show at once?</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-5 gap-3 py-4">
          {SLIDE_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => setSelected(option)}
              className={`p-4 rounded-lg border-2 transition flex flex-col items-center justify-center gap-2 ${
                selected === option
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {/* Visual representation */}
              <div className="flex gap-1 w-full justify-center">
                {[...Array(Math.ceil(option))].map((_, i) => {
                  const isPartial = i === Math.floor(option) && option % 1 !== 0;
                  return (
                    <div
                      key={i}
                      className={`h-8 rounded-sm transition ${
                        selected === option ? "bg-primary" : "bg-muted-foreground/50"
                      }`}
                      style={{
                        flex: isPartial ? `0 0 ${(option % 1) * 100}%` : "1",
                      }}
                    />
                  );
                })}
              </div>

              {/* Label */}
              <span className="text-sm font-semibold text-foreground">
                {option}
              </span>
              <span className="text-xs text-muted-foreground">
                {option === 1 ? "slide" : "slides"}
              </span>
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Insert carousel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
