# Handoff — Logo Intro + Header Mark

Context to pass to the next agent (Codex, etc.) so it can pick up without re-reading the full Claude Opus session.

## How to use this file

Open a fresh shell in this repo, start your other agent (e.g. Codex), and paste the relevant section under **Prompts for the next agent** verbatim. Do not paste the whole file — pick the one task you want done next.

```bash
cd /home/alex/projects/aspirer-firm
codex                                  # or your other agent CLI
# then paste one of the prompt blocks below
```

The dev server is already running in the background on `http://localhost:3000`. Reload in an **incognito window** to see the intro animation (regular tabs have `sessionStorage["aspirer:intro-played"] = "1"` set).

---

## Current state

### What works
- Dev server compiles clean (`next dev`, Next 14.2.35).
- Anchor links (`/#approach`, `/#services`, `/#voices`) use `--nav-h` measured by `ResizeObserver` so scroll offsets stay correct as the nav resizes.
- Logo assets live at `public/brand/` (logo-arc.png + 3 slashes + composite logo.png / logo-tight.png).
- Container queries on `.nav` (`container-name: header`) drive `.logo-reveal` sizing — `@container header (...)` in `globals.css`. Putting the container on `.brand` collapsed the wordmark (known trap, called out in comments).
- ASPIRER FIRM wordmark slide animation restored — it was never deleted; the disappearance was a side effect of putting `container-type` on `.brand`. Removing that fixed it.

### Component map
- `src/components/LogoMark.tsx` — inline static logo in the header. Renders the 4 stroke PNGs settled. No animation.
- `src/components/LogoIntro.tsx` — fullscreen overlay. Plays wipe (≈1700 ms), then FLIP-morphs to the LogoMark's bounding rect (~700 ms), then fades out (~300 ms). Plays once per session (`sessionStorage["aspirer:intro-played"]`). Coordinates with `LogoMark` via `html[data-intro="playing"|"morphing"|"done"]`.
- `src/components/Header.tsx` — uses `<LogoMark />`.
- `src/app/layout.tsx` — mounts `<LogoIntro />` after `<Footer />`.
- `src/app/globals.css` — all logo styles inside `@layer brand-reveal { … }`. Search for `LOGO REVEAL` and `LOGO INTRO` headers.

### Skill
- `.claude/skills/responsive-css/SKILL.md` documents the @layer + custom properties + container queries + deterministic-layout + backdrop-filter pattern used here.

## Day / night theme sprint — IN PROGRESS (2026-05-19)

Toggle wiring is solid (`src/components/ThemeToggle.tsx`, boot script in `src/app/layout.tsx`, lives at top-right of nav via `Header.tsx:25`). The bug was that the design system was dark-only — most of the page hardcoded `rgba(255,255,255,.X)` and `#fff` rather than using tokens. Migration in progress in `src/app/globals.css`.

### Done
- Added full token taxonomy to `:root` and `html[data-theme="light"]`:
  - `--text-strong / -soft / -muted / -faint`
  - `--chrome-bg-1/2/3` and `--chrome-border-1/2/3` (translucent surface chrome)
  - `--cta-solid-bg / -fg` (inverting primary CTA — flips white/black between modes)
  - `--scrim-soft / -mid / -deep`
  - `--hero-grad-1/2/3` (hero h1 background-clip gradient stops)
  - `--floating-logo-invert` (0 in dark, 1 in light; used by `.floating-bg__mark img` filter so `logowhite.png` reads as a dark ghost on paper)
- Fixed explicit-white bug at `.brand-line-sub` ("FIRM") → now `var(--text-strong)`.
- Migrated to tokens: hero h1, hero-sub, hero-meta, hero-eyebrow, hero-scroll, nav-links, nav-cta, theme-toggle, section-pill, btn-primary, btn-ghost, ap-icon, svc-row, svc-arrow, quote, check, show-stats, metric, metrics bg, foot a, foot-legal-link, legal-nav, legal-card, legal-pre. Plus `.nav` border-bottom → `var(--line)`.

