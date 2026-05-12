// Brand source of truth. See AGENTS.md before editing.

export const FIRM = {
  name: "Aspirer Firm",
  positioning: "Licensed Mental Health Professional",
  tagline: "Mindset coaching for the builders who can't afford to break.",
  taglineEm: "builders",
  subhead: "Private, evidence-based mindset work for founders, operators and creatives — built to dissolve self-doubt, regulate pressure, and compound resilience through every cycle of the company you're building.",
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

export const MARQUEE_TERMS = [
  "RESILIENCE", "FOCUS", "CLARITY", "NERVOUS-SYSTEM REGULATION",
  "EXECUTIVE PRESENCE", "SELF-TRUST", "RECOVERY",
] as const;

export const APPROACH_STEPS = [
  { num: "01", title: "Diagnose the operating pattern.",
    body: "We map where pressure, avoidance, and self-doubt actually live in your week — not in theory, in your calendar." },
  { num: "02", title: "Rewire the response.",
    body: "Evidence-based protocols (CBT, ACT, somatic) translated into 5-minute interventions you'll actually run between meetings." },
  { num: "03", title: "Compound the gain.",
    body: "Weekly recalibration so resilience becomes infrastructure — not a state you have to muster before every hard conversation." },
] as const;

export const SHOWCASE_CHECKLIST = [
  "1:1 private engagement, fully confidential",
  "Clinical credentials — licensed mental health professional",
  "Founder-shaped sessions, 45 min, between your blocks",
  "Quarterly recalibration & async support between",
] as const;

export const METRICS = [
  { n: "12+",  l: "Years Licensed Practice" },
  { n: "240",  l: "Founders Coached" },
  { n: "94%",  l: "Renewal Rate" },
  { n: "3.8×", l: "Avg. Reported Clarity Gain" },
] as const;

export const TESTIMONIALS = [
  { quote: "I came in burned out and convinced I was the problem. Six weeks later my team noticed the difference before I did. This is the work I should have done five years ago.",
    who: "Maya R.", role: "Founder · Series B SaaS", avatar: "MR" },
  { quote: "Half coach, half clinician, completely founder-fluent. The clinical depth is the thing — everything else I'd tried was vibes. This is operating system work.",
    who: "Daniel K.", role: "CEO · Climate Tech", avatar: "DK" },
  { quote: "Made me a calmer leader and, somehow, a sharper one. Board meetings don't wreck me anymore. Decisions feel like decisions, not survival.",
    who: "Anika S.", role: "COO · Health Tech", avatar: "AS" },
] as const;

export const WHO_I_HELP = [
  { title: "Solo Founders",          slug: "solo-founders" },
  { title: "Early-Stage Operators",  slug: "early-stage" },
  { title: "Scaling Founders",       slug: "scaling-founders" },
  { title: "Co-Founder Pairs",       slug: "co-founders" },
] as const;

export const FREE_RESOURCES = [
  { slug: "frugality-growth-mindset-worksheet",
    title: "Frugality Growth Mindset Worksheet",
    description: "A short, structured prompt set for founders who want to reset their relationship with scarcity and decision pressure.",
    cta: "Download free" },
] as const;

export const FOCUS_AREAS = [
  { title: "Unbreakable Resilience",     body: "Tools that hold up under real-world founder pressure — not just on a good day." },
  { title: "Overcoming Self-Doubt",      body: "Move from second-guessing to clear, confident decisions you can stand behind." },
  { title: "Growth Mindset",             body: "Reframe setbacks as data, not verdicts — the engine behind compounding progress." },
  { title: "Patience & Composure",       body: "Stay grounded when timelines slip and stakes rise; lead from a steadier place." },
  { title: "Conflict & Communication",   body: "Shift from “me vs. you” to “us vs. the problem.” Honest, low-heat conversations." },
  { title: "Confidence Under Pressure",  body: "Public-facing moments — pitches, hard calls, hiring/firing — without the spiral." },
] as const;

export const INSIGHT_THEMES = [
  { title: "Without patience, people often…",            source: "Aspirer Firm · social" },
  { title: "Us vs. the problem, not me vs. you",         source: "Aspirer Firm · social" },
  { title: "Why the right mindset makes all the difference", source: "Aspirer Firm · social" },
] as const;
