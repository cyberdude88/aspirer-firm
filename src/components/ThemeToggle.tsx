"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "af-theme";
const MEDIA_QUERY = "(prefers-color-scheme: light)";

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 2.75v2.5M12 18.75v2.5M21.25 12h-2.5M5.25 12h-2.5M18.54 5.46l-1.77 1.77M7.23 16.77l-1.77 1.77M18.54 18.54l-1.77-1.77M7.23 7.23L5.46 5.46"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M15.2 2.9a8.9 8.9 0 1 0 5.9 15.2 9.6 9.6 0 0 1-2.7.4 9.25 9.25 0 0 1-9.25-9.25 9.6 9.6 0 0 1 6.05-8.62Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [ready, setReady] = useState(false);
  const [hasExplicitChoice, setHasExplicitChoice] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    const stampedTheme = root.dataset.theme === "light" ? "light" : "dark";
    let storedTheme: string | null = null;

    try {
      storedTheme = window.localStorage.getItem(STORAGE_KEY);
    } catch {}

    setTheme(stampedTheme);
    setHasExplicitChoice(storedTheme === "light" || storedTheme === "dark");
    setReady(true);

    const mediaQuery = window.matchMedia(MEDIA_QUERY);
    const syncSystemTheme = (event: MediaQueryListEvent) => {
      let nextHasExplicitChoice = false;

      try {
        const latest = window.localStorage.getItem(STORAGE_KEY);
        nextHasExplicitChoice = latest === "light" || latest === "dark";
      } catch {}

      if (nextHasExplicitChoice) {
        setHasExplicitChoice(true);
        return;
      }

      const nextTheme: Theme = event.matches ? "light" : "dark";
      root.dataset.theme = nextTheme;
      setTheme(nextTheme);
      setHasExplicitChoice(false);
    };

    mediaQuery.addEventListener("change", syncSystemTheme);

    return () => {
      mediaQuery.removeEventListener("change", syncSystemTheme);
    };
  }, []);

  const nextTheme: Theme = theme === "light" ? "dark" : "light";
  const label = theme === "light" ? "Switch to dark theme" : "Switch to light theme";

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={label}
      aria-pressed={theme === "light"}
      onClick={() => {
        const root = document.documentElement;
        const upcoming: Theme = theme === "light" ? "dark" : "light";

        root.dataset.theme = upcoming;
        setTheme(upcoming);
        setHasExplicitChoice(true);

        try {
          window.localStorage.setItem(STORAGE_KEY, upcoming);
        } catch {}
      }}
      data-theme-target={nextTheme}
      data-explicit={hasExplicitChoice ? "true" : "false"}
    >
      {ready ? (
        theme === "light" ? <MoonIcon /> : <SunIcon />
      ) : (
        <span className="theme-toggle__placeholder" aria-hidden="true" />
      )}
    </button>
  );
}
