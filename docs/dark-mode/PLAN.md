# Day/Night Theme Toggle — Plan

> Planning artifact. No code changes are made by this document.
> Implementation lives in `SPRINTS.md`.

---

## 0. Frame

Dark stays the default and is byte-identical to today.
Light is a new override layer, scoped exclusively under `html[data-theme="light"] …`,
applied per-layer in the order the eye reads them: backdrop → glow → grain → slashes →
floating mark → nav → hero → sections → CTA → footer. Tokens are *not* flipped
bidirectionally — every ambient layer is calibrated for `mix-blend-mode` on a dark
base, and a bidirectional token swap would regress all of them.

Two attributes drive the surface state:
- `html[data-intro]` — existing intro state machine (`armed | playing | morphing | fading | done`)
- `html[data-theme]` — new theme attribute (`dark | light`)

These are independent. The intro and theme state machines must not be coupled.

---

## 1. Token strategy

### 1.1 Existing `:root` tokens (no change — keep dark values)

```
--ink     #0a0a0a
--paper   #f4f1ec
--bone    #e8e4dc
--gold    #c9a875
--gold-soft  rgba(201,168,117,.18)
--navy    #0e1f44
--navy-soft  rgba(14,31,68,.34)
```

These are semantic brand colors that do not change between themes. They define
the palette, not the mode.

### 1.2 Tokens overridden under `html[data-theme="light"]`

These are the *surface* tokens — the ones currently expressed as
white-with-alpha against a dark base. In light mode they must invert to
ink-with-alpha against a paper base.

| Token        | Dark (existing)             | Light override                  |
| ------------ | --------------------------- | ------------------------------- |
| `--fog`      | `rgba(255,255,255,.06)`     | `rgba(10,10,10,.05)`            |
| `--line`     | `rgba(255,255,255,.10)`     | `rgba(10,10,10,.10)`            |
| `--mute`     | `rgba(255,255,255,.55)`     | `rgba(10,10,10,.58)`            |

`--gold-soft` and `--navy-soft` stay as-is — they're brand tints layered on
top of the surface, not surface themselves.

### 1.3 New tokens added to `:root`

Two new semantic tokens make the override layer smaller and more legible.
They are defined alongside the existing `:root` block (default = dark values),
and overridden under `html[data-theme="light"]`.

| Token              | Dark               | Light             | Used for                      |
| ------------------ | ------------------ | ----------------- | ----------------------------- |
| `--surface-bg`     | `#111317`          | `#f4f1ec`         | `body` background base color  |
| `--surface-ink`    | `#ffffff`          | `#0a0a0a`         | `body` foreground text color  |

The `html,body { background:#111317; color:#fff }` rule at globals.css:27 is
rewritten to consume these tokens. Visually identical in dark mode; trivially
correct in light mode.

### 1.4 No new color tokens for ambient layers

The stage-bg gradients, stage-glow opacities, grain blend mode, slash blends,
and floating-mark filters are all overridden by *full property replacement* in
the light-mode CSS layer, not by token swaps. This is deliberate per the
architectural decision in the task brief: tokenizing them would lose the
calibration baked into the dark-mode values.

---

## 2. Boot script merge

### 2.1 Why merge, not stack

Two inline scripts in `<head>` = two separate parse-and-execute passes, two
opportunities for the browser to commit a frame between them, and an ordering
guarantee that depends on script-tag order rather than being explicit in the
code. Merging into one `try { … }` block makes the order explicit and
collapses both attribute stamps into a single synchronous DOM write.

The script must read theme state from `localStorage` and `prefers-color-scheme`
*before* paint, exactly like INTRO_BOOT reads `prefers-reduced-motion` today.

### 2.2 Merged source (replaces INTRO_BOOT in `src/app/layout.tsx`)

