# Deployment Status

Last updated: 2026-05-12

## Live URLs

- **Production:** https://aspirer-firm.vercel.app
- Latest deploy: https://aspirer-firm-flwqqvg6p-alex-ansbergs-projects.vercel.app
- Vercel dashboard: https://vercel.com/alex-ansbergs-projects/aspirer-firm
- GitHub repo: https://github.com/cyberdude88/aspirer-firm (branch `main`)
- GitHub Pages: **disabled** (was previously serving the README via Jekyll at `cyberdude88.github.io/aspirer-firm/` — misleading, now 404)

## Hosting Pipeline

```
local edit  →  vercel --prod --yes  (from /home/alex/projects/aspirer-firm)  →  Vercel build  →  aspirer-firm.vercel.app
```

- Deploys are **manual from this machine** via the `vercel` CLI (logged in as `alexansbergs-6478`).
- Git push to `cyberdude88/aspirer-firm` does **not** auto-deploy yet. The Vercel project is linked to the GitHub repo URL but the auto-deploy hook failed at link time because the Vercel account has no GitHub login connection (`Failed to link cyberdude88/aspirer-firm. You need to add a Login Connection to your GitHub account first`).
- To enable git-push auto-deploys: add GitHub as a login connection at https://vercel.com/account/login-connections, then re-run `vercel link --yes --project aspirer-firm`.
- Local `.vercel/` directory holds project linkage (`project.json` with `orgId` + `projectId`). Gitignored.

## Admin Login

- Sign-in URL: https://aspirer-firm.vercel.app/signin
- Admin panel URL: https://aspirer-firm.vercel.app/admin/bookings
- Credentials provider: `admin-password` (no Google OAuth until `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` are set).
- Login form has two fields: **Username** (must equal `ADMIN_EMAIL`) and **Password** (must equal `ADMIN_PASSWORD`).
- Current credentials in production env:
  - Username: `admin@aspirerfirm.com`
  - Password: `letmein`  ← **change before handing to client**
- Source: `src/app/signin/page.tsx` (client form, wrapped in `<Suspense>` to satisfy Next 14 prerender), `src/app/api/auth/[...nextauth]/options.ts` (Credentials provider).

## Production Environment Variables

Set in Vercel (production scope):

| Variable | Status | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ set | `https://fwmjtdoyjefjhvzkodgw.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ set | |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ set | Server-only |
| `NEXTAUTH_URL` | ✅ set | `https://aspirer-firm.vercel.app` |
| `NEXTAUTH_SECRET` | ✅ set | Generated via `openssl rand -base64 32` |
| `ADMIN_EMAIL` | ✅ set | `admin@aspirerfirm.com` |
| `ADMIN_PASSWORD` | ✅ set | `letmein` (temp) |
| `ADMIN_SECRET` | ✅ set | |
| `BUSINESS_TZ` | ✅ set | `Europe/Berlin` |
| `GOOGLE_CALENDAR_OWNER_EMAIL` | ✅ set | `aspirerfirm.dev@gmail.com` |
| `GOOGLE_CALENDAR_ID` | ✅ set | `primary` |
| `GOOGLE_CLIENT_ID` | ❌ missing | Required for Google sign-in + Calendar booking |
| `GOOGLE_CLIENT_SECRET` | ❌ missing | |
| `GOOGLE_OWNER_REFRESH_TOKEN` | ❌ missing | Generated via `npm run google:owner-token` |
| `STRIPE_SECRET_KEY` | ❌ missing | Paid checkout disabled until set |
| `STRIPE_WEBHOOK_SECRET` | ❌ missing | |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ❌ missing | |
| `STRIPE_PRICE_MINDSET_SESSION` | ❌ missing | |
| `STRIPE_PRICE_CONFLICT_COMMUNICATION` | ❌ missing | |
| `STRIPE_PRICE_SELF_DOUBT` | ❌ missing | |
| `STRIPE_PRICE_RESILIENCE` | ❌ missing | |

To inspect or change: `vercel env ls production` / `vercel env add NAME production --force`.

## What Works Right Now

- Public landing pages (`/`, `/about`, `/resources`, `/booking/[service]` UI) render on production.
- Admin sign-in (username + password) works against the production env vars.
- `/admin/bookings` is reachable once signed in (gated by `session.user.email === ADMIN_EMAIL`).
- Supabase reads/writes succeed from server routes (service-role key set).

## What Does Not Work Yet

