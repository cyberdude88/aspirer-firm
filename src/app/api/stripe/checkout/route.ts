import { NextRequest, NextResponse } from "next/server";
import { getStripe, PRICE_BY_SLUG } from "@/lib/stripe";
import { getService, isPaidServiceSlug } from "@/lib/services";

export async function POST(req: NextRequest) {
  const { slug, slot, name, email, notes } = await req.json();
  const service = getService(slug);
  const priceId = PRICE_BY_SLUG[slug];

  if (!service || !isPaidServiceSlug(slug) || !priceId) {
    return NextResponse.json({ error: "unknown service or unpriced" }, { status: 400 });
  }

  if (!slot || !email) {
    return NextResponse.json({ error: "slot and email are required" }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? "http://localhost:3000";
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: email,
    success_url: `${origin}/booking/confirmed?slug=${slug}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/booking/${slug}`,
    metadata: {
      slug,
      slot,
      name: name ?? "",
      email,
      notes: notes ?? "",
    },
  });

  return NextResponse.json({ url: session.url });
}
