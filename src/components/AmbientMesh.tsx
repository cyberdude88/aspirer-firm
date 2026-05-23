"use client";

import { useEffect, useRef } from "react";

/**
 * AmbientMesh
 *
 * Site-wide, viewport-fixed warm ambient mesh background. Five oversized
 * blurred "light pools" in a cream/sand palette drift very slowly across
 * the screen on independent 22–38s loops.
 *
 * Sits at z-index: -1, behind the FloatingBackgroundLogo (z-index: 0).
 *
 * Scroll-velocity coupling
 *   The wrapper translates by a velocity-driven offset on top of each
 *   blob's CSS keyframe drift. Fast scroll → the whole mesh swooshes
 *   along; the offset eases back toward zero when you stop. This gives
 *   the "VFX" feel of fast motion when scrolling fast, while the slow
 *   ambient drift keeps the screen alive when stationary.
 *
 *   Wrapper offset (px) decays toward 0 at ~6% per frame. Per scroll
 *   event we add `delta * REACT` to the target, so a fast wheel gesture
 *   pushes a noticeable shift that then eases out.
 */
export function AmbientMesh() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = wrapRef.current;
    if (!el) return;

    // How strongly a single scroll delta pushes the mesh. Negative so the
    // mesh trails *behind* the scroll direction (you scroll down, mesh
    // lags upward, like parallax).
    const REACT = -0.55;
    // Per-frame decay toward 0. 0.06 = ~16-frame settle.
    const DECAY = 0.06;
    // Cap so a long flick can't translate the mesh off-screen.
    const MAX = 220;

    let targetY = 0;
    let currentY = 0;
    let lastScrollY = window.scrollY;
    let rafId: number | null = null;

    const tick = () => {
      // Ease the wrapper offset back toward 0 every frame.
      targetY *= 1 - DECAY;
      const delta = targetY - currentY;
      if (Math.abs(delta) < 0.08 && Math.abs(targetY) < 0.08) {
        currentY = 0;
        targetY = 0;
        el.style.setProperty("--mesh-y", "0px");
        rafId = null;
        return;
      }
      currentY += delta * 0.18;
      el.style.setProperty("--mesh-y", `${currentY.toFixed(2)}px`);
      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const dY = y - lastScrollY;
      lastScrollY = y;
      // Add this scroll burst to the target offset.
      targetY = Math.max(-MAX, Math.min(MAX, targetY + dY * REACT));
      if (rafId == null) rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={wrapRef} className="ambient-mesh" aria-hidden="true">
      <div className="ambient-mesh__inner">
        <div className="ambient-mesh__blob ambient-mesh__blob--1" />
        <div className="ambient-mesh__blob ambient-mesh__blob--2" />
        <div className="ambient-mesh__blob ambient-mesh__blob--3" />
        <div className="ambient-mesh__blob ambient-mesh__blob--4" />
        <div className="ambient-mesh__blob ambient-mesh__blob--5" />
      </div>
      <div className="ambient-mesh__noise" />
    </div>
  );
}
