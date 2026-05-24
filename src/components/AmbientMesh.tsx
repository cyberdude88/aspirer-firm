"use client";

import { useEffect, useRef } from "react";

export function AmbientMesh() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = wrapRef.current;
    if (!el) return;

    const blobs = Array.from(
      el.querySelectorAll<HTMLElement>(".ambient-mesh__blob")
    );
    if (!blobs.length) return;

    const REACT = -0.22;
    const DECAY = 0.1;
    const MAX = 110;
    const SETTLE = 0.15;
    const VECTORS = [
      { x: 0.42, y: -0.92 },
      { x: -0.34, y: -0.84 },
      { x: 0.2, y: -1.04 },
    ];

    let target = 0;
    let current = 0;
    let lastScrollY = window.scrollY;
    let rafId: number | null = null;

    const render = (amount: number) => {
      blobs.forEach((blob, index) => {
        const v = VECTORS[index] ?? VECTORS[VECTORS.length - 1];
        blob.style.setProperty("--mesh-blob-x", `${(amount * v.x).toFixed(2)}px`);
        blob.style.setProperty("--mesh-blob-y", `${(amount * v.y).toFixed(2)}px`);
      });
    };

    const tick = () => {
      target *= 1 - DECAY;
      const delta = target - current;
      if (Math.abs(delta) < 0.08 && Math.abs(target) < 0.08) {
        current = 0;
        target = 0;
        render(0);
        rafId = null;
        return;
      }
      current += delta * SETTLE;
      render(current);
      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const dY = y - lastScrollY;
      lastScrollY = y;
      target = Math.max(-MAX, Math.min(MAX, target + dY * REACT));
      if (rafId == null) rafId = requestAnimationFrame(tick);
    };

    render(0);
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
      </div>
    </div>
  );
}
