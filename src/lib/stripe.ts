import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.acacia" as Stripe.LatestApiVersion,
});

export const PRICE_BY_SLUG: Record<string, string | undefined> = {
  "stress-management": process.env.STRIPE_PRICE_STRESS_MANAGEMENT,
  "life-coaching-session": process.env.STRIPE_PRICE_LIFE_COACHING,
  "counseling": process.env.STRIPE_PRICE_COUNSELING,
  "business-coaching": process.env.STRIPE_PRICE_BUSINESS_COACHING,
  "interpersonal-relationship": process.env.STRIPE_PRICE_INTERPERSONAL,
  "assertive-communication-skills": process.env.STRIPE_PRICE_ASSERTIVE,
  "einfuhrungsberatung": process.env.STRIPE_PRICE_INTRO,
};
