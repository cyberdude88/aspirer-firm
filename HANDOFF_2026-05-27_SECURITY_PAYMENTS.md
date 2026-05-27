# Handoff — 2026-05-27 — Security, Cleanup, Auto-Wipe Cron, Payments Decision

Repo: `/home/alex/projects/aspirer-firm` · Live: https://aspirerfirm.com (Vercel, manual `vercel --prod`)

## Shipped this session (committed + deployed to prod)

### 1. Supabase RLS — CRITICAL fix (done, verified)
- **Problem:** RLS was OFF on `booking_requests`, `resource_requests`, `bookings`. The public/anon key (shipped in browser JS) could **read all customer PII and insert/delete rows**. Confirmed live (anon got 200 reads + 201 insert + 204 delete).
- **Fix:** `scripts/migrations/003_enable_rls.sql` — `enable` + `force row level security`, **no policies**. All app access is server-side via the service-role key, which bypasses RLS, so behavior is unchanged.
- **Status:** Applied in Supabase SQL editor + verified. Anon now gets `[]` on reads and `42501` (RLS violation) on writes. App smoke-tested end-to-end (availability read, booking insert, resource insert, pages, same-origin guard) — all green.

### 2. Stray secret file removed
- Deleted `.env.local:18` (a shell-typo artifact holding a live `SUPABASE_SERVICE_ROLE_KEY`). Was gitignored + never committed (verified via `git log -S`). Real key still in `.env.local` (untracked).
- **Hygiene TODO (optional):** rotate the service-role key (Supabase → Settings → API), then update `.env.local` + Vercel env. It has a ~2036 expiry and sat in a stray file.

### 3. Test data cleanup
- Deleted 10 junk test rows from `booking_requests` (ids 1–10: `s@s.com`, `sdf@sdf.com`, test names, Alex's own email).
- **LEFT IN PLACE pending confirmation — 2 real-looking discovery calls for 2026-05-28:**
  - id 11 — Marie / `jeanderine.mendy@gmail.com` — 13:00, approved
  - id 12 — Michael / `michaelacook@icloud.com` — 14:00, approved
  - ❓ **Action needed:** confirm whether these are real or tests. (They'll be auto-wiped on 2026-05-29 by the new cron regardless — see below.)

### 4. Auto-wipe cron (done, verified)
- `src/app/api/cron/cleanup-bookings/route.ts` + `vercel.json`.
- Runs daily **02:00 UTC** via Vercel Cron; deletes `booking_requests` whose `slot` is **before today (UTC)** → an appointment is wiped the day after it occurs.
- Protected by `CRON_SECRET` (set in Vercel production env + local `.env.local`). Verified: endpoint returns **401** without the secret.
- **Scope:** only `booking_requests`. Paid `bookings` rows are intentionally NOT touched (financial records).
- **Note:** this is a HARD delete — no booking history is retained. If Marie ever wants past-lead history (CRM value), switch to an archive table instead.

### Commits (pushed to `main`)
- `42d38cd` Finalize Supabase admin-auth migration and request-security helpers (pre-existing working tree)
- `fc1f614` Enable Row Level Security on public tables
- `3482ff8` Add daily cron to auto-wipe past appointments
- Deployed: `dpl_FENFTV5V7GEuuFDbbTDUMkL1DeWA` → aliased to aspirerfirm.com (READY)

## Open strategic decision — NOT yet decided

**The website is a custom Next.js app on Vercel. GoDaddy is the domain registrar + an (unpublished, free-tier) Websites+Marketing draft.** Marie's paid GoDaddy marketing tools (AI Visibility, Email Marketing, Automations, Sign-up Forms) + a native booking system + native payments all live in the GoDaddy product but only work with a GoDaddy-built site.

Three paths on the table:
- **A. Go GoDaddy-native** — publish/build on GoDaddy; native bookings/payments/confirmation-emails/marketing; Marie self-edits; needs a paid W+M plan; **rebuild the design** (can't import the Next.js app — GoDaddy builder is iframe/section-based, no JS in page source).
- **B. Keep the custom site** — bolt on GoDaddy **Pay Links** for payment; hand-build confirmation emails; AI Visibility/forms/automations stay unused; Marie can't self-edit without a dev.
- **C. Hybrid** — custom site + GoDaddy **CRM Zapier connector** to feed Email Marketing/Automations (needs a Zapier sub + a webhook I'd add); payments still semi-manual Pay Links.

### Payments findings (verified against GoDaddy docs)
- **GoDaddy has NO payment API** — can't swap it behind the coded Stripe checkout.
- GoDaddy Payments = **no monthly fee**, per-transaction: Pay Links/Invoices **2.8% + 30¢**, ACH **0.8% (max $10)**, in-person 2.3%, keyed 3.5%.
- **Pay Links = one-time only.** Recurring revenue (memberships, per-seat corporate, installment plans) must use **recurring invoices** (auto-charge via saved card), set up by Marie in her dashboard — not a website "subscribe" button.
- **Tip:** enable ACH on big invoices ($2,997 program → ~$84 card fee vs $10 ACH cap).
- Her catalog is high-ticket/consultative → "discovery call → scope → invoice" fits her model well.

### Other known gaps
- **No confirmation emails exist anywhere** in the app (no email provider wired). A free discovery-call request stores a row and notifies no one. This is why a test booking produced no email. Fix = add Resend (or go GoDaddy-native, which emails natively). **Open question being explored: self-hosting our own mail.**
- Stripe code exists but env keys/price IDs are blank; unused if going GoDaddy.

## Next actions (pick up here)
1. Confirm/delete booking rows 11 & 12.
2. Decide platform direction (A/B/C above).
3. Build confirmation emails (provider TBD — Resend vs self-hosted mail under discussion).
4. (Optional) rotate the Supabase service-role key.
