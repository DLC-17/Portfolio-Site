"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { SeasonalContextValue, SeasonalEventConfig } from "@/lib/seasonal/types";
import { resolveActiveEvent } from "@/lib/seasonal/resolver";

const STORAGE_KEY = "portfolio-seasonal-enabled";

const SeasonalContext = createContext<SeasonalContextValue>({
  enabled: true,
  toggleEnabled: () => {},
  activeEvent: null,
  isOverridden: false,
  backgroundOnly: false,
  setBackgroundOnly: () => {},
  toggleBackgroundOnly: () => {},
});

export function SeasonalProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState<boolean>(true);
  const [activeEvent, setActiveEvent] = useState<SeasonalEventConfig | null>(null);
  const [isOverridden, setIsOverridden] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [backgroundOnly, setBackgroundOnly] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    // Read stored user preference (defaults to true if unset)
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setEnabled(stored === "true");
      }
    } catch {
      // Ignore localStorage errors (e.g. private mode)
    }

    // Resolve active event from URL override or calendar date
    const { event, isOverridden: overridden } = resolveActiveEvent();
    setActiveEvent(event);
    setIsOverridden(overridden);
  }, []);

  // Sync data-season attribute on root <html>
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    if (enabled && activeEvent) {
      root.setAttribute("data-season", activeEvent.id);
    } else {
      root.removeAttribute("data-season");
    }

    return () => {
      root.removeAttribute("data-season");
    };
  }, [mounted, enabled, activeEvent]);

  // Escape key exits background-only view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && backgroundOnly) {
        setBackgroundOnly(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [backgroundOnly]);

  const toggleEnabled = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // Ignore localStorage error
      }
      return next;
    });
  }, []);

  const toggleBackgroundOnly = useCallback(() => {
    setBackgroundOnly((prev) => !prev);
  }, []);

  const value = useMemo<SeasonalContextValue>(
    () => ({
      enabled,
      toggleEnabled,
      activeEvent: enabled ? activeEvent : null,
      isOverridden,
      backgroundOnly,
      setBackgroundOnly,
      toggleBackgroundOnly,
    }),
    [enabled, toggleEnabled, activeEvent, isOverridden, backgroundOnly, toggleBackgroundOnly]
  );

  return <SeasonalContext.Provider value={value}>{children}</SeasonalContext.Provider>;
}

export function useSeasonal() {
  return useContext(SeasonalContext);
}
