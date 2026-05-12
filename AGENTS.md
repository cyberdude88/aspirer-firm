# AGENTS.md — instructions for any AI agent (Codex / Claude / etc.) editing this project

Read this file in full before touching code. Front-end integrity rules are mandatory.

## 0. What this is

Aspirer Firm marketing site (Next.js 14 App Router + TS + Tailwind). Brand:
**Mindset Coaching for Entrepreneurs · Licensed Mental Health Professional**, founded by
Marie Cook. Backend integrations stubbed: **Supabase · Stripe · Google Calendar / OAuth**.

## 1. Stack (do not change without asking the human)

- Next.js **14.2.x** (App Router, TS, src/, Tailwind, ESLint).
- Node **18.19.x** is the dev environment — Next 15+ requires Node 20, do NOT upgrade Next.
- Fonts: `Poppins` (display/body) + `JetBrains_Mono` (`.mono`) via `next/font/google` in `src/app/layout.tsx`. Don't add the raw Google Fonts `<link>` tag.
- No CSS framework beyond Tailwind. Bespoke visual system lives in `src/app/globals.css` (class names like `.nav`, `.hero`, `.svc-row`, `.cta-card`, `.reveal`, etc.).

## 2. Visual system — DO NOT BREAK

The site uses a dark, gold-accented, animated design ported from a user-supplied HTML reference.

### Tokens (CSS variables in `:root` in `globals.css`)
- `--ink: #0a0a0a` background
- `--gold: #c9a875` accent (used sparingly — eyebrows, section tags, CTAs, brand mark glow)
- `--mute: rgba(255,255,255,.55)` secondary text
- `--line: rgba(255,255,255,.10)` borders

### Non-negotiable visual elements
1. **Fixed nav** (`#nav` with class `.nav`) at top. JS in `RevealScripts.tsx` adds `.scrolled` class when `window.scrollY > 12`. Keep both.
2. **Backdrop layers** in `<body>`: `.stage-bg` (radial gradients), `.slashes` (3 animated diagonal sheens), `.stage-grain` (SVG turbulence). All three must remain on every page.
3. **Hero** uses gradient text-clip on `h1`, gold-gradient on `<em>`. Don't replace with plain color.
4. **Marquee strip** — terms drawn from `firm.ts > MARQUEE_TERMS`. Animation is pure CSS, infinite scroll. Duplicate the list twice in JSX so the loop is seamless.
5. **`.reveal`** class + IntersectionObserver in `RevealScripts.tsx` powers scroll-in animations. Sprinkle `.reveal`, `.reveal.d1`, `.reveal.d2`, `.reveal.d3` on entry blocks.
6. **Approach cards** (`.ap-card`) have a mouse-tracked spotlight (CSS vars `--mx`, `--my` set in JS). Don't strip the JS or the `::before` rule.
7. **CTA card** has two layered radial gradients + a repeating diagonal line pattern. Keep `::before` and `::after` rules.

### Brand mark
- Always render via `<Logo />` (`src/components/Logo.tsx`), which loads `/public/aspirer-firm-logo.svg`.
- Source SVG is the user-vectorized logo. Do not replace with inline SVG or an AI-generated alternative.
- Keep `<Image priority />` so it doesn't flash on first paint.

### Typography rules
- All headlines use Poppins via `var(--font-poppins)` (set on `body`). No serif anywhere.
- `.mono` class = JetBrains Mono. Use ONLY for eyebrows, section tags, numbered captions, footer fine print.

## 3. Data sources of truth

Edit content in these files. Pages consume them — never hard-code brand strings in components.

