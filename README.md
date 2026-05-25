# Aspirer Firm

Next.js (App Router, TS, Tailwind) site with:

- **Supabase** — booking request queue persistence (`@supabase/ssr`, service-role for server writes)
- **Google OAuth** — NextAuth Google sign-in for admin review
- **Admin queue** — `/admin/bookings` approve/deny flow gated by Supabase Auth admin metadata
- **Google Calendar** — owner-account refresh token support remains in-repo for confirmed-booking flows
- **Stripe** — existing checkout/webhook scaffolding remains in-repo for paid engagements

Visual baseline from the original GoDaddy site lives in `design-reference/` (scraped 2026-05-12, GoDaddy analytics/CDN cruft stripped).

## Quick start

```bash
cp .env.local.example .env.local
# fill in real values, then
npm run dev
```

Open <http://localhost:3000>.

For production on `https://aspirerfirm.com`, set `NEXTAUTH_URL=https://aspirerfirm.com` and add `https://aspirerfirm.com/api/auth/callback/google` to the Google OAuth client redirect URIs.

The repo does not need to be pushed to Git before Google Calendar works. The integration is driven by local environment variables and your Google Cloud project.

## Routes

| Path                          | Purpose                                                 |
| ----------------------------- | ------------------------------------------------------- |
| `/`                           | Home                                                    |
| `/booking`                    | List of bookable services                               |
| `/booking/[service]`          | Show available slots and submit a booking request       |
| `/booking/requested`          | Confirmation page after request submission              |
| `/admin/bookings`             | Pending queue for approve/deny decisions                |
| `/api/availability?slug=...`  | Generate 9am–5pm weekday slots minus active requests    |
| `/api/bookings`               | Insert pending request into `booking_requests`          |
| `/api/admin/bookings/decide`  | Approve or deny a pending request                       |
| `/api/auth/[...nextauth]`     | NextAuth Google sign-in                                 |

## One-time setup checklist

1. **Google Cloud** — create OAuth client (Web), add redirect URIs `http://localhost:3000/api/auth/callback/google` and `https://aspirerfirm.com/api/auth/callback/google`. Enable Google Calendar API. Save the client ID/secret.
2. **Owner refresh token** — run `npm run google:owner-token`, open the printed URL, sign into the business Gmail account, then rerun with the returned code:
   ```bash
   npm run google:owner-token -- 'PASTE_CODE_HERE'
   ```
   Save the printed `GOOGLE_OWNER_REFRESH_TOKEN` into `.env.local`.
3. **Supabase** — create project, run the queue migration:
   ```sql
   -- See scripts/migrations/001_discovery_and_admin.sql
   ```
4. **Admin access** — create the admin user in Supabase Auth and set `app_metadata.role = "admin"` or `app_metadata.is_admin = true`.
5. **Stripe** — create one Product + Price for each paid engagement (`diagnostic`, `ninety-day-reset`, `annual-partnership`, `team-workshops`), paste those price IDs into the matching `STRIPE_PRICE_*` vars, and forward a local webhook with `stripe listen --forward-to localhost:3000/api/stripe/webhook`.

## Layout

```
src/
  app/
    page.tsx                    home
    booking/page.tsx            service list
    booking/[service]/page.tsx  slot picker + request form
    booking/requested/page.tsx  request confirmation
    admin/bookings/page.tsx     admin queue
    api/
      availability/route.ts     GET ?slug=
      bookings/route.ts         POST booking request
      admin/bookings/decide     POST approve/deny
      auth/[...nextauth]/       NextAuth Google provider
  lib/
    admin.ts      admin guard helpers
    booking.ts    request-aware slot generation
    supabase.ts   browser / server / admin clients
    services.ts   single source of truth for service slugs
design-reference/  scraped HTML from the existing GoDaddy site (visual only)
```