### Outstanding (in priority order)
1. **Visual QA pass.** Compiles clean (all routes 200, no warnings) but a human still needs to toggle at `/`, `/privacy`, `/terms`, `/confidentiality`, `/about`, `/booking` and look for residual white-on-white or dark-on-dark contrast failures.
2. **Skipped intentionally:** drop-shadows (`rgba(0,0,0,.X)` reads fine on both bg colors); mask-image `#000` (alpha mask, not visible color); LogoIntro glow drop-shadows (cosmetic, intro-only). The intro overlay background stays `#0a0a0a` even in light mode — intentional: the wipe always plays against dark.

### Done in this pass (2026-05-19, continuation)
- `--nav-bg` + `--nav-bg-scrolled` tokens added to both `:root` and `html[data-theme="light"]`; replaced hardcoded `rgba(6,6,6,.7)` on `.nav.scrolled`.
- New `LIGHT MODE — surface + decorative overrides` block appended at end of globals.css, covering: `.stage-bg`, `.stage-bg::before/::after`, `.stage-glow::before/::after`, `.stage-grain`, `.slash` (multiply + invert), `.logo-reveal__strokes image` (invert), `.hero::before/::after`, `.hero-bars`, `.strip`, `.marquee span`, `.ap-card` + `:hover`, `.show-visual` + `::before`, `.show-visual-shade`, `.quote` + `:hover`, `.avatar`, `.about-portrait-card` + `-media` + `-shade`, `.cta-card` + `::before/::after`, `.floating-bg__vignette`.
- Verified: all 6 routes return 200; CSS compiles with no warnings.

### Audit reference
- Original audit found 113 hardcoded white/black uses across globals.css.
- Token names live in `:root` (~lines 20–55) and `html[data-theme="light"]` (~lines 1340–1370). Update both whenever you add a new token.
- The `data-theme` boot script in `layout.tsx:44-68` sets `<html data-theme>` synchronously before paint — no FOUC. `localStorage` key is `af-theme` (values: `light` | `dark`).

---

## Outstanding / nice-to-have

1. **Visual QA of the morph.** The FLIP math translates the source box's center to the target box's center and scales by `target.width / source.width`. If the source box's aspect-ratio differs from the target's at any breakpoint, the morph will misalign. Both currently use `aspect-ratio: 590/527`, so they should match — verify by recording the intro in incognito and stepping frame-by-frame.
2. **Orphan cleanup.** `src/components/Logo.tsx` is no longer imported by anything. Delete it.
3. **Tune dismiss timing.** Current handoff between LogoIntro fade-out (300 ms) and LogoMark fade-in (220 ms) leaves an 80 ms overlap. If you see a visible blink, narrow it.
4. **Reduced-motion path.** Reduced-motion users see the inline LogoMark from the start (overlay never mounts). Verify by setting OS-level reduce-motion and reloading in incognito.
5. **Mobile nav stacking.** On `<820 px` the nav goes column (`.brand` becomes column-flex). FLIP target's `.left`/`.top` will be small numbers — verify the morph still feels right.

## Where to make common changes (no full-file scans needed)

| Want to change… | Edit |
| --- | --- |
| Wipe / settle timings | CSS vars `--lr-*` and `--li-*` in `.logo-reveal` / `.logo-intro__box` in `globals.css` |
| Morph duration | `T_MORPH_DUR` in `LogoIntro.tsx` + matching `transition: transform 700ms` in `.logo-intro__box` |
| Dismiss duration | `T_DISMISS_DUR` in `LogoIntro.tsx` + `transition: opacity 300ms` on `.logo-intro` |
| Header logo size by breakpoint | `@container header (...)` blocks in `globals.css` (search for `--lr-width:`) |
| Anchor scroll offset (gap below nav) | `--anchor-gap` on `:root` in `globals.css` |
| Replay the intro on next reload | DevTools → Application → Session Storage → delete `aspirer:intro-played` |

