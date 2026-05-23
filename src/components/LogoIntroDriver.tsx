"use client";

/**
 * LogoIntroDriver
 *
 * The wipe + settle animation plays directly on the header LogoMark
 * (gated in CSS by html[data-intro="playing"]). This component's only
 * job is to stamp the right attribute value on <html> at the right time
 * so the existing CSS animations fire. Renders no DOM.
 *
 *   first session  : "armed" → preload → "playing" → "done" (+ data-glow)
 *   replay         : nothing (boot script already wrote "done")
 *   reduced motion : "done" + lock session flag (skip the show)
 */

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STROKES = [
  "/brand/logo-arc.png",
  "/brand/logo-slash-1.png",
  "/brand/logo-slash-2.png",
  "/brand/logo-slash-3.png",
];

// Wipe ends at 1350ms; settle finishes at 1700ms. Done state fires
// right after settle so the landing glow lines up with the finished mark.
const T_WIPE_TOTAL = 1700;

export function LogoIntroDriver() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;

    if (pathname !== "/") {
      root.setAttribute("data-intro", "done");
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.setAttribute("data-intro", "done");
      return;
    }
    // Session-level skip. If the intro already played in this tab, don't
    // replay — replaying briefly hides the floating background trail via
    // the html:not([data-intro="done"]) CSS rule, which restarts every
    // CSS animation from frame 0 when the element reappears. Skipping
    // preserves background continuity across in-app navigation.
    let introSeen = false;
    try {
      introSeen = sessionStorage.getItem("af-intro-seen") === "1";
    } catch {}
    if (introSeen) {
      root.setAttribute("data-intro", "done");
      root.setAttribute("data-glow", "done");
      return;
    }

    let cancelled = false;
    let timer: number | null = null;
    root.setAttribute("data-glow", "idle");

    Promise.all(
      STROKES.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = img.onerror = () => resolve();
            img.src = src;
          }),
      ),
    ).then(() => {
      if (cancelled) return;
      requestAnimationFrame(() => {
        if (cancelled) return;
        root.setAttribute("data-intro", "playing");
        timer = window.setTimeout(() => {
          if (cancelled) return;
          root.setAttribute("data-intro", "done");
          root.setAttribute("data-glow", "done");
          try {
            sessionStorage.setItem("af-intro-seen", "1");
          } catch {}
        }, T_WIPE_TOTAL);
      });
    });

    return () => {
      cancelled = true;
      if (timer != null) window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
