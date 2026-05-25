# Handoff — Header / Hero Redesign (landscape + desktop)

_All changes live in `src/app/globals.css`. No JS/markup changed. Verify with `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/` → `200`._

## The layout

Desktop **and** short landscape phones now share one header/hero design (a portrait phone keeps its own stacked layout).

```
┌─ nav (3-col grid: 1fr · auto · 1fr) ───────────────────────────┐
│ APPROACH                                                        │
│ SERVICES   [logo]  ASPIRER FIRM (black, white neon glow)  [Book │
│ VOICES                + reflector-pool reflection          a Call] [☾]
│ ABOUT  ← 2×2 pills, far left          centered               right
├─────────────────────────────────────────────────────────────────┤
│  Mindset coaching for the builders…   (tagline)                  │
│  Private, evidence-based mindset work…(subhead)                  │
│                                                                  │
│              LICENSED MENTAL HEALTH PROFESSIONAL  ← floated low   │
└─────────────────────────────────────────────────────────────────┘  hero = 100svh
```

## Where it lives in globals.css

- **Shared block** — `@media (max-height:560px) and (orientation:landscape), (min-width:821px)`
  Grid nav, centered logo+wordmark, neon glow + reflection, far-left 2×2 link cluster, full-screen hero, eyebrow floated to bottom, secondary hero bits hidden.
- **Desktop refinement** — `@media (min-width:821px) and (min-height:561px)`
  Same selectors, larger type/logo/CTA + wider glow. Excludes short landscape phones (they keep the compact sizes).
- **Global pill styling** — `.nav-links a` (quiet pills) and `.nav-cta` (Book a Call) near line ~370.

## Tuning knobs

| Want to change | Edit | Notes |
|---|---|---|
| Wordmark glow strength/color | `.brand-word-hero .brand-line-*` `text-shadow` | White; falls away on the light day theme (white-on-light). |
| Reflection length/strength | `.brand-word-hero` `-webkit-box-reflect` | Chrome/Edge/Safari only; Firefox skips it. |
| Logo size | `.nav .logo-reveal{--lr-width}` | 50px landscape; `clamp(64–96px)` desktop. Drives bar height. |
| Wordmark size | `.brand-word-hero .brand-line-*` `font-size` | clamp; desktop ceiling 86px. |
| Gap below the bar | `section.hero{padding-top}` | Must clear the bar (logo height). |
| Eyebrow position | `.hero .hero-eyebrow{margin-top}` | `auto` floats it to the bottom; a fixed value tucks it under the subhead. |
| Link cluster side | `.nav-links{justify-self}` | `start` = far left, `end` = beside logo. |

## Watch-outs

- **Source order:** base `.hero` / `.brand-word-hero` rules sit *after* the media blocks, so overrides use bumped specificity (`section.hero`, `.hero .hero-*`). Keep that or they get clobbered.
- **Containing block:** the nav's `backdrop-filter` makes it the containing block for any `position:fixed` children — don't reintroduce `bottom:` on `.nav-links`.
- **Portrait phones** (`max-width:820px`) are unaffected by the shared block; they get the pill styling only.
- Not deployed: `vercel --prod` from the project root (no auto-deploy from GitHub).