---

## Prompts for the next agent

Each block is self-contained. Paste one at a time.

### Prompt A — verify the intro and tune any drift

```
You're continuing work on /home/alex/projects/aspirer-firm. A logo intro plays once per session as a fullscreen wipe, then morphs (FLIP transform) to the inline header logo. Files involved:

- src/components/LogoIntro.tsx (fullscreen overlay; computes FLIP target)
- src/components/LogoMark.tsx (inline header logo; FLIP target)
- src/app/globals.css — search for "LOGO REVEAL" and "LOGO INTRO" headers

The dev server is already running on http://localhost:3000.

Task:
1. Force-replay the intro: in a Node script, hit the page and verify markup includes `.logo-intro` with `data-phase="armed"`. Then visit in a real browser (incognito) and watch the morph.
2. If the morph misaligns the logo with the header slot at any breakpoint, the bug is either (a) source/target aspect-ratio mismatch — both should be 590/527 — or (b) the target measurement firing before the nav has finished layout. Fix whichever is broken.
3. Confirm the ASPIRER FIRM wordmark slide animation still runs (search for `brand-slide-in` keyframes).
4. Delete src/components/Logo.tsx — it is unreferenced.

Don't restructure the CSS layer order or move the container query off of .nav.
```

### Prompt B — make the morph land on a different target

```
Continuing work on /home/alex/projects/aspirer-firm. The logo intro currently morphs to .nav .logo-reveal (the inline header LogoMark). I want it to morph to <NEW SELECTOR HERE — e.g. the hero section's logo slot>.

Edit src/components/LogoIntro.tsx — find the `document.querySelector(".nav .logo-reveal")` line in the useEffect and replace the selector. Verify the inline mark visibility-coordination in globals.css (html[data-intro=...] rules) still hides only what should be hidden during the morph; update those selectors to match.

Don't change the timeline constants or break the sessionStorage gate.
```

### Prompt C — replace the wipe with a different reveal style

```
Continuing work on /home/alex/projects/aspirer-firm. The intro currently plays a bottom-to-top wipe on four stroke PNGs (arc + 3 slashes). I want to swap it for <NEW STYLE — e.g. fade-in, scale-up, draw-on stroke>.

Edit globals.css blocks under "LOGO INTRO" — specifically the keyframes `lr-wipe` and the four `.logo-intro[data-phase="playing"] #li-* { animation: ... }` rules. Keep the timeline: ~700 ms initial reveal, then settle by 1700 ms total, before the morph kicks in.

Don't touch LogoIntro.tsx unless the new style needs different DOM. Don't change the FLIP math.
```

### Prompt D — tune the anchor scroll offsets

```
Continuing work on /home/alex/projects/aspirer-firm. Anchor links (#approach, #services, #voices) use scroll-margin-top: calc(var(--nav-h) + var(--anchor-gap)) where --nav-h is measured at runtime by ResizeObserver in src/components/RevealScripts.tsx. --anchor-gap is on :root in globals.css.

Task: <ADJUST as needed — e.g. "increase the gap to 32px", "verify --nav-h updates on viewport resize", etc.>

The measurement code is in the useEffect of RevealScripts; the CSS is in globals.css near the top of the file (search for "--nav-h").
```

---

## Anti-context-pollution rules for the next agent

- The CSS is large (>800 lines). Don't read it top to bottom — `grep -n` for the marker headers (`LOGO REVEAL`, `LOGO INTRO`, `.nav{`, `.brand`, `brand-slide-in`).
- `globals.css` uses `@layer brand-reveal { … }` for all logo styles. Unlayered rules win — don't fight specificity with `!important`; either put your override outside the layer or amend the rule inside it.
- Container queries live on `.nav`, not `.brand`. Do not move them back — it collapses the wordmark.
- Do not change `aspect-ratio: 590/527` on `.logo-reveal` or `.logo-intro__box` — it's load-bearing for CLS prevention and FLIP alignment.
