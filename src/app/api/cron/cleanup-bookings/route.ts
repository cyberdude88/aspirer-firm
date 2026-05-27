import { supabaseAdmin } from "@/lib/supabase-server";
import { jsonNoStore } from "@/lib/security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Daily cron (see vercel.json): wipes booking requests whose slot is in the past.
// "The day after the appointment" — cutoff is the start of today (UTC), so any
// appointment dated yesterday or earlier is removed. Appointments are during
// business hours (well before midnight UTC), so this cleanly drops a slot the
// day after it occurs. Paid `bookings` rows are intentionally NOT touched —
// those are financial records.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return jsonNoStore({ error: "unauthorized" }, { status: 401 });
  }

  const cutoff = new Date();
  cutoff.setUTCHours(0, 0, 0, 0); // start of today, UTC
  const cutoffIso = cutoff.toISOString();

  const { data, error } = await supabaseAdmin()
    .from("booking_requests")
    .delete()
    .lt("slot", cutoffIso)
    .select("id");

  if (error) {
    return jsonNoStore({ error: error.message }, { status: 500 });
  }

  return jsonNoStore({ ok: true, deleted: data?.length ?? 0, cutoff: cutoffIso });
}
