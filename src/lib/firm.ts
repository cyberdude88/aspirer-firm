// Single source of truth for brand + firm-wide constants.
// Sourced from the current Aspirer Firm Facebook page (2026):
//   Mindset Coach for Entrepreneurs · Licensed Mental Health Professional.

export const FIRM = {
  name: "Aspirer Firm",
  positioning: "Mindset Coach for Entrepreneurs · Licensed Mental Health Professional",
  tagline: "Helping founders build unbreakable resilience, overcome self-doubt, and grow with confidence.",
  shortTagline: "Build unbreakable resilience.",
  email: "marie.cook@aspirerfirm.com",
  phone: "+1 401-684-1450",
  phoneHref: "tel:+14016841450",
  founder: { name: "Marie Cook", title: "Licensed Mental Health Professional · Mindset Coach" },
  social: {
    facebook: "https://www.facebook.com/people/Aspirer-Firm/61574700312914/",
    twitter: "https://twitter.com/Aspirerfim",
    instagram: "",
    linkedin: "",
  },
} as const;

export const FOCUS_AREAS = [
  { title: "Unbreakable Resilience",  body: "Tools that hold up under real-world founder pressure — not just on a good day." },
  { title: "Overcoming Self-Doubt",   body: "Move from second-guessing to clear, confident decisions you can stand behind." },
  { title: "Growth Mindset",          body: "Reframe setbacks as data, not verdicts — the engine behind compounding progress." },
  { title: "Patience & Composure",    body: "Stay grounded when timelines slip and stakes rise; lead from a steadier place." },
  { title: "Conflict & Communication", body: "Shift from “me vs. you” to “us vs. the problem.” Honest, low-heat conversations." },
  { title: "Confidence Under Pressure", body: "Public-facing moments — pitches, hard calls, hiring/firing — without the spiral." },
] as const;

export const WHO_I_HELP = [
  { title: "Solo Founders",      slug: "solo-founders" },
  { title: "Early-Stage Operators", slug: "early-stage" },
  { title: "Scaling Founders",   slug: "scaling-founders" },
  { title: "Co-Founder Pairs",   slug: "co-founders" },
] as const;

export const FREE_RESOURCES = [
  {
    slug: "frugality-growth-mindset-worksheet",
    title: "Frugality Growth Mindset Worksheet",
    description: "The free worksheet I share most often — a short, structured prompt set for founders who want to reset their relationship with scarcity and decision pressure.",
    cta: "Download free",
  },
] as const;

export const INSIGHT_THEMES = [
  { title: "Without patience, people often…", source: "Aspirer Firm · social" },
  { title: "Us vs. the problem, not me vs. you", source: "Aspirer Firm · social" },
  { title: "Why the right mindset makes all the difference", source: "Aspirer Firm · social" },
] as const;
