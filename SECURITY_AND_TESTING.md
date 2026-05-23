# Security & Testing Playbook — aspirer-firm

Customer-safety baseline for the Aspirer Firm site. Covers verification flows,
code-hardening backlog, automated checks, OWASP-scoped vuln review, secret
hygiene, and pre-deploy / incident response. Keep this current as surfaces
change.

Source of truth references:
- `src/middleware.ts` — admin gate
- `src/app/api/**` — 8 public endpoints (see surface map)
- `src/app/booking/[service]/page.tsx` — booking request form
- `src/app/resources/[slug]/page.tsx` — resource email capture form
- `src/app/signin/page.tsx` + `src/app/api/auth/[...nextauth]/options.ts` — admin sign-in inputs
- `src/lib/{admin-auth,admin-session,auth-secret,booking,google,stripe,supabase}.ts`
- `.env.local.example` — required env keys

### 0.1 Input validation status (current state)

Validation exists, but it is inconsistent across the site. Use this as the quick audit baseline:

| Surface | Current validation | Gaps to track |
|---|---|---|
| `GET /api/availability` | validates `slug` via `getService()` | no shared schema, error path still manual |
| `POST /api/bookings` | trims inputs, validates service, email regex, slot parse, booking window, slot availability | no max lengths, accepts unknown keys, `notes` is uncapped free text, validation logic is route-local only |
| `POST /api/resources/request` | only checks truthy `slug` and `email.includes("@")` | no JSON parse guard, no slug allowlist check, no normalization, no email quality check, no length caps |
| `POST /api/stripe/checkout` | validates `slug` by service + price lookup | `slot` is effectively unchecked, request body shape is not validated, relies on caller discipline |
| `POST /api/admin/bookings/decide` | invalid JSON guard, integer `id`, enum-style `decision` check | no shared schema or same-origin/CSRF check |
| `POST /api/admin/session` | no body accepted | route assumes only authenticated UI calls it; no origin check |
| `/booking/[service]` form | client blocks empty `name`/`email` and uses `type="email"` | client-side checks are convenience only; no length limits or stronger inline validation |
| `/resources/[slug]` form | browser `type="email"` + `required` | still depends on weak server validation |
| `/signin` form | browser `required` on username/password | no visible client-side constraints; server-side credential path should be rate-limited |

---

## 1. Surface map

What's exposed and what each surface touches.

| Surface | File | Touches | Risk class |
|---|---|---|---|
| `GET /api/availability` | `src/app/api/availability/route.ts` | Google Calendar (read), Supabase (read) | low — no auth, read-only, no PII |
| `POST /api/bookings` | `src/app/api/bookings/route.ts` | Supabase `booking_requests` (write), customer email | **med — public write, PII** |
| `POST /api/resources/request` | `src/app/api/resources/request/route.ts` | Supabase (write), customer email | med — public write, PII |
| `POST /api/stripe/checkout` | `src/app/api/stripe/checkout/route.ts` | Stripe (create session) | med — money path |
| `POST /api/stripe/webhook` | `src/app/api/stripe/webhook/route.ts` | Stripe signed events → Google Calendar (write) + Supabase (write) | **high — money + booking writes** |
| `POST /api/admin/session` | `src/app/api/admin/session/route.ts` | Sets browser session cookie | med — auth |
| `POST /api/admin/bookings/decide` | `src/app/api/admin/bookings/decide/route.ts` | Admin booking approve/deny | **high — privileged write** |
| `GET/POST /api/auth/[...nextauth]` | `src/app/api/auth/[...nextauth]/route.ts` | NextAuth (Google + password credentials) | high — auth |
| `/admin/**` (pages) | `src/middleware.ts` matcher | Gated by NextAuth JWT + browser session cookie | high — privileged UI |

External services with credentials in this app: **Stripe**, **Supabase** (service-role key in
server), **Google OAuth + Calendar** (owner refresh token), **NextAuth** (JWT secret).

---

## 2. Verification playbook (manual)

Run before each prod push. Each block is a deterministic walkthrough; if any
step fails, do not deploy.

### 2.1 Booking happy path

1. From a clean browser session, visit `/booking`, pick a service, select a slot.
2. Submit with a valid name + email + (optional) notes.
3. Confirm:
   - Response is `200 {ok: true}`
   - Row appears in `booking_requests` with correct slug, slot ISO, name, email, notes
   - The same slot now shows as unavailable in `GET /api/availability` for that service
