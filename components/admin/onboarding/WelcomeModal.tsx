"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WelcomeModalProps {
  userName: string;
  open: boolean;
  onTakeTour: () => void;
  onSkip: () => void;
}

export function WelcomeModal({ userName, open, onTakeTour, onSkip }: WelcomeModalProps) {
  const firstName = userName.split(" ")[0];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onSkip()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to NEAR CMS, {firstName}! 👋</DialogTitle>
          <DialogDescription>
            Let me give you a quick tour of everything you need to know to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            This tour will walk you through the dashboard, blog posts, media library, categories, and settings.
            It takes about 2 minutes.
          </p>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onSkip}>
            Skip for now
          </Button>
          <Button onClick={onTakeTour}>
            Take the tour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
