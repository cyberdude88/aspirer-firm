# Handoff: Supabase Admin Auth Migration

Date: 2026-05-24
Repo: `/home/alex/projects/aspirer-firm`

## Stopping Point

The admin login migration is partway through and local code has been updated to move password auth out of app/env credential checks and into Supabase Auth.

At the moment of handoff:
- `next build` got past `Creating an optimized production build` and reported `Compiled successfully`
- it then moved into `Linting and checking validity of types ...`
- final build completion was not waited for before stopping

## What Was Done

### 1. Admin auth moved toward Supabase Auth

The `/signin` page still presents the same basic admin login UX, but it now uses Supabase email/password auth instead of checking `ADMIN_PASSWORD` in code.

Files changed:
- `src/app/signin/page.tsx`
- `src/lib/admin.ts`
- `src/lib/admin-auth.ts`
- `src/middleware.ts`
- `src/app/api/admin/bookings/decide/route.ts`

Key behavior now:
- sign-in uses `supabase.auth.signInWithPassword(...)`
- `/admin/**` access is based on authenticated Supabase user email
- admin access is determined by Supabase Auth `app_metadata.role = "admin"` or `app_metadata.is_admin = true`
- the old extra browser-session cookie gate was removed

### 2. NextAuth credential path removed from code

Deleted:
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/api/auth/[...nextauth]/options.ts`
- `src/app/api/admin/session/route.ts`
- `src/lib/admin-session.ts`

Note:
- `next-auth` still remains in `package.json` right now and likely should be removed once the build is fully validated and no remaining docs/code references need it
- stale legacy auth infrastructure was identified and has since been removed

### 3. Supabase helper split to fix `next/headers` build error

Problem:
- `src/lib/supabase.ts` mixed browser and server code
- client code importing it pulled in `next/headers`, causing the build error

Fix applied:
- added `src/lib/supabase-browser.ts`
- added `src/lib/supabase-server.ts`
- updated imports so client code uses browser helper only and server/route code uses server helper

### 4. Production source exposure tightened

Changed:
- `next.config.mjs`

Added:
- `productionBrowserSourceMaps: false`
- `poweredByHeader: false`

Important note:
- this prevents shipping browser source maps in production
- it does **not** hide compiled JS chunks from the Network tab; that is not possible for a client-rendered web app

### 5. Supabase Auth users created

Using the project service role, these users were created in Supabase Auth:
- admin users were created in Supabase Auth and their admin role now lives in `app_metadata`.

### 6. Local `.env.local` cleaned

Removed local legacy secrets/credential values tied to the old app-managed password flow:
- `ADMIN_PASSWORD`
- `SECONDARY_ADMIN_PASSWORD`
- `ADMIN_SECRET`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_REDIRECT_URI`

Retained:
- Supabase URL / publishable key / service role key
- Supabase URL / publishable key / service role key

## Current Working Tree

Tracked changes present:
- `.env.local.example`
- `next.config.mjs`
- `src/app/admin/bookings/page.tsx`
- `src/app/api/admin/bookings/decide/route.ts`
- `src/app/api/bookings/route.ts`
- `src/app/api/resources/request/route.ts`
- `src/app/api/stripe/webhook/route.ts`
- `src/app/globals.css`
- `src/app/signin/page.tsx`
- `src/lib/admin-auth.ts`
- `src/lib/admin.ts`
- `src/middleware.ts`
- `src/lib/supabase-browser.ts`
- `src/lib/supabase-server.ts`

Deleted:
- `src/app/api/admin/session/route.ts`
- `src/app/api/auth/[...nextauth]/options.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/lib/admin-session.ts`

Untracked and intentionally not part of repo work:
- `.claude/`

## Likely Remaining Cleanup

1. Confirm `next build` finishes cleanly.
2. If build passes, run through `/signin` and `/admin/bookings` locally.
3. Remove any stale references to NextAuth from docs and package metadata.
4. Consider removing `next-auth` from `package.json` and lockfile if no longer used anywhere.
5. Legacy auth-secret helpers have been removed.
6. Update docs that still mention removed credential-provider-era env vars or old auth flow details
7. Remove any now-unused admin email allowlist vars from deployment config after confirming the live site is using Supabase-backed admin auth.

## Notes About Typecheck / Build

A local issue appeared where plain `npm run typecheck` complained about missing `.next/types/...` files because `tsconfig.json` includes `.next/types/**/*.ts`. That is a Next-generated state issue, not the original build error.

The meaningful verification path here is `next build`, not just raw `tsc --noEmit`.

## Known User-Facing Context

The user explicitly wanted:
- no hardcoded or env-checked admin creds in app code
- same basic customer/admin login experience on `/signin`
- original source files not exposed via production source maps
- a stopping-point handoff file