```js
const BOOT = `
try {
  var d = document.documentElement;

  // --- THEME (stamp first: gates first-frame colors)
  var stored;
  try { stored = localStorage.getItem('af-theme'); } catch(e) {}
  var prefersLight =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  var theme = (stored === 'light' || stored === 'dark')
    ? stored
    : (prefersLight ? 'light' : 'dark');
  d.setAttribute('data-theme', theme);

  // --- INTRO (stamp second: gates first-frame animation phase)
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    d.setAttribute('data-intro','done');
  } else if (window.location && window.location.pathname === '/') {
    d.setAttribute('data-intro','armed');
  } else {
    d.setAttribute('data-intro','done');
  }
} catch(e) {
  // Last-resort fallbacks so the page is never left unstamped.
  document.documentElement.setAttribute('data-theme','dark');
  document.documentElement.setAttribute('data-intro','done');
}
`;
```

### 2.3 Reasoning on order

1. `data-theme` is read by CSS that selects on `body` and `html` themselves —
   first paint *requires* it. Stamp first.
2. `data-intro` only gates animation phases (wipes, slides, glow fade-in).
   Animations don't run on the very first paint; stamping after theme is safe.
3. Both stamps live inside one `try` so a single throw can't leave the
   document half-stamped (which would mean: light theme requested, but stuck
   in `armed` intro forever because the catch only handled one attribute).
4. `localStorage` access is wrapped in its own inner `try` because Safari
   private mode throws on `getItem` — falling back to `prefers-color-scheme`
   is the correct degradation, not crashing the whole boot script.

### 2.4 Why no `next-themes`

The task brief asks for justification only if disagreeing. We are not
disagreeing. The existing INTRO_BOOT pattern is functionally identical to
`next-themes`' FOUC-prevention machinery (inline script, attribute stamp,
read from localStorage + `prefers-color-scheme`). Adding the dependency
would duplicate ~8kb of code we already write inline and introduce a second
attribute (`class="dark"`) that doesn't compose with `data-intro`.

---

## 3. Ambient layer overrides

All selectors below are prefixed with `html[data-theme="light"]`. They live
in a single `/* ---------- LIGHT MODE ---------- */` block at the end of
`globals.css`, after the dark rules they override, so the cascade does the
work without `!important`.

### 3.1 `body`

```
background: var(--surface-bg);
color:      var(--surface-ink);
```

(Dark-mode rule at globals.css:27 is first rewritten to consume the tokens;
no change to its computed value in dark.)

### 3.2 `.stage-bg`

Replace the entire `background:` shorthand. Dark uses two stacked gradients
of `#15…#1b…#25…` — light uses paper / bone equivalents.

```
background:
  linear-gradient(180deg, #efeae1 0%, #e6dfd2 24%, #d8d0bf 38%, #ebe5d9 55%, #d3cbb9 76%, #f1ece2 100%),
  linear-gradient(90deg,  #ece6da 0%, #d6cebc 18%, #ece6d9 46%, #cdc3ae 72%, #f0eadf 100%);
```

### 3.3 `.stage-bg::before`

Replace the three radial gradients (currently white-alpha and gray-alpha
on dark) with low-alpha ink so they continue to read as "depth shading"
on the paper base. The repeating-line scrim stays but its alpha drops.

```
background:
  radial-gradient(1200px 360px at 50% 14%, rgba(10,10,10,.045), transparent 68%),
  radial-gradient(1000px 320px at 52% 52%, rgba(60,60,80,.04),  transparent 66%),
  radial-gradient(1300px 360px at 50% 88%, rgba(10,10,10,.04),  transparent 70%),
  repeating-linear-gradient(180deg, rgba(10,10,10,.04) 0 1px, rgba(10,10,10,0) 1px 118px);
opacity: .46;
/* transform + mirrorPulse animation: keep as-is */
```

### 3.4 `.stage-bg::after`

`mix-blend-mode: screen` adds light; on a paper base that just adds white.
Swap to `multiply` and recolor with ink-alpha so the sweep continues to
read as a moving sheen.

```
background:
  linear-gradient(90deg,
    transparent 0%, rgba(10,10,10,.04) 20%, transparent 36%,
    rgba(40,48,72,.04) 52%, transparent 68%,
    rgba(10,10,10,.035) 82%, transparent 100%),
  radial-gradient(900px 500px at 50% 50%, transparent 42%, rgba(255,255,255,.20) 100%);
mix-blend-mode: multiply;
opacity: .28;
/* mirrorSweep animation: keep as-is */
```

