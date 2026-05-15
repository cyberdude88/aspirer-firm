"use client";

/**
 * FloatingBackgroundLogo
 *
 * Site-wide, viewport-fixed ghost of the brand mark. Two animations are
 * doing different jobs:
 *
 *   1. CSS keyframes — slow ambient drift + breathe (no JS).
 *   2. JS rAF lerp   — translates the mark by a small negative fraction
 *      of window.scrollY, smoothed with a lerp so it visibly LAGS behind
 *      actual scroll. That lag is the "drag" feeling: when you scroll
 *      fast the logo trails; when you stop, it eases into place.
 *
 * The lerp loop only runs while there's still a difference between target
 * and current — when settled, it stops. So no idle 60 fps cost.
 *
 * Props map to CSS custom properties so you can tune per-instance without
 * touching keyframes or the JS:
 *   --fb-opacity --fb-blur --fb-scale --fb-duration
 *
 * Sits at z-index: -1 in the body, alongside the existing decorative
 * background layers. pointer-events: none, aria-hidden — purely visual.
 */

import Image from "next/image";
import { useEffect, useRef } from "react";

type FloatingBackgroundLogoProps = {
  /** 0–1. Background logo should stay visible without overwhelming content. */
  opacity?: number;
  /** Pixel blur on the logo image. 8–12 gives depth without smear. */
  blur?: number;
  /** Base scale multiplier (the breathe animation adds ±~3% on top). */
  scale?: number;
  /** Seconds per ambient loop. 22–30 keeps the motion subliminal. */
  duration?: number;
  /**
   * How much the logo lags behind scroll. 0 = no parallax, 0.05 = 5% of
   * scrollY in upward translation (subtle). The drag *feel* comes from
   * the smoothing factor below, not this number.
   */
  parallax?: number;
  /** Mark asset path. */
  src?: string;
  className?: string;
};

export function FloatingBackgroundLogo({
  opacity = 0.18,
  blur = 1.6,
  scale = 1.512,
  duration = 32,
  parallax = 0.057,
  src = "/logowhite.png",
  className,
}: FloatingBackgroundLogoProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = rootRef.current;
    if (!el) return;

    let targetY = 0;
    let currentY = 0;
    let rafId: number | null = null;

    // Smoothing constant: lower = more drag (logo lags more).
    // 0.08 feels "luxurious"; 0.18 feels "responsive but still soft".
    const SMOOTHING = 0.08;

    const tick = () => {
      const delta = targetY - currentY;
      if (Math.abs(delta) < 0.05) {
        // Settled — stop the loop, save battery / main-thread time.
        currentY = targetY;
        el.style.setProperty("--fb-scroll-y", `${currentY.toFixed(2)}px`);
        rafId = null;
        return;
      }
      currentY += delta * SMOOTHING;
      el.style.setProperty("--fb-scroll-y", `${currentY.toFixed(2)}px`);
      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      // Negative so the mark drifts UP as you scroll down — standard
      // parallax convention. Small factor keeps the motion "ever so slight".
      targetY = -window.scrollY * parallax;
      if (rafId == null) rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [parallax]);

  const style = {
    "--fb-opacity": opacity,
    "--fb-blur": `${blur}px`,
    "--fb-scale": scale,
    "--fb-duration": `${duration}s`,
  } as React.CSSProperties;

  return (
    <div
      ref={rootRef}
      className={`floating-bg${className ? ` ${className}` : ""}`}
      style={style}
      aria-hidden="true"
    >
      <div className="floating-bg__mark">
        <Image
          src={src}
          alt=""
          width={1536}
          height={1024}
          priority={false}
          unoptimized
          draggable={false}
        />
      </div>
      <div className="floating-bg__vignette" />
    </div>
  );
}
