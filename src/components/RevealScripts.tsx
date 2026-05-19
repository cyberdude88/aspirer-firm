"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Wires up the same DOM behaviors as the design source:
//   - sticky nav scroll-state toggle
//   - reveal-on-scroll via IntersectionObserver
//   - approach card spotlight (mouse-tracking CSS vars)
export function RevealScripts() {
  const pathname = usePathname();
  useEffect(() => {
    const nav = document.getElementById("nav");
    const onScroll = () => nav?.classList.toggle("scrolled", window.scrollY > 12);
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Publish the actual fixed-nav height so scroll-padding-top /
    // scroll-margin-top stay correct as the nav resizes (logo swap,
    // scrolled-state shrink, viewport change). Without this anchor
    // links overshoot or undershoot the section header.
    const setNavH = () => {
      if (!nav) return;
      const h = Math.round(nav.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--nav-h", `${h}px`);
    };
    setNavH();
    const ro = new ResizeObserver(setNavH);
    if (nav) ro.observe(nav);
    window.addEventListener("resize", setNavH);

    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    const revealIfVisible = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      const entersViewport = rect.top <= viewportH * 0.92 && rect.bottom >= 0;

      if (entersViewport) {
        el.classList.add("in");
        io.unobserve(el);
        return true;
      }

      return false;
    };

    const seenRevealNodes = new WeakSet<HTMLElement>();
    const seenCards = new WeakSet<HTMLElement>();

    const observeRevealNode = (el: HTMLElement) => {
      if (seenRevealNodes.has(el)) return;
      seenRevealNodes.add(el);
      if (!revealIfVisible(el)) io.observe(el);
    };

    const onMove = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    };

    const wireCard = (card: HTMLElement) => {
      if (seenCards.has(card)) return;
      seenCards.add(card);
      card.addEventListener("mousemove", onMove);
    };

    const processNode = (node: ParentNode) => {
      if (node instanceof HTMLElement) {
        if (node.matches(".reveal")) observeRevealNode(node);
        if (node.matches(".ap-card")) wireCard(node);
      }

      node.querySelectorAll<HTMLElement>(".reveal").forEach(observeRevealNode);
      node.querySelectorAll<HTMLElement>(".ap-card").forEach(wireCard);
    };

    processNode(document);

    const raf = window.requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>(".reveal").forEach(revealIfVisible);
    });

    const mo = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach(node => {
          if (node instanceof HTMLElement) processNode(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", setNavH);
      window.cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.querySelectorAll<HTMLElement>(".ap-card").forEach(card => {
        card.removeEventListener("mousemove", onMove);
      });
    };
  }, [pathname]);

  return null;
}
