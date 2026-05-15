"use client";

/**
 * LogoIntro — fullscreen reveal that morphs into the header logo.
 *
 * Phases (timeline mirrors design-reference Logo Reveal v4):
 *   0–700ms    arc wipes up
 *   700–1350   three slashes wipe in
 *   1400–1700  settle (shadow + scale)
 *   1700–2400  morph: FLIP-transform from fullscreen-centered →
 *              the bounding rect of the inline LogoMark in the header
 *   2400–2700  dismiss: fade overlay out, LogoMark fades in beneath
 *
 * Visibility coordination uses html[data-intro="..."] so CSS can
 * hide the inline LogoMark while the overlay owns the visual.
 *
 * Plays once per session. Reduced-motion users see nothing — the
 * inline LogoMark is visible from the start.
 *
 * FLIP target measurement:
 *   We query .nav .logo-reveal post-layout. Its dimensions are
 *   deterministic (aspect-ratio + width: clamp(...)) so getBoundingClientRect
 *   gives stable numbers from the first paint.
 */

import { useEffect, useState } from "react";

const STROKES = [
  { id: "li-arc", src: "/brand/logo-arc.png" },
  { id: "li-slash-1", src: "/brand/logo-slash-1.png" },
  { id: "li-slash-2", src: "/brand/logo-slash-2.png" },
  { id: "li-slash-3", src: "/brand/logo-slash-3.png" },
] as const;

const SESSION_KEY = "aspirer:intro-played";

const T_SETTLE_END = 1700;
const T_HOLD = 350; // pause after settle, before the slide kicks off
const T_MORPH_DUR = 800;
const T_DISMISS_DUR = 300;

type Phase = "armed" | "playing" | "morphing" | "fading" | "dismissed" | "skipped";

export function LogoIntro() {
  const [phase, setPhase] = useState<Phase>("armed");
  const [morph, setMorph] = useState<{ tx: number; ty: number; scale: number } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;

    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setPhase("skipped");
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setPhase("skipped");
      return;
    }

    root.setAttribute("data-intro", "playing");

    const timers: number[] = [];
    let cancelled = false;

    // Preload strokes so the wipe doesn't fight a still-decoding raster.
    Promise.all(
      STROKES.map(
        ({ src }) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = img.onerror = () => resolve();
            img.src = src;
          }),
      ),
    ).then(() => {
      if (cancelled) return;
      requestAnimationFrame(() => setPhase("playing"));

      // After wipe + settle + brief hold, measure the destination and FLIP to it.
      // The hold gives the eye a moment on the finished mark before it moves.
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return;
          const target = document.querySelector<HTMLElement>(".nav .logo-reveal");
          const source = document.querySelector<HTMLElement>(".logo-intro__box");
          if (!target || !source) {
            // No header slot found — just dismiss.
            setPhase("dismissed");
            return;
          }
          const t = target.getBoundingClientRect();
          const s = source.getBoundingClientRect();
          const scale = t.width / s.width;
          const tx = t.left + t.width / 2 - (s.left + s.width / 2);
          const ty = t.top + t.height / 2 - (s.top + s.height / 2);
          setMorph({ tx, ty, scale });
          setPhase("morphing");
          // Flipping data-intro to "morphing" is the trigger the
          // ASPIRER FIRM wordmark CSS watches — it un-pauses the
          // slide-in so the words and the logo travel together.
          root.setAttribute("data-intro", "morphing");
        }, T_SETTLE_END + T_HOLD),
      );

      // The moment the morph finishes: reveal the inline LogoMark,
      // trigger a brief gold glow on it, and start the overlay cross-fade.
      // data-glow is a one-shot signal that the CSS animation watches.
      timers.push(
        window.setTimeout(
          () => {
            if (cancelled) return;
            root.setAttribute("data-intro", "done");
            root.setAttribute("data-glow", "done");
            setPhase("fading");
          },
          T_SETTLE_END + T_HOLD + T_MORPH_DUR,
        ),
      );

      // After the cross-fade, unmount the overlay and lock in the
      // session flag so subsequent loads skip the intro entirely.
      timers.push(
        window.setTimeout(
          () => {
            if (cancelled) return;
            setPhase("dismissed");
            sessionStorage.setItem(SESSION_KEY, "1");
          },
          T_SETTLE_END + T_HOLD + T_MORPH_DUR + T_DISMISS_DUR,
        ),
      );
    });

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
      // Don't reset data-intro on cleanup — that would re-flash the layout.
      if (root.getAttribute("data-intro") !== "done") {
        root.setAttribute("data-intro", "done");
      }
    };
  }, []);

  if (phase === "skipped" || phase === "dismissed") return null;

  const style =
    morph != null
      ? ({
          // FLIP target — translate + scale to overlap the header LogoMark.
          "--li-tx": `${morph.tx}px`,
          "--li-ty": `${morph.ty}px`,
          "--li-scale": morph.scale.toString(),
        } as React.CSSProperties)
      : undefined;

  return (
    <div className="logo-intro" data-phase={phase} aria-hidden="true">
      <div className="logo-intro__box" style={style}>
        <svg
          className="logo-intro__strokes"
          viewBox="0 0 590 527"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {STROKES.map(({ id, src }) => (
            <g key={id} className="logo-intro__wipe" id={id}>
              <image href={src} width="590" height="527" />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
