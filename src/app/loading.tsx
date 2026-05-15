/**
 * Root loading UI. Next.js renders this automatically as a Suspense
 * fallback for any route segment under app/ that hasn't shipped its
 * own loading.tsx. The animation is pure CSS so there's no JS waiting
 * to hydrate — the placeholder is interactive (visible) on first paint.
 */

export default function Loading() {
  return (
    <div className="page-loading" role="status" aria-live="polite">
      <span className="page-loading__label mono">Loading</span>
      <span className="page-loading__dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="sr-only">Loading content</span>
    </div>
  );
}
