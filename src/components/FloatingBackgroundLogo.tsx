"use client";

/**
 * FloatingBackgroundLogo
 *
 * Site-wide, viewport-fixed ghost of the brand mark, rendered as a 7-copy
 * motion trail — the lead copy at full opacity, each trailing copy fainter
 * than the last, all on the same closed-loop drift path so the whole stack
 * appears to move in one continuous direction.
 *
 * Three layers of motion:
 *   1. Closed-loop CSS keyframe (fb-drift) — slow ambient orbit.
 *   2. Per-copy animation-delay stagger — distributes copies along the
 *      orbit so they form a trail behind the lead.
 *   3. JS rAF lerp on --fb-scroll-y — translates the whole stack by a
 *      small negative fraction of scrollY; the lerp causes it to LAG
 *      visibly behind actual scroll (the "drag" feel).
 *
 * Props map to CSS custom properties / inline styles so you can tune per
 * instance without touching keyframes or JS:
 *   opacity (lead)  blur  scale  duration  parallax  trailCount  trailSpread
 *
 * Sits at z-index: 0 in the body, in front of the ambient mesh (-1) and
 * the stage backdrop (-2). pointer-events: none, aria-hidden — purely visual.
 */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type FloatingBackgroundLogoProps = {
  /** Opacity of the lead (brightest) copy. Trail copies fade from here. */
  opacity?: number;
  /** Pixel blur on each copy. 8–12 gives depth without smear. */
  blur?: number;
  /** Base scale multiplier (breathe adds ±~3% on top). */
  scale?: number;
  /** Seconds per ambient loop. 22–30 keeps the motion subliminal. */
  duration?: number;
  /**
   * How much the stack lags behind scroll. 0 = no parallax, 0.05 = 5% of
   * scrollY in upward translation (subtle). The drag *feel* comes from
   * the smoothing factor below, not this number.
   */
  parallax?: number;
  /** How many copies to render. 7 is a comfortable trail. */
  trailCount?: number;
  /**
   * What fraction of the orbit the trail occupies (0–1). 0.18 ≈ each
   * copy ~0.18/N of a loop behind the previous one → tight trail.
   * Larger values spread copies further apart along the path.
   */
  trailSpread?: number;
  /**
   * Tail opacity multiplier — the last copy's opacity is
   * `opacity * (1 - tailFade)`. 0.92 → tail is ~8% of lead.
   */
  tailFade?: number;
  /** Mark asset path. */
  src?: string;
  className?: string;
};

export function FloatingBackgroundLogo({
  opacity = 0.18,
  blur = 1.6,
  scale = 1.512,
  duration = 400,
  parallax = 0.057,
  trailCount = 7,
  trailSpread = 1.0,
  tailFade = 0.88,
  src,
  className,
}: FloatingBackgroundLogoProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  // Theme-switched, pre-baked tint variants. Replaces the per-frame
  // `filter: grayscale(1) invert() brightness(.66) contrast(.93)` chain
  // that previously ran on every trail copy's inner <img> on every
  // composite — a major cost across 7 layers on mobile GPUs.
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const read = () =>
      root.getAttribute("data-theme") === "light" ? "light" : "dark";
    setTheme(read());
    const obs = new MutationObserver(() => setTheme(read()));
    obs.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  const resolvedSrc =
    src ?? (theme === "light" ? "/logowhite-light.png" : "/logowhite-dark.png");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = rootRef.current;
    if (!el) return;

    let targetY = 0;
    let currentY = 0;
    let rafId: number | null = null;

    // Smoothing constant: lower = more drag (logo lags more).
    const SMOOTHING = 0.08;

    const tick = () => {
      const delta = targetY - currentY;
      if (Math.abs(delta) < 0.05) {
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

  const copies = Array.from({ length: Math.max(1, trailCount) });
  // Per-copy animation-delay step. Divide by trailCount (not count-1) so
  // copies distribute as 0, 1/N, ..., (N-1)/N of the orbit — with
  // trailSpread = 1.0 they spread evenly across the whole loop, no
  // clustering at the seam. Smaller spreads bunch them up behind the lead.
  const stepSec = (duration * trailSpread) / Math.max(1, trailCount);

  return (
    <div
      ref={rootRef}
      className={`floating-bg${className ? ` ${className}` : ""}`}
      style={style}
      aria-hidden="true"
    >
      {copies.map((_, i) => {
        const t = trailCount > 1 ? i / (trailCount - 1) : 0; // 0 = lead, 1 = tail
        const instanceOpacity = opacity * (1 - t * tailFade);
        // Stagger each copy further back along the orbit, so visually they
        // trail the lead. driftDelay drives fb-drift; breatheDelay keeps
        // fb-breathe loosely in sync (75% of duration → keep ratio).
        const driftDelay = -i * stepSec;
        const breatheDelay = driftDelay * 0.75;
        const instanceStyle: React.CSSProperties = {
          "--fb-instance-opacity": instanceOpacity,
          animationDelay: `${driftDelay.toFixed(3)}s, ${breatheDelay.toFixed(3)}s`,
          zIndex: trailCount - i, // lead paints on top
        } as React.CSSProperties;
        return (
          <div key={i} className="floating-bg__mark" style={instanceStyle}>
            <Image
              src={resolvedSrc}
              alt=""
              width={1536}
              height={1024}
              priority={false}
              draggable={false}
              sizes="(max-width: 820px) 140vw, 2200px"
            />
          </div>
        );
      })}
      <div className="floating-bg__vignette" />
    </div>
  );
}
