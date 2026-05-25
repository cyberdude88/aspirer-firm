---
name: responsive-css
description: Modern framework-free responsive CSS pattern used in this repo — @layer + CSS custom properties + container queries (@container) for component-scoped responsiveness, deterministic layout (no CLS), and explicit blur stacking via backdrop-filter. Trigger when adding or refactoring any component that needs to be responsive, when CLS / FOUC / layout shift comes up, when stacking content over a blurred surface, or when migrating away from Tailwind utilities.
---

# Responsive CSS in this codebase

This project uses **vanilla CSS** (no UnoCSS / Panda / vanilla-extract) plus a small, opinionated pattern. Use this skill when authoring any new responsive component or fixing a layout bug.

## The four rules

### 1. Cascade is explicit via `@layer`

Author component CSS inside a named layer (`@layer brand-reveal { .logo-reveal { … } }`). Unlayered rules win against layered ones, so anyone overriding a component's visuals from outside the layer can do so without `!important` or specificity hacks.

When the codebase grows past a couple of layers, declare the order explicitly at the top of `globals.css`:

```css
@layer reset, tokens, base, components, brand-reveal, overrides;
```

Currently only `brand-reveal` exists. Add the order declaration when adding the second layer.

### 2. Design tokens live in CSS custom properties

Local component tokens — timing, sizing, easing — go on the component root:

```css
.logo-reveal {
  --lr-arc-dur: 700ms;
  --lr-ease-arc: cubic-bezier(0.65, 0, 0.35, 1);
  --lr-width: clamp(96px, 14vw, 160px);
}
```

This is the tunable surface. Don't bury magic numbers in keyframe blocks.

### 3. Container queries, not viewport queries (for components)

Viewport `@media` queries are still fine for **page layout**. For **components**, use container queries so the component responds to its actual rendered slot, not the window. Pattern:

```css
.brand {                     /* the container — usually the component's parent */
  container-name: brand;
  container-type: inline-size;
}

@container brand (max-width: 480px) {
  .logo-reveal { --lr-width: clamp(72px, 22cqi, 108px); }
}
@container brand (min-width: 901px) {
  .logo-reveal { --lr-width: clamp(120px, 12cqi, 168px); }
}
```

Use `cqi` / `cqb` units for container-relative sizing. The component's own size adapts to a sidebar layout, drawer, or mobile nav with zero changes to viewport breakpoints elsewhere.

### 4. Deterministic layout — reserve space before paint

Anything that loads asynchronously (images, web fonts, dynamic blocks) **must** reserve its final dimensions before content loads. Otherwise you get CLS.

For media:

```css
.logo-reveal {
  width: var(--lr-width);
  aspect-ratio: 590 / 527;   /* known at parse-time, before PNG decodes */
}
```

For animated reveals: never gate visibility with `display:none` or `visibility:hidden` that *changes the box*. Instead animate properties that don't affect layout (`transform`, `opacity`, `filter`, child clip transforms). SSR markup should match the final, settled visual state so first paint matches subsequent paints.

For dynamic content blocks: prefer `min-block-size` or a known `aspect-ratio` skeleton over loading-spinner-then-content.

## Blur stacking — `backdrop-filter`, never `filter:blur` on content

When you want content to look frosted/blurred, the blur belongs to an **overlay layer**, not to the underlying content:

```css
/* ✅ overlay layer carries the blur; underlying content stays sharp in the DOM */
.nav {
  position: fixed; inset-block-start: 0; inset-inline: 0;
  z-index: 50;
  background: rgba(6, 6, 6, 0.55);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
}

/* ❌ blurring the underlying element destroys its accessibility / selection */
.hero { filter: blur(16px); }
```

Rules:

- Define **explicit `z-index`** on every blur layer.
- Define **explicit bounds** (`inset:0` or anchored `inset-block-start` / `inset-inline`) so the blur region is resolvable at parse-time, not measured at runtime.
- Document which elements sit "under the blur" in a comment near the blur declaration. Example: `/* under-blur: .stage-glow, .slashes, .hero */`.
- The one acceptable use of `filter:blur` on content is **purely decorative background layers** (no text, no interactive elements, `pointer-events:none`). The existing `.stage-glow` and `.slashes` are correct examples.
- Always pair `backdrop-filter` with the `-webkit-` prefix for Safari.

## Reduced motion

Every animated component must have a `@media (prefers-reduced-motion: reduce)` block that snaps to the final visual state with `animation:none` and no transitions. Reduced-motion users should not see the staged reveal at all — they see the settled output from frame one.

## In this repo

- Logo reveal animation: `src/components/LogoReveal.tsx` + `.logo-reveal*` in `src/app/globals.css` (inside `@layer brand-reveal`).
- Container declared on `.brand` (in `globals.css`).
- Nav backdrop blur: `.nav` (`z-index:50`, explicit bounds).
- Decorative blur layers: `.stage-glow`, `.slashes` (z-index:-1/-2, pointer-events:none).

## When NOT to use this skill

- For a one-off media query on page-level layout, plain `@media` is fine.
- Don't introduce a new component-scoped query container if the component already inherits a usable one from a parent — query containers cascade.
- Don't migrate working Tailwind utility blocks just for purity; only convert when you're already rewriting the component.
