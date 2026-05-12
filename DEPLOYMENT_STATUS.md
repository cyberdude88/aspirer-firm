# Deployment Status

## Current State

- Local repo: `/home/alex/projects/aspirer-firm`
- Branch: `main`
- Git repo exists locally
- No `origin` remote configured yet
- GitHub CLI is authenticated as `cyberdude88`
- Vercel CLI is not installed on this machine
- Working tree has uncommitted changes

## What This App Needs In Production

- Vercel-hosted Next.js frontend
- GitHub repo for source control and Vercel import
- Supabase project
- Google OAuth client for NextAuth
- Google Calendar API access and owner refresh token
- Optional Stripe config if paid checkout is required immediately
- Final DNS/domain steps in GoDaddy

## Known Environment Variables

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALENDAR_OWNER_EMAIL`
- `GOOGLE_CALENDAR_ID`
- `GOOGLE_OWNER_REFRESH_TOKEN`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`
- `BUSINESS_TZ`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Immediate Blockers

- GitHub repo destination has not been specified yet
- Vercel is not available locally yet
- Production secrets have not been entered
- Supabase schema migration still needs to be run in the target project

## Fastest Path To Live

1. Create GitHub repo `cyberdude88/aspirer-firm` or confirm a different owner/name.
2. Add `origin` and push `main`.
3. Import the repo into Vercel.
4. Add all production environment variables in Vercel.
5. Run the Supabase SQL migration from `scripts/migrations/001_discovery_and_admin.sql`.
6. Create the Google OAuth redirect URI for `https://aspirerfirm.com/api/auth/callback/google`.
7. Generate and store the Google owner refresh token.
8. Deploy and test booking flow, admin login, and API routes.
9. Point GoDaddy DNS to Vercel.

## Customer-Facing Final DNS Steps

These are the only steps intended for the customer once the app is otherwise ready:

1. Open GoDaddy DNS for `aspirerfirm.com`.
2. Set the apex/root domain records to Vercel's required values.
3. Set the `www` record to Vercel's required CNAME target.
4. Wait for DNS propagation.
5. Confirm both `aspirerfirm.com` and `www.aspirerfirm.com` resolve correctly.

## Notes

- Supabase URL provided so far: `https://fwmjtdoyjefjhvzkodgw.supabase.co`
- Supabase project ref: `fwmjtdoyjefjhvzkodgw`
- Codex remote MCP was enabled with:
  ` [mcp] `
  ` remote_mcp_client_enabled = true `
- Supabase MCP server was added globally with `codex mcp add supabase --url https://mcp.supabase.com/mcp?project_ref=fwmjtdoyjefjhvzkodgw`
- If a future agent needs direct Supabase MCP access, run `codex mcp login supabase` and complete the browser OAuth step for this machine/session.
- Local `.env.local` has working Supabase URL, publishable key, and service-role key on this machine as of 2026-05-12.
- A local Next.js dev-cache corruption was observed on 2026-05-12: `/` returned `500` and Next errored with `Cannot find module './948.js'` from `.next/server/webpack-runtime.js`. Clearing `.next` and restarting `npm run dev` fixed it.
- The repo already contains deployment guidance in `README.md`.
- Before pushing, we should decide whether to commit the current working tree as-is or split it into smaller commits.