### 3.5 `.stage-glow::before`

Per the locked spec. Position, drift, and breathe identical to dark.
Opacities lowered. Blend mode remains the default (no explicit blend).

```
background:
  radial-gradient(1200px 720px at 22% 112%, rgba(196,118,72,.18) 0%, rgba(196,118,72,.05) 36%, transparent 62%),
  radial-gradient(1100px 600px at 78% 106%, rgba(214,158,118,.14) 0%, transparent 60%),
  radial-gradient(900px 480px at 50% 96%,  rgba(184,128,108,.10) 0%, transparent 64%);
/* animation: stage-glow-driftA — keep as-is */
```

### 3.6 `.stage-glow::after`

Per the locked spec. Blend mode `screen → multiply`. Opacities lowered.

```
background:
  radial-gradient(820px 380px at 52% 102%, rgba(255,212,158,.14) 0%, transparent 64%),
  radial-gradient(620px 320px at 50% 94%,  rgba(255,232,196,.12) 0%, transparent 68%),
  radial-gradient(460px 220px at 48% 86%,  rgba(255,246,228,.08) 0%, transparent 72%);
mix-blend-mode: multiply;
/* animation: stage-glow-driftB — keep as-is */
```

### 3.7 `.stage-grain`

`mix-blend-mode: soft-light` works on either base (soft-light adds contrast
in both directions), but dark's `opacity: .1` is calibrated for noise-on-dark
where pixels appear *lighter*. On paper the same noise appears *darker*; drop
opacity slightly so the grain stays subliminal.

```
opacity: .07;
/* mix-blend-mode and SVG background: keep as-is */
```

### 3.8 `.slash` (and `.slash.s1` … `.slash.s5`)

`mix-blend-mode: screen` makes white-on-light disappear. Two paths:
flip to `multiply` and invert the PNG to ink, OR drop opacity heavily and
keep the multiply path. We pick the first: it preserves slash visibility
on the new base while keeping the same opacity hierarchy that the dark
mode uses for s1–s5.

```
/* base */
filter: invert(1) blur(.35px);
mix-blend-mode: multiply;

/* per-slash opacities: identical to dark — opacity values translate
   correctly because invert() preserves alpha. */
```

(s1=.11, s2=.07, s3=.10, s4=.055, s5=.085 — unchanged.)

### 3.9 `.floating-bg__mark`

Currently `filter: blur(1.6px) saturate(0) brightness(.82) contrast(.94)`.
That's calibrated to fade a white mark into a dark backdrop. On paper, we
need to fade an ink mark into a paper backdrop — same recipe but inverted
brightness.

```
filter: blur(var(--fb-blur)) saturate(0) brightness(1.15) contrast(.90);
opacity: var(--fb-opacity);
/* animations fb-drift + fb-breathe: keep as-is */
```

Also override the `--fb-opacity` *default* (set on `.floating-bg`) under
light mode to a slightly lower value so the ink ghost doesn't dominate:

```
html[data-theme="light"] .floating-bg { --fb-opacity: 0.10; }
```

(Dark default lives on `.floating-bg` already — confirm exact selector in
implementation; per FloatingBackgroundLogo.tsx the prop is on the root.)

### 3.10 `.floating-bg__mark img`

```
filter: invert(1) grayscale(1) brightness(1.05) contrast(.93);
```

`invert(1)` flips the white PNG to black; the rest is parallel to the dark
filter recipe (`grayscale(1) brightness(.66) contrast(.93)`) but tuned for
ink-on-paper rather than white-on-near-black.

### 3.11 `.floating-bg__vignette`

Dark vignette darkens the edges with `rgba(12,14,18,.08 → .16)`. On paper
we want to *lighten* the edges to melt the mark into the page background,
not darken into a dirty halo. Replace with paper-alpha:

```
background:
  radial-gradient(130% 90% at 50% 45%,
    transparent 0%,
    transparent 64%,
    rgba(244,241,236,.12) 84%,
    rgba(244,241,236,.24) 100%);
```

