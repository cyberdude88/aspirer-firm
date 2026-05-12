import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.acacia" as Stripe.LatestApiVersion,
});

// Map service slug -> Stripe Price ID. The free Discovery Call is not in
// this map; the checkout route rejects any slug that isn't present.
export const PRICE_BY_SLUG: Record<string, string | undefined> = {
  "mindset-session":          process.env.STRIPE_PRICE_MINDSET_SESSION,
  "conflict-communication":   process.env.STRIPE_PRICE_CONFLICT_COMMUNICATION,
  "self-doubt-to-self-trust": process.env.STRIPE_PRICE_SELF_DOUBT,
  "resilience-intensive":     process.env.STRIPE_PRICE_RESILIENCE,
};