4. Submit the same slot again from a second session → expect `409 slot is no longer available`.
5. Submit a slot outside business hours → expect `400 slot outside booking window`.
6. Submit malformed JSON → expect `400 invalid json`.
7. Submit empty name / invalid email → expect `400` with the correct error string.

### 2.2 Resources request

1. POST `/api/resources/request` with a valid email and resource slug.
2. Confirm row written; confirm follow-up email/Slack/whatever fires (verify
   target integration in `src/app/api/resources/request/route.ts`).
3. Submit invalid email → expect 400.

### 2.3 Stripe checkout → webhook

1. Use Stripe test mode keys (`sk_test_...`, test webhook secret).
2. Trigger a real checkout from `/booking` paying with `4242 4242 4242 4242`.
3. Confirm Stripe dashboard shows the session with metadata `{slug, slot}` populated.
4. Confirm:
   - `bookings` row inserted with `stripe_session_id`
   - Google Calendar event created (check the owner calendar)
   - Customer received the calendar invite (`attendeeEmail`)
5. Replay the same webhook event via `stripe events resend <evt_id>`.
   - **Known gap:** without an idempotency table, the second delivery currently
     creates a duplicate booking. Track in §3.
6. Send a webhook with a tampered body / bad signature → expect `400 bad signature`.

### 2.4 Admin gate

1. Visit `/admin/bookings` while logged out → expect redirect to `/signin?callbackUrl=...`.
2. Sign in with a Google account whose email is **not** in the admin allowlist
   (`isAdminEmail()` in `src/lib/admin-auth.ts`) → expect redirect back to `/signin`.
3. Sign in with the admin email → expect to land on `/admin/bookings`.
4. Sign in with `ADMIN_PASSWORD` credentials → confirm `ADMIN_BROWSER_SESSION_COOKIE`
   is set with `Secure`, `HttpOnly`, `SameSite=Lax` (verify in DevTools → Application).
5. Approve a pending booking → confirm Google event created + DB row updated.
6. Deny a pending booking → confirm DB row updated, no calendar event created.
7. From the unauthed browser, POST directly to `/api/admin/bookings/decide` →
   expect 401/403, not 200.

### 2.5 OAuth callback

1. Sign in with Google in incognito → confirm callback hits `/api/auth/callback/google`
   and lands on the original `callbackUrl`.
2. Tamper with the `state` query param → expect NextAuth to reject.
3. Confirm `NEXTAUTH_URL` matches the actual origin in the environment being tested.

### 2.6 Public pages smoke

Hit each of these on prod after deploy and verify 200 + content render:
`/`, `/about`, `/booking`, `/resources`, `/privacy`, `/terms`, `/confidentiality`,
`/signin`. Check the browser console for errors.

### 2.7 Input validation regression checklist

Run these checks against every route or form you touch. Validation should fail closed with a deterministic 4xx, never a 500.

1. **JSON parsing**: send malformed JSON to each POST route and expect `400`, not an unhandled exception.
2. **Type enforcement**: send arrays, numbers, booleans, and nested objects where strings are expected; reject with `400`.
3. **Normalization**: leading/trailing whitespace in `name`, `email`, `slug`, and `slot` should be trimmed or rejected consistently.
4. **Enum / allowlist checks**: `slug` must resolve to a known service/resource; admin `decision` must be only `approve` or `deny`.
5. **Length caps**: verify reasonable server-side max lengths for free-text inputs, especially booking `notes`, admin credentials, and email fields.
6. **Email quality**: reject obviously invalid addresses server-side even if the browser input type allows them.
7. **Date / slot validation**: reject malformed ISO strings, impossible dates, and slots outside the active booking window.
8. **Unknown keys**: confirm extra payload keys are ignored safely or rejected explicitly; they must not alter control flow.
9. **Error hygiene**: invalid input returns user-safe messages only; internal provider or database error strings stay server-side.
10. **Client/server parity**: browser `required` and `type="email"` are convenience only; server validation must independently enforce the same rules.

---

## 3. Code-hardening backlog

Concrete items observed in the current tree. Each line lists the file and a
clear remediation. Tackle high → low.

### High

1. **Stripe webhook is not idempotent.**
   `src/app/api/stripe/webhook/route.ts` writes Google + Supabase on every
   `checkout.session.completed` delivery. Stripe retries on 5xx and may also
   replay events during incident response.
   - *Fix:* before processing, insert into a `stripe_event_log(event_id PK)` table.
     On duplicate-key, return 200 without side effects.

