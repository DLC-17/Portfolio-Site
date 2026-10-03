"use client";

import React from "react";
import { useSeasonal } from "@/components/ui/seasonal-provider";
import { EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContentShell({ children }: { children: React.ReactNode }) {
  const { backgroundOnly, setBackgroundOnly } = useSeasonal();

  return (
    <>
      <div
        className={cn(
          "flex min-h-svh flex-col transition-opacity duration-500",
          backgroundOnly ? "opacity-0 pointer-events-none select-none" : "opacity-100"
        )}
      >
        {children}
      </div>

      {backgroundOnly && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in-95 duration-300">
          <button
            type="button"
            onClick={() => setBackgroundOnly(false)}
            className="flex items-center gap-2.5 rounded-full border border-border/80 bg-card/90 px-5 py-2.5 text-xs font-semibold text-foreground shadow-2xl backdrop-blur-md transition-all hover:bg-card hover:scale-105 active:scale-95"
          >
            <EyeOff className="size-4 text-primary animate-pulse" />
            <span>
              Restore UI <span className="text-muted-foreground font-normal">(or press Esc)</span>
            </span>
          </button>
        </div>
      )}
    </>
  );
}
