import { NextRequest } from "next/server";
import { getService } from "@/lib/services";
import { supabaseAdmin } from "@/lib/supabase-server";
import { bookingWindow, generateSlots, listActiveBookings } from "@/lib/booking";
import { assertSameOrigin, jsonNoStore } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const blocked = assertSameOrigin(req);
  if (blocked) return blocked;

  let body: { slug?: string; slot?: string; name?: string; email?: string; notes?: string };
  try {
    body = await req.json();
  } catch {
    return jsonNoStore({ error: "invalid json" }, { status: 400 });
  }

  const slug = (body.slug ?? "").trim();
  const slot = (body.slot ?? "").trim();
  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const notes = (body.notes ?? "").trim() || null;

  const service = getService(slug);
  if (!service) return jsonNoStore({ error: "unknown service" }, { status: 400 });
  if (!name) return jsonNoStore({ error: "name required" }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonNoStore({ error: "valid email required" }, { status: 400 });
  }
  const slotDate = new Date(slot);
  if (Number.isNaN(slotDate.getTime())) {
    return jsonNoStore({ error: "invalid slot" }, { status: 400 });
  }

  const { start, end } = bookingWindow();
  if (slotDate < start || slotDate >= end) {
    return jsonNoStore({ error: "slot outside booking window" }, { status: 400 });
  }

  const booked = await listActiveBookings(start.toISOString(), end.toISOString());
  const slots = generateSlots({ start, end, durationMin: service.durationMin, booked });
  if (!slots.includes(slotDate.toISOString())) {
    return jsonNoStore({ error: "slot is no longer available" }, { status: 409 });
  }

  const db = supabaseAdmin();
  const { error } = await db.from("booking_requests").insert({
    slug,
    slot: slotDate.toISOString(),
    duration_min: service.durationMin,
    name,
    email,
    notes,
  });
  if (error) {
    if (error.code === "23505") {
      return jsonNoStore({ error: "slot is no longer available" }, { status: 409 });
    }
    return jsonNoStore({ error: error.message }, { status: 500 });
  }

  return jsonNoStore({ ok: true });
}