| File | Holds |
|---|---|
| `src/lib/firm.ts` | brand strings, contact, focus areas, who-i-help, free resources, insight themes, metrics, testimonials, approach steps, marquee terms, social URLs |
| `src/lib/services.ts` | service catalog (slug, title, durationMin, category, blurb). `getService(slug)` + derived `CATEGORIES` |
| `src/lib/stripe.ts` | `slug -> env.STRIPE_PRICE_*` map. Add new slugs HERE when you add new services |
| `src/lib/supabase.ts` | browser / server / admin clients (don't import admin client from the browser bundle) |
| `src/lib/google.ts` | Calendar OAuth2 client + `listFreeSlots` + `createBooking` |
| `src/lib/booking.ts` | shared booking-window, overlap, and slot-generation logic for request queue |
| `src/lib/admin.ts` | `ADMIN_EMAIL` checks and admin session guard |

If the user gives you new content (e.g., a new FB post, a new tagline), update the lib file — never the JSX.

## 4. Routes

| Path | What it does |
|---|---|
| `/` | Hero, marquee, approach, showcase, services, metrics, voices, CTA |
| `/about` | About Marie + approach detail + who-i-help anchors |
| `/booking` | Service list grouped by category |
| `/booking/[service]` | Client component: fetches `/api/availability?slug=…`, shows slots, POSTs to `/api/bookings` |
| `/booking/requested` | Confirmation page after a request is queued |
| `/admin/bookings` | Admin queue. NextAuth Google sign-in + `ADMIN_EMAIL` allowlist. Approve/deny pending requests. Gated by `src/middleware.ts`. |
| `/resources` | Free resources index |
| `/resources/[slug]` | Resource detail + email-capture form → `/api/resources/request` |
| `/api/availability` | GET: generated 9–5 weekday slots in `BUSINESS_TZ`, 90-day horizon, minus pending/approved rows from `booking_requests` |
| `/api/bookings` | POST: creates a pending `booking_requests` row with `slug`, `duration_min`, contact info, and selected slot |
| `/api/admin/bookings/decide` | POST `{id, decision: approve\|deny}` → updates row status and decision metadata |
| `/api/stripe/checkout` | POST → Stripe Checkout Session |
| `/api/stripe/webhook` | POST → creates calendar event + Supabase `bookings` row |
| `/api/resources/request` | POST → Supabase `resource_requests` row |
| `/api/auth/[...nextauth]` | NextAuth Google provider. Current admin gate is `ADMIN_EMAIL`; broader visitor sign-in is not surfaced in the UI yet. |

## 5. Env vars

See `.env.local.example`. Real keys go in `.env.local` (gitignored). Service slugs and env names must stay in sync — if you rename a service, rename its `STRIPE_PRICE_*` and update `lib/stripe.ts`.

Supabase client key note:
- `src/lib/supabase.ts` accepts either `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` for the browser/server public client.
- `SUPABASE_SERVICE_ROLE_KEY` is still required for server-side writes in booking/admin/resource routes.

Supabase MCP note for future agents:
- Codex remote MCP must be enabled in the user config:
  ` [mcp] `
  ` remote_mcp_client_enabled = true `
- The Supabase MCP server for this project is added globally as `supabase` with project ref `fwmjtdoyjefjhvzkodgw`.
- If MCP access is needed and not already authorized in the current Codex environment, run `codex mcp login supabase` and complete the browser OAuth flow.

Local Next.js dev-server recovery note:
- If the site suddenly appears to lose all JS or falls back to a bare Next error page, check for a local `.next` corruption issue before changing app code.
- Observed failure mode on 2026-05-12: homepage returned `500` with `Cannot find module './948.js'` from `.next/server/webpack-runtime.js`.
- Recovery that worked: stop the dev server, remove `.next`, then restart `npm run dev`.

Supabase tables expected:
```sql
create table booking_requests (
  id bigint generated by default as identity primary key,
  created_at timestamptz not null default now(),
  slug text not null,
  slot timestamptz not null,
  duration_min integer not null,
  name text not null,
  email text not null,
  notes text,
  status text not null default 'pending' check (status in ('pending','approved','denied')),
  decided_at timestamptz,
  decided_by text
);

create index booking_requests_slot_idx on booking_requests (slot);
create index booking_requests_status_idx on booking_requests (status);
create unique index booking_requests_active_slot_idx
  on booking_requests (slot)
  where status in ('pending','approved');

create table resource_requests (
  id bigint generated by default as identity primary key,
  created_at timestamptz default now(),
  resource_slug text not null,
  email text not null
);
```

## 6. Hard rules

1. **Don't change the visual system without explicit user OK.** That includes: removing the slashes/grain/stage-bg, swapping fonts, dropping the gold accent, switching to light mode, replacing the logo.
2. **Don't hard-code services or testimonials in JSX.** Always pull from `lib/firm.ts` or `lib/services.ts`.
3. **Don't remove the booking, resources, or auth routes** even if a redesign skips them on the home page. They're scaffolded and the user comes back to them.
4. **Don't add Tailwind plugins or UI libraries** (shadcn, MUI, etc.). The site is intentionally low-dep.
5. **Don't fetch the real Aspirer Firm Facebook page directly** — it's behind a login wall and the curl will just return the login HTML. The user has hand-fed FB content; treat that as source.
6. **Don't auto-commit.** Stage diffs, show them to the user, commit only on explicit request.
7. **Node 18.19**. Don't bump Next to 15/16 (requires Node 20+).

## 7. When you add a new service

1. Add an entry to `SERVICES` in `lib/services.ts` (`slug`, `title`, `durationMin`, `category`, `blurb`).
2. Add `STRIPE_PRICE_<UPPERCASE_SLUG>` to `.env.local.example`.
3. Add the slug → env mapping in `lib/stripe.ts`.
4. That's it — `/`, `/booking`, and `/booking/[slug]` are derived.

## 8. When the user pivots the brand

It has happened multiple times already. The right move:
1. Update `lib/firm.ts` and `lib/services.ts` only.
2. If positioning changes meaningfully (e.g., coaching → consulting), refresh metadata in `app/layout.tsx`, hero copy in `app/page.tsx`, About copy in `app/about/page.tsx`.
3. Keep the visual system. The brand has been: Healthcare Marketing Agency (2024) → Life Coaching placeholder (early 2026) → Mindset Coach for Entrepreneurs (current).

## 9. Known TODOs / handoff state

- `/about`, `/booking`, `/booking/[service]`, `/resources`, `/resources/[slug]`, and `/admin/bookings` need design-pass alignment with the dark/gold system. Keep the architecture and improve styling later with existing `globals.css` building blocks.
- Stripe price IDs are env stubs — site won't take real payments until those are filled.
- Google OAuth refresh-token bootstrap is documented in `README.md`; helper script lives at `scripts/google-owner-token.mjs`.
- Resource email-capture writes to Supabase but doesn't send the worksheet email. Wire up a transactional email provider (Resend/Postmark).
- Header brand mark currently sized for the 34px nav slot — if the logo file changes aspect ratio, adjust `Logo.tsx`.
- Local `.env.local` now has Supabase URL, publishable key, and service-role key populated on this machine. If booking still fails, verify the Supabase SQL migration has been run rather than re-debugging env setup first.

## 10. Repo basics

```
src/
  app/
    page.tsx                 home (dark/gold design)
    about/page.tsx           Marie's bio
    booking/                 service list + per-service slot picker
    resources/               free resources + lead capture
    api/                     availability, stripe/checkout, stripe/webhook, resources/request, auth
    layout.tsx               fonts, stage backdrop, Header/Footer wrapper
    globals.css              full visual system (do not split into multiple files)
  components/
    Header.tsx               sticky nav with logo
    Footer.tsx               4-col dark footer
    Logo.tsx                 reusable brand mark (uses /public/aspirer-firm-logo.svg)
    RevealScripts.tsx        client component: scroll/reveal/spotlight
    CardGrid.tsx             reusable link-card grid (used on /booking and /resources)
    Container.tsx            max-width wrapper
  lib/
    firm.ts services.ts stripe.ts google.ts supabase.ts
public/
  aspirer-firm-logo.svg      vectorized brand mark (source of truth)
design-reference/            the original GoDaddy scrape (read-only history)
```
