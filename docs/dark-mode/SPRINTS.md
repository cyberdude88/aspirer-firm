# Day/Night Theme Toggle — Sprints

> Four sprints, each fits in one ~30-minute Claude Code session.
> Run them in order. Each sprint's **Context bootstrap** block is what you
> paste into a fresh session along with this file path — it carries forward
> only the decisions the next sprint actually needs.

Repo root for all paths: `/home/alex/projects/aspirer-firm`.

---

### Sprint 1: Theme plumbing
**Goal:** Add the theme attribute, boot script merge, token overrides, and a working header toggle — without changing any ambient-layer visuals yet.

**Files touched:**
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/components/Header.tsx`
- `src/components/ThemeToggle.tsx` (new)

**Context bootstrap (paste into new Claude Code session):**
> - Adding a light theme; dark stays the default and byte-identical.
> - Implementation = override layer scoped to `html[data-theme="light"] …`, NOT a bidirectional token system. Reason: ambient layers use `mix-blend-mode` calibrated for dark base.
> - The existing INTRO_BOOT inline script in `src/app/layout.tsx` must be MERGED with a theme-boot stamp into a single inline `<script>`. Theme stamps first (gates first-frame colors); intro stamps second (gates first-frame animation phase). Both inside one `try` so a single throw can't half-stamp. Inner `try` around `localStorage.getItem` for Safari private mode. Persist key: `af-theme`. Source is in PLAN.md §2.2.
> - New tokens in `:root` (default = dark values): `--surface-bg: #111317`, `--surface-ink: #ffffff`. Rewrite the `html,body { background:#111317; color:#fff }` rule at globals.css:27 to consume these tokens — visually identical in dark.
> - Light-mode `:root` overrides under `html[data-theme="light"]`: `--surface-bg: #f4f1ec`, `--surface-ink: #0a0a0a`, `--fog: rgba(10,10,10,.05)`, `--line: rgba(10,10,10,.10)`, `--mute: rgba(10,10,10,.58)`. Brand tokens (`--ink`, `--gold`, `--navy`, `--paper`, `--bone`) do not change between themes.
> - Toggle UX (PLAN.md §6): inline SVG sun/moon, no `lucide-react` dep. Mount inside `.nav-row` of `Header.tsx` after the `.nav-cta` link. Component is `"use client"`. On mount reads `document.documentElement.dataset.theme`; on click writes both `localStorage` and `document.documentElement.dataset.theme`. Renders a placeholder span on first render to avoid hydration mismatch; swaps to the real icon in `useEffect`.
> - Sprint 2 will add ambient-layer overrides. This sprint's only visual change is `body` background+color in light mode and the new toggle button. The page will look "mostly dark on a paper background" in light mode after this sprint — that is expected.

**Steps:**
1. In `src/app/globals.css`, add `--surface-bg: #111317;` and `--surface-ink: #ffffff;` to the first `:root` block (top of file). Rewrite `html,body{background:#111317;color:#fff;…}` at line 27 to use the tokens. Confirm dark mode looks identical.
2. Append a new `/* ---------- LIGHT MODE TOKENS ---------- */` block at the bottom of `globals.css` with the `html[data-theme="light"] { … }` overrides listed in the bootstrap above.
3. Add a `body` override under light mode that consumes the new `--surface-bg` / `--surface-ink`.
4. In `src/app/layout.tsx`, replace the `INTRO_BOOT` constant (lines 41–57) with the merged `BOOT` source from PLAN.md §2.2. Update the `<script>` tag to use the new name.
5. Create `src/components/ThemeToggle.tsx` — client component per PLAN.md §6. Inline sun/moon SVGs. `aria-label` + `aria-pressed`. Hydration-safe placeholder on first render.
6. Add minimal `.theme-toggle` CSS to `globals.css` (under the existing nav block): button reset, 44×44 hit area, icon hover/active transitions, reduced-motion guard.
7. Import and mount `<ThemeToggle />` in `src/components/Header.tsx` inside `.nav-row` after the `.nav-cta` link.

**Acceptance:**
- `npm run dev` and visit `http://localhost:3000`. Dark mode looks visually identical to before this sprint (no regressions to logo intro, hero gradient, ambient layers).
- Click the toggle → page background flips to paper (`#f4f1ec`), body text turns ink. Ambient layers still look dark (expected — Sprint 2 handles those).
- Reload → theme persists (localStorage round-trip).
- Open in a private window with system set to light → first paint is light. Set to dark → first paint is dark. No FOUC either way.
- DevTools → `<html>` shows `data-theme="dark"` or `"light"` AND `data-intro="armed"|"done"` simultaneously. Toggle works without flicker.
- Keyboard: focus button with `Tab`, activate with `Space` and `Enter`. AT users see `aria-pressed` flip.
- `prefers-reduced-motion: reduce` (DevTools rendering tab): toggle icon rotation is suppressed; intro is `done` immediately as today.

**Done when:** Theme toggle is present in the header, persists across reloads, respects system preference on first visit, and the body surface color is the only ambient layer that changes between themes.

---