- **Google OAuth sign-in** — provider is conditionally registered only when `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` are present; both unset.
- **Google Calendar booking confirmation** — needs `GOOGLE_OWNER_REFRESH_TOKEN` (run `npm run google:owner-token` locally, paste into Vercel).
- **Stripe checkout / webhook** — all `STRIPE_*` keys missing. Any code path that calls `stripe.checkout.sessions.create` will throw.
- **Custom domain `aspirerfirm.com`** — not yet attached to the Vercel project; DNS still on GoDaddy.
- **Auto-deploy on git push** — see Hosting Pipeline above; requires Vercel ↔ GitHub login connection.

## Supabase

- Project URL: `https://fwmjtdoyjefjhvzkodgw.supabase.co`
- Project ref: `fwmjtdoyjefjhvzkodgw`
- Migrations to apply (have not been re-checked against current schema):
  - `scripts/migrations/001_discovery_and_admin.sql`
  - `scripts/migrations/002_public_runtime_tables.sql`
- Optional: `codex mcp add supabase --url https://mcp.supabase.com/mcp?project_ref=fwmjtdoyjefjhvzkodgw` then `codex mcp login supabase` to give a future agent direct MCP access from this machine.

## Code Changes Made During Deploy Setup (not yet committed)

- `src/app/signin/page.tsx` — wrapped `useSearchParams()` consumer in `<Suspense>` (production prerender requirement) and added a `Username` field alongside the existing `Password` field.
- `src/app/api/auth/[...nextauth]/options.ts` — Credentials provider now requires both `username` (matched against `ADMIN_EMAIL`) and `password` (matched against `ADMIN_PASSWORD`).
- `DEPLOYMENT_STATUS.md` — this file.
- Plus pre-existing uncommitted edits in `src/app/booking/[service]/page.tsx` and `src/app/globals.css`.

A stray file `.env.local:18` (shell-redirection typo) holds a live `SUPABASE_SERVICE_ROLE_KEY` on disk with a confusing name. It is gitignored (`.env.local:*` rule covers it) and was never pushed, but should be deleted: `rm '.env.local:18'`.

## Remaining Steps To "Fully Live On aspirerfirm.com"

1. Create a Google OAuth client (web app type) in Google Cloud Console.
2. Add redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://aspirer-firm.vercel.app/api/auth/callback/google` (current prod)
   - `https://aspirerfirm.com/api/auth/callback/google` (future custom domain)
3. `vercel env add GOOGLE_CLIENT_ID production --force` and same for `GOOGLE_CLIENT_SECRET`.
4. Locally: fill the same in `.env.local`, run `npm run google:owner-token`, paste the resulting refresh token into Vercel as `GOOGLE_OWNER_REFRESH_TOKEN`.
5. Apply Supabase migrations against the live project if not already done.
6. Set up Stripe (test then live keys + price IDs) if paid checkout is needed for launch.
7. In Vercel project → Domains, add `aspirerfirm.com` and `www.aspirerfirm.com`. Vercel will surface the required A / CNAME records.
8. Customer-facing GoDaddy DNS steps:
   1. Open GoDaddy DNS for `aspirerfirm.com`.
   2. Set apex/root A record to Vercel's IP.
   3. Set `www` CNAME to `cname.vercel-dns.com.`.
   4. Wait for propagation.
   5. Confirm `aspirerfirm.com` and `www.aspirerfirm.com` both resolve to the deployed app.
9. Once `aspirerfirm.com` resolves: update `NEXTAUTH_URL` to `https://aspirerfirm.com` in Vercel and redeploy.
10. Change `ADMIN_PASSWORD` from `letmein` to a real secret before handover.

## Useful Commands

```
vercel whoami                          # confirm CLI auth
vercel --prod --yes                    # deploy current working dir to production
vercel env ls production               # list production env vars
vercel env add KEY production --force  # set / overwrite (reads value from stdin)
vercel logs <deployment-url>           # runtime logs (only for READY deployments)
vercel inspect --logs <url>            # build logs (works on FAILED deploys too)
gh api -X DELETE repos/cyberdude88/aspirer-firm/pages   # already done; disables Pages
```

## Known Local Quirk

A Next.js dev-cache corruption was observed on 2026-05-12: `/` returned `500` and Next errored with `Cannot find module './948.js'` from `.next/server/webpack-runtime.js`. Clearing `.next` and restarting `npm run dev` fixed it.