2. **No rate limiting on public writes.**
   `POST /api/bookings`, `POST /api/resources/request`, `POST /api/stripe/checkout`
   accept arbitrary traffic. Anyone can flood `booking_requests` or burn Stripe
   session-creation quota.
   - *Fix:* add per-IP + per-email throttling via Upstash Redis or
     `@vercel/kv`. Target: 5 booking attempts / IP / hour, 20 / day.

3. **`ADMIN_PASSWORD=letmein` in `.env.local.example`.**
   Verify the production value is rotated to a strong, randomly generated
   secret (32+ chars, no dictionary words). Document the rotation cadence in §6.

4. **Service-role key path.**
   `supabaseAdmin()` uses `SUPABASE_SERVICE_ROLE_KEY`. Confirm:
   - It is *never* imported into a `"use client"` file (grep the tree).
   - It is set only on the server-side env in Vercel, not on the client env.
   - Supabase RLS is enabled on every table; service-role usage is restricted to
     the specific routes that need it.

5. **Notes field is free-form text rendered in admin UI.**
   `POST /api/bookings` stores `notes` as-is. Audit the admin queue render path:
   if any component renders `notes` via `dangerouslySetInnerHTML` or markdown
   without sanitization, that's stored XSS.
   - *Fix:* render as plain text only (default JSX escapes), or sanitize via
     `DOMPurify` if rich text is needed. Enforce a length cap (e.g. 2000 chars)
     server-side too.

### Medium

6. **Site-wide input validation is inconsistent.**
   `bookings/route.ts`, `resources/request/route.ts`, `stripe/checkout/route.ts`,
   and the admin sign-in flow all validate inputs differently. Today the booking
   route is the strictest path, while resources and checkout accept weakly-shaped
   payloads.
   - *Fix:* introduce one schema per input surface and validate before any side
     effects. At minimum cover JSON parse failure, type checks, length caps,
     slug allowlists, email normalization, slot/date validation, and unknown-key
     rejection. If you add `zod`, use it everywhere rather than mixing styles.

7. **No security headers in `next.config.mjs`.**
   - *Fix:* add `headers()` returning CSP, `Strict-Transport-Security`,
     `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`,
     `Permissions-Policy` (deny camera/mic/geolocation), and a tight CSP.
     Start in `Content-Security-Policy-Report-Only` mode, monitor, then enforce.

8. **Stripe webhook trusts the `slot` string from session metadata.**
   `webhook/route.ts` parses `slot` directly into `new Date(...)`. If a previous
   layer ever lets a client influence that metadata, a malformed value could
   create a far-future or far-past calendar event.
   - *Fix:* re-validate `slot` against `bookingWindow()` and the active slots
     before writing the calendar event, mirroring the `bookings/route.ts` check.

9. **No CSRF protection on `POST /api/admin/session` and admin decide route.**
   `getToken` checks the JWT, but the decide endpoint should also verify the
   request originates from the admin UI.
   - *Fix:* add a same-origin check (`Origin`/`Referer` matches `NEXTAUTH_URL`)
     in middleware for `POST /api/admin/**`, or require an explicit CSRF token.

10. **Booking idempotency relies on a unique constraint only.**
    `bookings/route.ts` traps Postgres error code `23505` and returns 409. Make
    sure the unique index actually exists in the migration (verify in Supabase
    SQL editor: `\d booking_requests` on the relevant columns).

### Low

11. **No request logging on 4xx/5xx.** Add structured logs (Vercel + Logflare /
    Logtail) so admin can grep for `POST /api/bookings 4xx` spikes.
12. **Error responses sometimes echo internal strings** (Supabase error messages
    in `bookings/route.ts`). Translate to user-safe messages; log the real
    error server-side.
13. **No tests directory.** See §4.
14. **`unoptimized` set on `next/image` for floating logo.** Fine for the brand
    PNG; flag if other images grow.

---

## 4. Automated checks / CI

Add a CI workflow (GitHub Actions) that runs on every PR and the main branch.

### 4.1 Baseline (run on every push)

```yaml
# .github/workflows/ci.yml
- npm ci
- npm run lint            # next lint
- npm run typecheck       # tsc --noEmit
- npm run build           # next build (catches dynamic-route + RSC errors)
- npm audit --omit=dev --audit-level=high
```

### 4.2 Dependency hygiene

- Enable GitHub Dependabot for `npm` and `github-actions` ecosystems.
- Review and merge weekly. Hold security advisories at ≤ 7 days from disclosure.
- `npm audit --omit=dev --audit-level=high` in CI fails the build on a high or
  critical CVE in runtime deps.

### 4.3 Secret scanning

- Turn on **GitHub secret scanning** + **push protection** for the repo.
- Pre-commit hook (`husky` + `lint-staged`) running `gitleaks protect --staged`.

