-- Enable Row Level Security on all public runtime tables.
--
-- WHY: tables created via the SQL editor have RLS OFF by default, and Supabase
-- exposes every table through the public PostgREST API. The anon/publishable key
-- ships in the browser bundle, so without RLS anyone can read all customer PII
-- and insert/update/delete rows. (Confirmed: anon key got 200 reads + 201 insert
-- + 204 delete on these tables.)
--
-- DESIGN: all legitimate access runs server-side via the service_role key, which
-- BYPASSES RLS. So we enable RLS and add NO policies — anon/authenticated roles
-- get zero table access, server routes are unaffected. Idempotent; safe to re-run.

alter table public.booking_requests  enable row level security;
alter table public.resource_requests enable row level security;
alter table public.bookings          enable row level security;

-- Force RLS even for the table owner, in case future code connects as a non-service role.
alter table public.booking_requests  force row level security;
alter table public.resource_requests force row level security;
alter table public.bookings          force row level security;
