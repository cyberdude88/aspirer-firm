import Stripe from "stripe";

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  return new Stripe(secretKey, {
    apiVersion: "2025-09-30.acacia" as Stripe.LatestApiVersion,
  });
}

export const PRICE_BY_SLUG: Record<string, string | undefined> = {
  diagnostic: process.env.STRIPE_PRICE_DIAGNOSTIC,
  "ninety-day-reset": process.env.STRIPE_PRICE_NINETY_DAY_RESET,
  "annual-partnership": process.env.STRIPE_PRICE_ANNUAL_PARTNERSHIP,
  "team-workshops": process.env.STRIPE_PRICE_TEAM_WORKSHOPS,
};
