"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AnalyzeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
}

export function AnalyzeDialog({ isOpen, onClose, onSubmit }: AnalyzeDialogProps) {
  const [url, setUrl] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <Card className="w-full max-w-lg mx-4">
        <h2 className="text-lg font-semibold mb-4">Analyze Repository</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Enter a GitHub repository URL or owner/name to analyze.
        </p>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="e.g. https://github.com/fastapi/fastapi or fastapi/fastapi"
          className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4"
        />
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (url.trim()) {
                onSubmit(url.trim());
                setUrl("");
                onClose();
              }
            }}
          >
            Analyze
          </Button>
        </div>
      </Card>
    </div>
  );
}
