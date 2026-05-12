import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createBooking } from "@/lib/google";
import { getService } from "@/lib/services";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return NextResponse.json({ error: "missing signature/secret" }, { status: 400 });

  const body = await req.text();
  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    return NextResponse.json({ error: `bad signature: ${(err as Error).message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object;
    const slug = s.metadata?.slug ?? "";
    const slot = s.metadata?.slot ?? "";
    const service = getService(slug);
    const customerEmail = s.customer_details?.email;

    if (service && slot && customerEmail) {
      const start = new Date(slot);
      const end = new Date(start.getTime() + service.durationMin * 60_000);
      await createBooking({
        summary: `${service.title} — ${customerEmail}`,
        description: `Paid via Stripe session ${s.id}`,
        start: start.toISOString(),
        end: end.toISOString(),
        attendeeEmail: customerEmail,
      });
      await supabaseAdmin().from("bookings").insert({
        slug,
        slot: start.toISOString(),
        customer_email: customerEmail,
        stripe_session_id: s.id,
      });
    }
  }

  return NextResponse.json({ received: true });
}