### Sprint 2: Ambient layer overrides
**Goal:** Make the ambient layers (stage-bg, stage-glow, stage-grain, slashes, floating mark) read correctly on the paper base while leaving dark mode unchanged.

**Files touched:**
- `src/app/globals.css`

**Context bootstrap (paste into new Claude Code session):**
> - Sprint 1 added: tokens, `body` light overrides, merged BOOT script, `<ThemeToggle />` in `.nav-row`. `html[data-theme]` is stamped pre-paint.
> - All overrides live in a single `/* ---------- LIGHT MODE ---------- */` block near the end of `globals.css`, all prefixed `html[data-theme="light"] …`. Cascade beats `!important` because the override block sits after the dark rules.
> - Glow recipe is LOCKED — copy exactly from PLAN.md §3.5–§3.6. Positions, drift animations, breathe identical. Only opacities drop and `::after` blend changes screen→multiply.
> - Stage-bg gradients (PLAN.md §3.2–§3.4) are full property replacements, not opacity tweaks. `::after` blend screen→multiply.
> - Stage-grain (PLAN.md §3.7): only `opacity: .07`. Soft-light blend stays.
> - Slashes (PLAN.md §3.8): `filter: invert(1) blur(.35px); mix-blend-mode: multiply;`. Per-slash opacities (s1=.11 … s5=.085) unchanged.
> - Floating mark (PLAN.md §3.9–§3.11): override `.floating-bg`'s `--fb-opacity` to `.10`; `.floating-bg__mark` filter recipe flips brightness; `.floating-bg__mark img` adds `invert(1)`; vignette switches to paper-alpha.
> - Do NOT touch animations, keyframes, or transform values. Only color, opacity, and blend mode of overridden selectors.

**Steps:**
1. Append the `/* ---------- LIGHT MODE ---------- */` block to `globals.css`. Inside it, add the overrides in the order: `.stage-bg`, `.stage-bg::before`, `.stage-bg::after`, `.stage-glow::before`, `.stage-glow::after`, `.stage-grain`, `.slash`, `.floating-bg`, `.floating-bg__mark`, `.floating-bg__mark img`, `.floating-bg__vignette`.
2. Copy the locked glow opacities verbatim from PLAN.md §3.5–§3.6. Triple-check the six numbers per side.
3. For `.slash`, override the base `filter` and `mix-blend-mode` only — don't repeat the per-variant opacity rules.

**Acceptance:**
- In light mode: backdrop is a warm paper gradient, not gray-blue. The stage-glow is still warm-amber/cream but subdued — should feel like sun-through-window, not flashlight-in-fog.
- The four slash decorations are visible as dark ink-tinted strokes against the paper backdrop (not invisible-on-white).
- The floating background logo reads as a soft gray ghost — never as a white-on-white invisible blob and never as a hard black silhouette.
- `stage-grain` is still subliminal noise (you should notice its absence if you `display:none` it, but not actively see it).
- Dark mode: visually identical to Sprint 1 acceptance.
- `prefers-reduced-motion: reduce`: glow snaps to opacity 1, animations off, but light-mode colors still correct.

**Done when:** All ambient layers render correctly in light mode and dark mode is unchanged.

---

### Sprint 3: Component overrides
**Goal:** Add light-mode overrides for nav, buttons, hero, sections, CTA card, about portrait card, footer, and the white-alpha holdouts uncovered in the audit (marquee text, hero scroll bar, page-loading label).

**Files touched:**
- `src/app/globals.css`

**Context bootstrap (paste into new Claude Code session):**
> - Sprints 1 and 2 are done: `html[data-theme="light"]` stamps pre-paint, body + ambient layers render correctly on the paper base.
> - The nav stays a dark glass plate in BOTH themes per PLAN.md §5 (logo strategy = option a). Light-mode nav override is only background opacity bump: `.nav { background: rgba(8,8,8,.55); border-bottom-color: rgba(10,10,10,.08); }` and `.nav.scrolled { background: rgba(6,6,6,.82); }`. The `.nav-cta` stays white-on-dark — no light-mode change.
> - Buttons (PLAN.md §4): `.btn-primary` flips background to `var(--ink)`, color to white. `.btn-ghost` and `.section-pill` swap their white-alpha borders/backgrounds for ink-alpha.
> - Hero (PLAN.md §4): `.hero::before` gradient flipped to paper scrim. `.hero h1` gradient flipped to ink. `.hero h1 em` (gold) unchanged. `.hero::after` (heroShadeDrift) — leave alone; its white-alpha shimmer is subtle on paper and changing it risks the animation.
> - CTA (PLAN.md §4): `.cta-card` background flipped to paper-on-gold, `::after` repeating-line lowered to ink-alpha, `::before` gold radials lowered.
> - About portrait card (PLAN.md §4): paper gradient, lowered shadow alpha.
> - Footer: only `.foot-shell { border-top-color: rgba(10,10,10,.10) }` — text colors follow `--mute`/`--line` from Sprint 1.
> - Audit holdouts: `.page-loading { color: rgba(10,10,10,.62) }`, `.marquee span { color: rgba(10,10,10,.55) }`, `.hero-scroll { color: rgba(10,10,10,.44) }`, and `.hero-scroll .bar { background: linear-gradient(180deg, rgba(10,10,10,.32), transparent); }`. The `.hero-scroll .bar::after` gold accent stays gold.
> - All overrides inside the `html[data-theme="light"]` block from Sprint 2.