---

## 4. Component-level overrides

| Selector              | Override                                                                                                                                                                     |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.nav`                | `background: rgba(8,8,8,.55); border-bottom-color: rgba(10,10,10,.08);` — keep the dark glass surface; bump opacity from .35 → .55 so the white logo retains contrast.       |
| `.nav.scrolled`       | `background: rgba(6,6,6,.82);` — parallel bump from .7 → .82.                                                                                                                |
| `.nav-cta`            | `border-color: rgba(255,255,255,.32); background: rgba(255,255,255,.10);` — nav stays dark, so CTA contrast logic stays white-on-dark. No change to `:hover`.                |
| `.btn-primary`        | `background: var(--ink); color: #fff;` — inverts: dark mode = white button on dark page, light mode = dark button on paper page. Hover shadow alpha stays at .28.            |
| `.btn-ghost`          | `border-color: rgba(10,10,10,.18); color: var(--ink); background: rgba(10,10,10,.04);` — and `:hover { background: rgba(10,10,10,.08); border-color: rgba(10,10,10,.32); }`. |
| `.section-pill`       | `border-color: rgba(10,10,10,.12); background: rgba(10,10,10,.04); color: rgba(10,10,10,.68);` — `:hover` mirrors with .08 / .22 / `var(--ink)`.                              |
| `.hero::before`       | `background: radial-gradient(900px 420px at 50% 14%, rgba(201,168,117,.10), transparent 68%), linear-gradient(180deg, rgba(244,241,236,.78) 0%, rgba(244,241,236,.32) 32%, rgba(244,241,236,.06) 100%);` — same scrim shape, flipped from dark→paper. |
| `.hero h1` (gradient) | `background: linear-gradient(180deg, var(--ink) 0%, rgba(10,10,10,.88) 42%, rgba(10,10,10,.48) 100%);` — preserves the same vertical fade, ink instead of white.             |
| `.hero h1 em`         | No change — gold gradient (`#f3e3c4 → #c9a875`) reads on both bases.                                                                                                          |
| `.cta-card`           | `background: linear-gradient(160deg, rgba(248,242,228,.86) 0%, rgba(244,241,236,.78) 70%); border-color: rgba(201,168,117,.28);` — and override `::after` `rgba(255,255,255,.04) → rgba(10,10,10,.045)`. `::before` gold radials keep their warmth, drop alpha from .22→.16 and .10→.08. |
| `.about-portrait-card`| `background: linear-gradient(160deg, rgba(248,242,228,.82) 0%, rgba(244,241,236,.74) 100%); border-color: rgba(201,168,117,.24); box-shadow: 0 24px 80px rgba(10,10,10,.10);` |
| `.foot-shell`         | `border-top-color: rgba(10,10,10,.10);` (inherits new `--line`).                                                                                                              |

Text colors that derive from `var(--mute)` (`.foot a`, `.hero-sub`, `.sec-head p`,
`.svc-desc`, `.metric .l`, `.qfoot .role`, etc.) follow automatically when
`--mute` is overridden in §1.2.

Border colors that derive from `var(--line)` (`.svc-row`, `.svc-list`,
`.approach-grid`, `.quote`, `.metrics`, `.foot-bottom`) follow automatically
when `--line` is overridden in §1.2.

---

## 5. Logo strategy

**Chosen: option (a)** — keep white strokes, keep the nav as a dark glass plate.

### Why not (b) or (c)

The LogoMark renders four **raster PNGs** (`/brand/logo-arc.png`,
`logo-slash-1.png`, `-2.png`, `-3.png`) inside `<svg><image>` elements
(LogoMark.tsx:38–42). Raster files don't have a `fill` to swap (rules out
b's "swap stroke fill to ink") and don't respond to `currentColor` (rules
out c entirely). Inverting via CSS `filter: invert(1)` would technically
flip white→black, but it would also invert the `logo-stroke-flash` bloom
(the `drop-shadow(rgba(255,255,255,…))` keyframe values would still emit
white light, which on an inverted black mark over a paper page would land
as a dark halo — not a bloom). Re-coloring the flash to ink + retuning all
six keyframes for ink-on-paper is a calibration project we don't need.

