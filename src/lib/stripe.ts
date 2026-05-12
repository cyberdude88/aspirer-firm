import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.acacia" as Stripe.LatestApiVersion,
});

// Map service slug -> Stripe Price ID. Service categories without paid
// engagement (e.g. the free audit) are intentionally absent here; the
// checkout route will reject any slug not present.
export const PRICE_BY_SLUG: Record<string, string | undefined> = {
  "seo": process.env.STRIPE_PRICE_SEO,
  "ppc": process.env.STRIPE_PRICE_PPC,
  "lead-generation": process.env.STRIPE_PRICE_LEAD_GEN,
  "branding-design": process.env.STRIPE_PRICE_BRANDING,
  "web-development": process.env.STRIPE_PRICE_WEB_DEV,
  "videography": process.env.STRIPE_PRICE_VIDEO,
  "content-marketing": process.env.STRIPE_PRICE_CONTENT,
  "social-media": process.env.STRIPE_PRICE_SOCIAL,
  "reputation-management": process.env.STRIPE_PRICE_REPUTATION,
  "email-marketing": process.env.STRIPE_PRICE_EMAIL,
  "legitscript-consulting": process.env.STRIPE_PRICE_LEGITSCRIPT,
};