### 4.4 Static analysis (optional but recommended)

- `npx @next/eslint-plugin-next` rules already on via `next lint`.
- Add `eslint-plugin-security` for Node-style checks.
- One-shot pass with `semgrep --config p/owasp-top-ten --config p/javascript` —
  fix or annotate triage.

### 4.5 E2E (recommended)

- Add Playwright suite under `tests/e2e/`:
  - booking happy path
  - admin gate (logged out → redirect)
  - stripe webhook signature verification (mock signed payload)
  - public page smoke (`/`, `/about`, `/booking`, `/privacy`, …)
- Run on preview deployments via the Vercel GitHub integration's preview URL.

### 4.6 Production smoke after deploy

A small script (or GitHub Action job triggered post-deploy) that fetches
`/`, `/booking`, `/api/availability` and asserts 200 + key strings. Page-fail
or timeout posts to a Slack channel.

---

## 5. OWASP-scoped vuln checklist

Mapped to this app, not generic.

### A01 — Broken access control
- [ ] `/admin/**` only reachable with `isAdminEmail(token.email)` AND browser session cookie.
- [ ] `POST /api/admin/bookings/decide` checks JWT server-side (do not trust middleware alone).
- [ ] Direct POST to `/api/admin/bookings/decide` without a valid session → 401.
- [ ] Admin email allowlist is server-side env (`ADMIN_EMAIL` / `isAdminEmail`), not hardcoded.

### A02 — Cryptographic failures
- [ ] `NEXTAUTH_SECRET` is ≥ 32 random bytes; rotate per §6.
- [ ] All cookies set with `Secure; HttpOnly; SameSite=Lax`.
- [ ] HTTPS-only in production (Vercel default; enforce HSTS via `next.config.mjs`).

### A03 — Injection
- [ ] All Supabase access uses the SDK's parameterized methods — verify no raw SQL templates.
- [ ] No `eval` / `new Function` / dynamic require in the codebase (`git grep -nE 'eval\(|new Function'`).
- [ ] HTML rendering: every place that renders user-supplied content (`notes`, name) is
      plain JSX, not `dangerouslySetInnerHTML`.