### How (a) preserves `logo-stroke-flash`

The nav remains a dark `rgba(8,8,8,.55+)` surface in light mode (§4),
which means the LogoMark continues to sit on top of a near-black backdrop
*regardless of theme*. The flash keyframes (logo-stroke-flash, globals.css:906)
animate `brightness(1 → 1.6 → 1)` and `drop-shadow(rgba(255,255,255,…))` —
both effects operate on the strokes relative to their immediate background.
Because that background is unchanged in light mode, the flash needs zero
modification.

### Trade-off

The nav reads as a "tinted glass" panel over the paper page, similar to
Linear / Vercel / Stripe light themes. This is consistent with the design
language but the user should sign off visually after Sprint 4.

---

## 6. Toggle UX

### 6.1 Mount point

`components/Header.tsx`, inside `.nav-row`, after `<Link … className="nav-cta">`:

```
<ThemeToggle />
```

Renders an `<button type="button" class="theme-toggle" aria-label="…" aria-pressed="…">`
with an inline sun/moon SVG. No new dep.

### 6.2 Component contract

`components/ThemeToggle.tsx` — a small client component (`"use client"`):

- On mount, reads `document.documentElement.dataset.theme` (set by BOOT
  in §2) and mirrors it into local state. It does **not** read
  localStorage or matchMedia — the boot script is authoritative.
- On click, flips theme, writes `localStorage.setItem('af-theme', next)`,
  and sets `document.documentElement.dataset.theme = next`. No reload.
- Listens to `window.matchMedia('(prefers-color-scheme: …)').addEventListener('change', …)`
  *only* when the user has not made an explicit choice (i.e. localStorage is
  empty). Once they toggle once, system changes are ignored.

### 6.3 Icon

Inline SVG, swapped via React. ~24×24, 1.5px stroke, `currentColor`. Sun
shown when theme is dark (click → go to light); moon shown when theme is
light (click → go to dark).

### 6.4 Micro-animation

CSS-only:
```
.theme-toggle svg { transition: transform .35s cubic-bezier(.4,0,.2,1), opacity .25s ease; }
.theme-toggle:hover svg { transform: rotate(18deg); }
.theme-toggle:active svg { transform: scale(.92); }
```

Respect `prefers-reduced-motion`:
```
@media (prefers-reduced-motion: reduce) {
  .theme-toggle svg { transition: none; }
}
```

### 6.5 Accessibility

- `<button type="button">` (default `role=button`).
- `aria-label="Switch to light theme"` / `"Switch to dark theme"` — flips with state.
- `aria-pressed={theme === 'light'}` — exposes toggled state for AT users.
- Focus ring inherited from existing nav focus styles; verify `outline` is
  not suppressed.
- 44×44 hit target (CSS `min-width: 44px; min-height: 44px;` even if visual
  icon is smaller — important on mobile per the existing nav touch tuning).

### 6.6 SSR

Component must render markup that matches the HTML the BOOT script produces.
The boot script stamps `data-theme` before React hydrates; the toggle reads
`document.documentElement.dataset.theme` in `useEffect`, so the *first* render
on the client falls back to a neutral icon (or to "dark" if we accept the
SSR-default). To avoid hydration mismatch, the icon renders as a placeholder
`<span aria-hidden style={{ width: 24, height: 24 }} />` on first render, then
swaps to the real SVG after `useEffect` runs. This is one frame of "icon
absent" and zero hydration mismatch — acceptable.

---

## 7. Risks — animation regression checklist

For each animation: **Touched?** = does the light-mode override layer touch
any property that animation reads from? **Verifies?** = what to check at
acceptance.

