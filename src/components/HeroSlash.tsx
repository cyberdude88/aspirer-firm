/**
 * HeroSlash — decorative slash-3 wipe on the hero.
 *
 * Renders the third stroke component PNG inside the same SVG
 * wipe-group pattern from the v5 intro spec, but as a single
 * standalone element scaled to fit the hero (not fullscreen).
 *
 * The wipe-up animation is paused by default and triggered when
 * html[data-intro] flips to "morphing" or "done" — so it doesn't
 * play hidden behind the intro overlay on first session loads.
 *
 * Sizing is owned entirely by .hero-slash in globals.css (clamp
 * width + aspect-ratio: 590/527 to keep the stroke's geometry).
 *
 * Pure presentation: pointer-events:none, aria-hidden.
 */
export function HeroSlash() {
  return (
    <div className="hero-slash" aria-hidden="true">
      <svg
        className="hero-slash__strokes"
        viewBox="0 0 590 527"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <g className="hero-slash__wipe">
          <image href="/brand/logo-slash-3.png" width="590" height="527" />
        </g>
      </svg>
    </div>
  );
}
