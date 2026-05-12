import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.acacia" as Stripe.LatestApiVersion,
});

export const PRICE_BY_SLUG: Record<string, string | undefined> = {
  "diagnostic":          process.env.STRIPE_PRICE_DIAGNOSTIC,
  "ninety-day-reset":    process.env.STRIPE_PRICE_NINETY_DAY,
  "annual-partnership":  process.env.STRIPE_PRICE_ANNUAL,
  "team-workshops":      process.env.STRIPE_PRICE_TEAM_WORKSHOPS,
};
