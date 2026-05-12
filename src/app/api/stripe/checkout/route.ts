import { NextRequest, NextResponse } from "next/server";
import { stripe, PRICE_BY_SLUG } from "@/lib/stripe";
import { getService } from "@/lib/services";

export async function POST(req: NextRequest) {
  const { slug, slot } = await req.json();
  const service = getService(slug);
  const priceId = PRICE_BY_SLUG[slug];
  if (!service || !priceId) {
    return NextResponse.json({ error: "unknown service or unpriced" }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/booking/confirmed?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/booking/${slug}`,
    metadata: { slug, slot: slot ?? "" },
  });

  return NextResponse.json({ url: session.url });
}
