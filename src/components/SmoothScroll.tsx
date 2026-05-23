"use client";

/**
 * SmoothScroll
 *
 * Mounts Lenis once at the layout level. Lenis replaces the browser's
 * native scroll with a virtual lerped position — anything that reads
 * window.scrollY (the floating background trail, reveal scripts, anchor
 * jumps, etc.) automatically gets buttery-smooth values, no per-feature
 * smoothing code required.
 *
 * Notes
 *   - syncTouch: false → native mobile scroll is already physically
 *     perfect (iOS rubber-band, Android friction). Forcing JS smoothing
 *     on touch hurts more than it helps.
 *   - lerp 0.085 lands close to the Linear/Stripe feel. Lower = glassier
 *     glide but more lag on input; higher = snappier but less luxurious.
 *   - Lenis honors prefers-reduced-motion by default (no smoothing).
 */

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.085,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
