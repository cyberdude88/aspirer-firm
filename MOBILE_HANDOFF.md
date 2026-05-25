# Mobile Layout & Ambient Background — Handoff / Status

_Last updated: 2026-05-24 · scope: mobile (≤820px) centering, footer, and ambient-background system on the marketing site (`/`)._

## TL;DR

All changes are CSS/markup only, in **two files**:
- `src/app/globals.css`
- `src/components/Footer.tsx`

No JS logic, data, or build config changed. Dev server: `npm run dev` (Next.js 14, port 3000). Everything below is verified via Chrome DevTools Protocol measurements at a real 393×852 mobile viewport (not eyeballed).

---

## What changed (by problem → fix)

### 1. Hero content offset ~28px left on mobile  ✅
- **Root cause:** `.hero` is a flex row. `.hero-scroll` (the "SCROLL" cue) is declared `position:absolute` but was overridden to `position:relative` by `.hero > .hero-inner,.hero > .hero-scroll{position:relative;z-index:2}` (higher specificity). As `relative` it became a **second in-flow flex item**, so `.hero-inner`'s `width:100%` flex-shrank 321→265.6px and the pair packed left. `justify-content:center` was a no-op.
- **Fix:** dropped `.hero-scroll` from that rule (now `.hero > .hero-inner{...}`) and gave `.hero-scroll` its own `z-index:2` while keeping `position:absolute`.
- **Result:** hero-inner / eyebrow / headline / paragraph offset −27.69px → **0.00px**.

### 2. Phantom left shift (~7.5px) from a scrollbar gutter  ✅
- **Cause:** an earlier `scrollbar-gutter:stable` I had added reserved a gutter even with no scrollbar.
- **Fix:** reverted it; instead, at ≤820px: `html{scrollbar-width:none}` + `html::-webkit-scrollbar{display:none}` (matches a real phone's overlay scrollbar). Content now centers on the true viewport.

### 3. Mobile nav too tall / links missing  ✅
- Reworked the `@media (max-width:820px)` nav block: brand is a **row** (logo + wordmark), `.nav-row` wraps so all four links sit centered on their own line with the CTA + theme toggle below. Restored a large fluid `ASPIRER FIRM` wordmark (`brand-line-sub` → `clamp(32px,9vw,46px)`). Hero top padding 300→190px.

### 4. Landscape hero title clipped  ✅
- Added `@media (max-height:560px) and (orientation:landscape)`: smaller hero top padding, `min-height:0`, and height-aware title `clamp(24px,6.4vh,52px)`.

### 5. Footer brand sat in the left column  ✅
- At ≤820px `.foot` is a 2-col grid; `.foot-brand` was the left cell. Now `grid-column:1 / -1` + centered above the link columns.

### 6. Ambient depth died below the hero on mobile  ✅
- **Root cause:** `.ambient-mesh` (the only layer with warm pools distributed top→bottom) was `display:none` on mobile (perf guard vs. 5 animated `blur(55–70px)` blobs). What remained was `.stage-glow` (bottom-edge only) + `.floating-bg` (single centered ghost).
- **Fix:** re-enabled `.ambient-mesh` on mobile but **hid the animated blobs (`.__inner`) + noise** and painted **static radial-gradient pools** on the already-fixed, full-viewport container (no blur filter, no animation, one composited layer). Theme-scoped: `html[data-theme="dark"]` (cream-lighten) and `html[data-theme="light"]` (low-alpha warm shadow).
  - ⚠️ Specificity note: the dark variant **must** be `html[data-theme="dark"] .ambient-mesh` (0,2,0) because the base `.ambient-mesh{background}` is declared later in the file and would otherwise win on source order.

### 7. "A" logo geometry letterboxed into the vertical middle  ✅
- **Root cause:** `.floating-bg__mark img` uses `object-fit:contain`; the landscape logo letterboxed into ~26–63% height, so the bottom ~30% had no strokes.
- **Fix:** enlarged the mobile mark `clamp(420px,120vw,760px)` → `clamp(640px,205vw,980px)` so the strokes **bleed off top and bottom edges** — continuous geometry through the footer.
- ⚠️ **Perf follow-up:** keeping the original **3** trail copies at this larger size + scroll parallax = 3 big composited layers reblending each scroll frame → choppy. Reduced mobile trail to **1 copy** (`.floating-bg__mark:nth-child(n+2){display:none}`). A single large mark still covers the full height (markBottom 956 ≥ vh 852); bump to 2 if you want a hint of trail and the device can take it.

### 8. Shapes were locked on scroll (wanted parallax)  ✅
- **Root cause:** the mobile mark rule overrode `translate` to `-50% -50%`, dropping the `var(--fb-scroll-y)` parallax term → fully static on mobile.
- **Fix:** `translate:-50% calc(-50% + clamp(-130px, var(--fb-scroll-y,0px), 130px))`. Re-enables the existing JS-driven parallax but **clamps to ±130px** so the mark eases (lower strokes rise into view) yet never drifts off-screen — also caps the address-bar-resize jump that made the original author disable it. `transform`-based `fb-drift` animation composes independently.
- **Verified:** `--fb-scroll-y` `0 → −35.7 → −157.8px` (clamped to −130 at footer); mark covers the bottom viewport edge at **every** scroll depth (no blank space).
- _Performance note:_ parallax is the cheapest of the options considered — one existing composited layer moved by `translate` (no layout/paint), vs. an echo copy (extra layer) or document-tiled shapes (repaint of large blur regions on scroll).

### 9. Footer credit / copyright  ✅  (`Footer.tsx`)
- Copyright → `© {year} ALEX ANSBERGS. ALL RIGHTS RESERVED.`
- Added centered credit line: `Designed & built by ALEX ANSBERGS`, where **ALEX ANSBERGS** links to `https://www.linkedin.com/in/alex-ansbergs` (`target="_blank"`, `rel="noopener noreferrer"`). Styles: `.foot-credit` / `.foot-credit-link` in globals.css. Works mobile + desktop (centered, `max-width:1240px; margin:auto`).
- ⚠️ Open decision: copyright holder is now **you**, not the client (ASPIRER FIRM / Marie Cook). Revert the rights line to the client if they expect their business named, keeping just the "built by" credit.

---

## Status

| Item | State |
|---|---|
| Hero centering (mobile) | ✅ 0.00px offset, measured |
| Mobile nav layout | ✅ |
| Landscape title clip | ✅ |
| Footer brand centered | ✅ |
| Ambient depth full-height (dark + light) | ✅ |
| "A" geometry to bottom 25% | ✅ |
| Clamped scroll parallax | ✅ |
| Footer credit + LinkedIn link | ✅ |
| Copyright = client vs. builder | ⚠️ decision pending |

## How to verify
- `npm run dev`, open `http://localhost:3000` at 393×852 (DevTools device mode or the throwaway phone-frame preview at `/tmp/phone-frame.html`).
- Toggle dark/light with the moon/sun icon — ambient effect is strongest in dark.
- Scroll top → footer: "A" geometry should drift gently and stay in frame through the footer; content blocks centered; ASPIRER FIRM + credit centered at the bottom.

## Notes / not done
- `.slashes` decorative layer is referenced in CSS but **not rendered** in the DOM on `/` (no component mounts it) — its CSS is effectively dead.
- `/privacy` (and likely `/terms`, `/confidentiality`) render **raw markdown** with template placeholders like `[EFFECTIVE DATE]` — content/rendering issue, out of scope here.
- The logo intro re-glow "flash on click" the user mentioned earlier was **not** changed (never reproduced/clarified).