**Steps:**
1. In the existing light-mode block, add the component overrides in this order: `.nav` / `.nav.scrolled`, `.btn-primary`, `.btn-ghost` (+ hover), `.section-pill` (+ hover), `.hero::before`, `.hero h1`, `.cta-card` / `.cta-card::before` / `.cta-card::after`, `.about-portrait-card`, `.foot-shell`.
2. Add the audit holdout overrides: `.page-loading`, `.marquee span`, `.hero-scroll`, `.hero-scroll .bar`.
3. Spot-check `.svc-row` borders, `.approach-grid` borders, `.quote` borders, `.metrics` borders, `.foot-bottom` — they should all already inherit `--line` correctly. If any hardcoded white-alpha border slipped through, override it now.

**Acceptance:**
- Light mode home page: dark nav over paper hero, ink heading with gold emphasis, ink ghost / primary buttons swapped to dark, gold CTA card on warm paper background, about portrait card with paper backdrop.
- The marquee and hero-scroll label are readable on paper (not white-on-white).
- The `Loading…` page (visible if you throttle network and navigate to `/about` for the first time) is readable in both themes.
- Dark mode: visually identical to Sprint 2 acceptance.
- Toggle the theme repeatedly — no flash of unstyled colors, no layout shift.

**Done when:** Every interactive surface and text block on `/`, `/about`, `/resources`, `/booking/discovery-call`, and `/signin` is legible in both themes.

---

### Sprint 4: Logo + animation regression pass
**Goal:** Verify every animation in PLAN.md §7 in both themes, fix any regression, and lock the visual design with the user.

**Files touched:**
- `src/app/globals.css` (only if a regression needs a fix)
- `src/components/ThemeToggle.tsx` (only if a11y polish needed)
- `docs/dark-mode/PLAN.md` (update the "Risks" table with verified status)

**Context bootstrap (paste into new Claude Code session):**
> - Sprints 1–3 are done. Theme toggle works, ambient + component layers render in both themes.
> - LogoMark renders four raster PNGs in `<svg><image>` — colors cannot be CSS-flipped. The nav stays a dark glass plate (`rgba(8,8,8,.55)` light, `rgba(8,8,8,.35)` dark), which is why the white logo and `logo-stroke-flash` (globals.css:906) need no override. Per PLAN.md §5.
> - The full regression checklist is PLAN.md §7. Walk each animation in BOTH themes. The high-risk ones (already flagged): `stage-glow-breathe` (brightness multiplier over lowered opacities), `fb-breathe` (reads light-mode `--fb-opacity: 0.10`), `mirrorSweep` (blend mode changed), `hero-slash-wipe` (inherits new `.slash` filter).
> - Touch dark mode `globals.css` rules only as a last resort. If a regression appears in dark, it's a Sprint 1–3 leak that needs the light override scoped tighter.

**Steps:**
1. `npm run dev`. Open `/` in both themes. Hard-reload to retrigger the intro: confirm `data-intro` cycles `armed → playing → morphing → fading → done` and the wipe + word slide + glow flash all run correctly in both themes.
2. Use DevTools Animations panel (or just watch) to verify each row of PLAN.md §7:
   - `brand-slide-in`, hero rise, `mirrorPulse`, `mirrorSweep`, `stage-glow-in/breathe/driftA/B`, `logo-stroke-flash`, `lr-wipe`, `lr-settle`, `page-loading-fade`, `page-loading-dot`, `fb-drift`, `fb-breathe`, `heroShadeDrift`, `hero-slash-wipe`, marquee `scroll`, hero-scroll `slide`.
3. For each, mark Verified or Regressed in the PLAN.md risks table (update the file).
4. For any regression: fix in `globals.css` by tightening the light-mode override. Do NOT modify animation keyframes — they are the contract.
5. Toggle theme mid-animation (e.g. during the intro on `/`): no broken state, no stuck phase, no console warnings.
6. Enable `prefers-reduced-motion: reduce` in DevTools. Toggle theme. Confirm:
   - `data-intro` → `done` immediately in both themes.
   - `.theme-toggle svg` does not rotate on hover.
   - Floating mark sits still in both themes.
   - Glow snaps to opacity 1 in both themes.
7. Final a11y polish: tab through `/`, confirm theme toggle is in tab order, has visible focus ring in both themes, `aria-pressed` flips.

**Acceptance:**
- All rows in PLAN.md §7 marked Verified.
- Toggling theme during intro on `/` produces no jank or stuck state.
- Reduced-motion + each theme renders correctly.
- `npm run build` succeeds with no new TypeScript / lint errors.
- User signs off on the light-mode appearance of the home page and at least one inner route.

**Done when:** Every flagged animation is verified in both themes, the user has signed off visually, and PLAN.md's risk table reflects the final verified status.
