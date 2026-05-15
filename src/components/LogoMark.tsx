/**
 * LogoMark — inline static logo in the header.
 *
 * Always renders the four stroke PNGs in their fully-settled state.
 * No animation; that's LogoIntro's job. The element exists in the
 * layout from frame one so anchor targets and FLIP measurement work.
 *
 * Sizing is owned by .logo-reveal in globals.css (aspect-ratio +
 * width via @container header queries → deterministic dimensions
 * before any image decodes → no CLS).
 *
 * Visibility during the intro phase is controlled by
 *   html[data-intro="playing"|"morphing"] .logo-reveal { opacity: 0 }
 * so the LogoIntro overlay can appear to "land" on this element.
 */

const STROKES = [
  { id: "lr-arc", src: "/brand/logo-arc.png" },
  { id: "lr-slash-1", src: "/brand/logo-slash-1.png" },
  { id: "lr-slash-2", src: "/brand/logo-slash-2.png" },
  { id: "lr-slash-3", src: "/brand/logo-slash-3.png" },
] as const;

export function LogoMark() {
  return (
    <div
      className="logo-reveal"
      data-phase="settled"
      aria-label="Aspirer Firm logo"
      role="img"
    >
      <svg
        className="logo-reveal__strokes"
        viewBox="0 0 590 527"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {STROKES.map(({ id, src }) => (
          <g key={id} className="logo-reveal__wipe" id={id}>
            <image href={src} width="590" height="527" />
          </g>
        ))}
      </svg>
    </div>
  );
}