### A04 — Insecure design
- [ ] Stripe webhook idempotency (backlog #1).
- [ ] Rate limits (backlog #2).
- [ ] Slot double-booking guarded at DB level (unique index) AND application level.

### A05 — Security misconfiguration
- [ ] No verbose error responses (`error.message` from Supabase echoed — backlog #12).
- [ ] Security headers (backlog #7).
- [ ] `next.config.mjs` does not expose source maps to production (`productionBrowserSourceMaps: false` by default — verify).
- [ ] Vercel project: `NEXT_PUBLIC_*` only used for genuinely public values.

### A06 — Vulnerable & outdated components
- [ ] `npm audit` in CI (§4.1).
- [ ] Dependabot enabled (§4.2).
- [ ] Pin Node version in `package.json` engines + `.nvmrc`.

### A07 — Identification & auth failures
- [ ] `ADMIN_PASSWORD` rotated and strong (backlog #3).
- [ ] NextAuth credentials provider rate-limited (currently unprotected; see backlog #2).
- [ ] Google OAuth `state` parameter validated by NextAuth (built-in).

### A08 — Software & data integrity
- [ ] `package-lock.json` committed (verified).
- [ ] No `postinstall` scripts from unknown deps that run with elevated trust.

### A09 — Security logging & monitoring
- [ ] Structured logs on Vercel for 4xx/5xx on the 8 routes.
- [ ] Stripe webhook failures alerted (Stripe dashboard → notifications).
- [ ] Supabase auth events visible in the Supabase dashboard.

### A10 — SSRF
- [ ] No user-supplied URL is ever fetched server-side. Confirm none of the route
      handlers pass a body field into `fetch()` or `googleapis.urlshortener.*`.

---

## 6. Secret hygiene & rotation

### Inventory (production)

| Secret | Where set | Used by | Rotation |
|---|---|---|---|
| `NEXTAUTH_SECRET` | Vercel env | JWT signing | every 6 months, or immediately on suspected leak |
| `GOOGLE_CLIENT_SECRET` | Vercel env | OAuth sign-in | every 12 months |
| `GOOGLE_OWNER_REFRESH_TOKEN` | Vercel env | Calendar API | re-issue on staff change |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel env (server only) | DB writes | rotate via Supabase dashboard every 6 months |
| `STRIPE_SECRET_KEY` | Vercel env | Checkout session | rotate via Stripe dashboard every 12 months |
| `STRIPE_WEBHOOK_SECRET` | Vercel env | Webhook verification | rotate when reconfiguring the endpoint |
| `ADMIN_PASSWORD` | Vercel env | Admin sign-in | every 90 days, or on staff change |

### Rotation procedure

1. Generate the new value (provider dashboard for Stripe / Google / Supabase;
   `openssl rand -base64 32` for `NEXTAUTH_SECRET` / `ADMIN_PASSWORD`).
2. Set the new value in Vercel → Production env.
3. Trigger a redeploy from the dashboard (`vercel --prod` or push a no-op commit).
4. Revoke the old value at the provider.
5. Verify the relevant flow (§2 walkthrough touching that secret).
6. Note the rotation date in `.env.local.example` adjacent comment OR a
   private ops doc (do not commit the secret itself).

### If a key leaks

- **Stripe**: roll the secret key at Stripe → dashboard → developers → API keys.
  Re-issue webhook secrets at endpoints.
- **Supabase service role**: rotate in Supabase → Project Settings → API.
- **NextAuth secret**: rotate; all existing user sessions are invalidated.
- **Google OAuth**: revoke the client secret in Google Cloud Console; reissue.
- Audit logs for the 24h window before discovery for unauthorized use.

---

## 7. Pre-deploy checklist

Before `vercel --prod` (or letting Vercel auto-deploy a merge to `main`):

- [ ] `npm run lint` clean
- [ ] `npm run typecheck` clean
- [ ] `npm run build` clean locally
- [ ] §2 verification flows for any touched surface
- [ ] No new `console.log` left in production code paths
- [ ] No new env keys added without updating `.env.local.example` AND setting in Vercel
- [ ] No secret value in the diff (`git diff origin/main..HEAD | grep -iE 'sk_|api_key|secret|password'`)
- [ ] Stripe in test mode for staging / live mode for prod — verify the right key set
- [ ] If schema changed: Supabase migration applied; RLS policies reviewed
- [ ] If routes added: surface map in §1 updated; vuln checklist §5 re-walked
- [ ] Post-deploy: run §4.6 smoke

---

## 8. Incident response — quick reference

### Production endpoint returns 500

1. `vercel logs aspirer-firm --prod` (or dashboard → Logs).
2. Search for the request id; identify the throwing line.
3. If it's caused by an env / secret issue → §6 procedure.
4. If it's a bug introduced by the last deploy → `vercel rollback` (dashboard
   → Deployments → previous green → "Promote to production").
5. Backfill a fix on a branch; do not hotfix on main without §7 checklist.

### Suspected key leak

1. Rotate the affected secret immediately (§6).
2. Pull access logs from the relevant provider for the time window.
3. If customer data may be exposed: notify per §9 (privacy) and your DPA
   obligations.

### Unauthorized admin access detected

1. Rotate `NEXTAUTH_SECRET` to kill all sessions.
2. Rotate `ADMIN_PASSWORD`.
3. Pull NextAuth + middleware logs; identify the email used.
4. Remove offending email from `isAdminEmail` allowlist if added.
5. Run §2.4 admin gate verification top to bottom.

### Customer reports a slot was double-booked

1. Query `booking_requests` and `bookings` for the slot ISO; identify both rows.
2. Decide which customer to keep (usually first paid).
3. Issue Stripe refund for the displaced customer via dashboard.
4. Email the displaced customer with rescheduling options.
5. File the gap as a §3 backlog item (idempotency / unique-index audit).

### Stripe webhook failures spiking

1. Stripe dashboard → Developers → Webhooks → endpoint → recent attempts.
2. Identify the failure mode (`bad signature`, 5xx from our app, timeout).
3. If signature: verify `STRIPE_WEBHOOK_SECRET` matches the endpoint config.
4. If 5xx: §8.1 procedure on our side.
5. After fix, Stripe automatically retries failed events.

---

## 9. Data handling notes

- Customer PII captured: name, email, notes (booking flow); email (resources flow).
- Stored in Supabase Postgres (EU region per `BUSINESS_TZ=Europe/Berlin` —
  verify Supabase project region).
- Stripe stores payment data on Stripe's side; this app holds only the
  `stripe_session_id` reference.
- Google Calendar stores the event with attendee email — that is data shared
  with Google under the customer's consent (verify privacy policy reflects this).
- Retention: clarify in `docs/privacy-policy-draft.md` and apply a Supabase
  function or cron to purge `booking_requests` and `bookings` after the
  policy's retention window.

---

## Change log

- Initial draft, 2026-05-23.
