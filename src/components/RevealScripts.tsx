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
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));

    const cards = document.querySelectorAll<HTMLElement>(".ap-card");
    const onMove = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    cards.forEach(c => c.addEventListener("mousemove", onMove));

    return () => {
      document.removeEventListener("scroll", onScroll);
      io.disconnect();
      cards.forEach(c => c.removeEventListener("mousemove", onMove));
    };
  }, [pathname]);

  return null;
}
