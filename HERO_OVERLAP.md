# Known Issue: Hero / Nav Overlap

Last touched: 2026-05-12 (parked — pick up later)

## Symptom

The fixed top nav (the big editorial logo + nav links) keeps covering the top of body text in different ways depending on viewport. Reported instances:

- Anchor jumps (`/#voices`, etc.) land with the section heading hidden behind the nav.
- On some viewports the heading visually "loses its top" — first line ascenders sit under the nav's translucent backdrop.
- Recurs after layout / brand-mark sizing changes — every time the logo is resized or padding is tweaked, the effective nav height drifts and the offset goes stale.

## Why It Keeps Coming Back

The nav is `position:fixed` and its actual rendered height is **derived** from:

1. `.nav` padding (different in default vs `.scrolled` state)
2. `.brand-mark` height (currently `292px` desktop / `148px` mobile)
3. Negative margins on `.brand > .brand-mark` (currently `-52px -18px -80px 0` desktop)
4. Whether the nav is in default or `.scrolled` state when the user lands

Several constants are duplicated across the codebase and none of them are computed from the real nav height:

| Constant | Value | File:Line | Purpose |
|---|---|---|---|
| `html { scroll-padding-top }` | `240px` desktop / `180px` mobile | `src/app/globals.css:18,20` | Anchor-jump offset |
| `section[id] { scroll-margin-top }` | `240px` / `180px` | `src/app/globals.css:19,20` | Belt-and-suspenders for the above |
| `main { padding-top }` | `170px` | `src/app/globals.css:375` | Space below nav on inner pages |
| `.brand > .brand-mark { height }` | `292px` (desktop), `148px` (mobile) | `src/app/globals.css:165,244` | Logo size driving nav height |
| Hero top padding (signin) | `190px 0 120px` inline | `src/app/signin/page.tsx` | Per-page offset |

Each time the logo or nav padding changes, these three+ numbers fall out of sync.

## What's Been Tried So Far

- **2026-05-12** — Added `html { scroll-padding-top: 190px }` + mobile override (140px) to fix `/#voices` anchor jump hiding the heading under the nav. User then bumped to `240px / 180px` and added `section[id] { scroll-margin-top }` as a second layer. Deployed in `aspirer-firm-q49cposlf`. **This is the current state on production.** Resolves the anchor-jump case but doesn't address the underlying drift problem.

## What Has NOT Been Verified

- Whether the `.scrolled` (compact) nav height is smaller than 240px — if so, jumps mid-scroll waste vertical space.
- Mobile (≤820px): real nav height when expanded with `flex-direction:column` and 8px gap. The 180px guess may be wrong in either direction.
- Whether `main { padding-top: 170px }` on inner pages (about, signin, admin, booking) still lines up — the signin page uses its own `190px` and others may differ.
- Whether reduced-motion users see anything different (animations off but layout the same?).

## Pages / Anchors To Sanity-Check When Resumed

- `/#voices`, `/#approach`, `/#book` — homepage anchors
- `/signin` — has its own `190px` top padding
- `/admin/bookings` — relies on `main { padding-top: 170px }`
- `/booking/[service]` — long form, first heading position
- `/about` — has a portrait card that previously clipped under the nav
- `/resources/[slug]` — long-form content top

Test viewports: desktop ≥1280px, laptop ~1024px, tablet ~768px (just above breakpoint), mobile 390px (iPhone-ish), mobile 360px (smallest common).

## Proper Fix (Future)

The recurring nature means the magic-number approach is wrong. Options, roughly ordered by effort:

1. **Measure once, expose via CSS variable.** A small effect in `Header.tsx` (or `RevealScripts.tsx`) reads `document.querySelector('.nav').getBoundingClientRect().height`, writes it to `document.documentElement.style.setProperty('--nav-h', `${h}px`)`, and updates on resize / scrolled-state toggle. Then `scroll-padding-top: calc(var(--nav-h) + 24px)` and `main { padding-top: calc(var(--nav-h) + 16px) }` stay correct automatically.
2. **Shrink the logo.** The 292px brand-mark with negative margins is the root cause of how tall the nav is. A more conventional ~96–120px logo would let everything go back to standard nav heights (~80px), and the magic numbers would matter less.
3. **Make the nav not fixed at all.** Use `position:sticky` only after a scroll threshold (already partially the `.scrolled` state). Skips the overlap problem on initial landing.

Recommend option 1: smallest change, kills the whole class of bug.

## Files Likely To Touch

- `src/app/globals.css` — `html`, `section[id]`, `.nav`, `.brand-mark`, `main`
- `src/components/Header.tsx` — if going the CSS-variable route, instrument here
- `src/components/RevealScripts.tsx` — alternate place to put the measure-and-set effect
- Inline `padding-top` in `src/app/signin/page.tsx` (and any other page that hard-codes a top inset)

## Quick Manual Repro

1. Open https://aspirer-firm.vercel.app/ on the affected device.
2. Click any nav link that targets a hash, or paste a URL like `/#voices`.
3. Note whether the section heading is fully visible below the nav, or whether its top is covered / clipped.
4. Resize viewport or rotate device — recheck.

If covered: the offset is too small. If there's a big white gap: the offset is too big.