| Animation                  | Touched? | Verifies                                                                                                  |
| -------------------------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `brand-slide-in`           | No       | Wordmark slides in on home `/` in both themes — no opacity/transform regression.                          |
| hero rise (`hero-bars`, .hero h1) | Partial — `.hero h1` gradient is overridden | Heading fades/slides in correctly *and* renders as ink-gradient in light, white-gradient in dark.        |
| `mirrorPulse`              | No (transform-only) | Background shimmer continues to drift in both themes.                                                     |
| `mirrorSweep`              | Yes (blend mode + colors changed) | Sweep is visible in light mode as a subtle multiply pass; visible in dark as the existing screen pass.    |
| `stage-glow-in`            | No (animates opacity 0→1 of `.stage-glow`) | Glow fades in over 4.5s on first paint in both themes. Locked spec preserves the animation; only opacities of internal layers drop. |
| `stage-glow-breathe`       | No (animates `filter: brightness/saturate` on `.stage-glow`) | Glow breathes in both themes. Brightness multiplier applies on top of the lowered base opacities — verify the breathe doesn't make light-mode glow flash. |
| `stage-glow-driftA` / `B`  | No (transform-only) | Glow drift continues with identical rhythm in both themes.                                                |
| `logo-stroke-flash`        | No (per §5, nav stays dark) | Flash plays on `html[data-glow="done"]` on home page in both themes; bloom visible against dark nav surface. |
| `lr-wipe`                  | No (animates `transform: scaleY` of `.logo-reveal__wipe`) | All four strokes wipe in correctly during intro in both themes.                                          |
| `lr-settle`                | No (animates `transform: scale` of `.logo-reveal`) | Logo settles after wipe in both themes.                                                                  |
| `page-loading-fade`        | Partial — `.page-loading` uses `color: rgba(255,255,255,.62)` | Add a light-mode override: `color: rgba(10,10,10,.62)` so the "Loading…" label is visible on paper. Animation untouched. |
| `page-loading-dot`         | No (opacity + transform) | Dots pulse in both themes.                                                                                |
| `fb-drift`                 | No (transform-only) | Floating mark drifts in both themes; verify the inverted filter in §3.10 doesn't clip the drift.         |
| `fb-breathe`               | Partial — animates `scale` + `opacity` and reads `--fb-opacity` | With the new light-mode `--fb-opacity: 0.10` (§3.9), verify breathe still produces visible scale change. |
| `heroShadeDrift`           | Yes — `.hero::before` and `.hero::after` recolored | Drift animation on `.hero::after` continues unchanged (it's only transforming); the colors under it now read against paper. |
| `hero-slash-wipe`          | No | Hero slash wipes in correctly in both themes. The slash inherits the `.slash` light-mode filter (`invert(1) multiply`), so verify the wipe still reads on paper. |
| `marquee scroll`           | No (transform-only) | Marquee continues to scroll; verify gold ✦ and text colors render against paper background (text uses `rgba(255,255,255,.5)` — needs light override). |
| `slide` (hero-scroll bar)  | No | Bar pulses in both themes; verify the gradient `rgba(255,255,255,.32) → transparent` is overridden to ink-alpha for visibility on paper. |

**Two animations that need their *colors* (not their motion) re-checked:**
`page-loading` color, marquee text color, and `hero-scroll .bar` gradient
all hardcode white-alpha and must get light-mode overrides. These are not
listed in the original risks list but were uncovered during the audit and
are added to Sprint 3.

---

## 8. Out of scope

- Color theme beyond "dark default" + "light add-on". No high-contrast,
  no sepia, no per-user accent.
- Schema migrations or persisted server-side theme. Theme is purely client
  state (localStorage + `prefers-color-scheme`).
- Theme-aware OG / favicon / `theme-color` meta. The `<meta name="theme-color">`
  tag is *not* added in this work — adding it correctly requires duplicate
  meta tags with `media` queries, which is a separate hardening pass.
- Per-route theme overrides (e.g. forcing booking pages to dark).
- A "system" tri-state toggle (dark / light / system). The toggle is binary;
  "system" is the *default* before the user picks, but once picked, the
  choice persists.
- Email transactional templates — out of scope, those have no theme.
- Admin pages (`src/app/admin/…`) and booking pages have not been audited
  for white-on-dark assumptions outside the shared layout. If they hardcode
  colors, those are handled as a follow-up, not in this sprint set.
