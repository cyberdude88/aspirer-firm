# Investigation: `/about` blank on soft navigation

## Problem

- Symptom: navigating to `/about` can render a blank or dark page.
- Repro path: start at `http://localhost:3000/#services`, then click `About`.
- Expected: `/about` paints its normal hero, cards, and quotes.
- Actual: URL changes to `/about`, but the page body appears blank until a hard refresh.

## Known Facts

- A hard refresh on `/about` renders correctly.
- The app has a shared `src/app/loading.tsx` fallback.
- The `/about` page contains many elements with the `.reveal` class.
- `src/components/RevealScripts.tsx` adds the `.in` class that makes `.reveal` content visible.

## Working Theory

- Current best hypothesis: the reveal logic runs before the real `/about` DOM is mounted during client-side navigation.
- Why it fits: the page is not missing, but it looks visually empty, which matches hidden `.reveal` content.
- What would disprove it: if `.reveal` nodes already exist and still get `.in` during the failing navigation.

## Elimination Log

### Iteration 1

- Hypothesis: `/about` itself is broken server-side.
- Check: compare hard refresh behavior with soft navigation behavior.
- Result: hard refresh renders the full page correctly.
- What changed in understanding: the route can render correctly; this is not a base SSR failure.
- Next move: focus on client-side behavior during navigation.

### Iteration 2

- Hypothesis: the route or assets are missing on navigation.
- Check: verify that the URL changes to `/about` and that the page works on direct load.
- Result: navigation reaches `/about`, and direct load works.
- What changed in understanding: this is not a missing-route or missing-asset class of problem.
- Next move: inspect client-only code that changes visibility after mount.

### Iteration 3

- Hypothesis: the theme changes are hiding the page.
- Check: compare the symptom with the page structure and the visibility system.
- Result: `/about` is composed of many `.reveal` elements that start hidden until JS marks them visible.
- What changed in understanding: the blank page is more consistent with unrevealed content than with a pure theme-color regression.
- Next move: inspect when `RevealScripts` runs relative to route transition timing.

### Iteration 4

- Hypothesis: `RevealScripts` scans too early on soft navigation.
- Check: read `src/components/RevealScripts.tsx` and confirm it runs its query in `useEffect(..., [pathname])`; read `src/app/loading.tsx` and confirm a transition fallback exists.
- Result: both conditions are true.
- What changed in understanding: there is a plausible timing gap where pathname changes, the loading UI mounts, the reveal scan finds little or nothing, and the real `/about` content appears afterward.
- Next move: treat reveal timing as the lead diagnosis and document the expected fix shape.

## Narrowed Cause

- Most likely root cause: `RevealScripts` performs a one-time `.reveal` scan tied to pathname changes, but client-side navigation can temporarily mount `loading.tsx` before `/about` content exists.
- Why this is now the lead explanation: it explains why hard refresh works, why soft navigation fails, and why the page looks blank instead of broken.
- What is still unproven: the exact reveal-node count during the failing transition should still be confirmed with logging or DOM inspection.

## Fix Options

1. Rescan after route content mounts.
   Tradeoff: simple, but easy to regress if mount timing changes again.
2. Observe for newly mounted `.reveal` nodes with a `MutationObserver`.
   Tradeoff: slightly more machinery, but resilient to Suspense/loading timing.

## Decision

- Chosen fix direction: use a `MutationObserver` in `RevealScripts` so late-mounted `.reveal` nodes are observed and revealed.
- Why: it directly addresses the timing gap instead of relying on a single pathname-triggered scan.
- Follow-up validation: reproduce from `/#services`, confirm `.reveal` nodes receive `.in`, and verify `/about` no longer paints blank on soft nav.

## Reusable Lesson

- What signal should we recognize faster next time: if hard refresh works and soft nav looks blank, inspect visibility and mount-timing code before assuming route or asset failure.
- What guardrail or instrumentation should be added: temporary logging for reveal-node counts on navigation, or a small helper that handles post-Suspense DOM arrivals consistently.
