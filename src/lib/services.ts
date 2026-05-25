// Engagement tiers (public-facing). See AGENTS.md.
export const SERVICES = [
  { slug: "discovery-call", title: "Discovery Call", durationMin: 30, category: "Intake",
    blurb: "A free 30-minute call. We talk about where you are, what's costing you, and whether this work is the right fit." },
  { slug: "diagnostic", title: "The Diagnostic", durationMin: 60, category: "Engagements",
    blurb: "A two-week assessment to surface the specific patterns costing you focus, sleep and decisiveness." },
  { slug: "ninety-day-reset", title: "90-Day Reset", durationMin: 60, category: "Engagements",
    blurb: "Weekly sessions and async accountability to rebuild stamina before your next stretch quarter." },
  { slug: "annual-partnership", title: "Annual Partnership", durationMin: 60, category: "Engagements",
    blurb: "A long-term 1:1 retainer for founders running multi-year arcs. Quarterly intensives + ongoing work." },
  { slug: "team-workshops", title: "Team Workshops", durationMin: 240, category: "Engagements",
    blurb: "Executive teams under load. Half-day or two-day formats around regulation, conflict, and decision quality." },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]["slug"];
export const getService = (slug: string) => SERVICES.find(s => s.slug === slug);
export const CATEGORIES = Array.from(new Set(SERVICES.map(s => s.category)));
export const isPaidServiceSlug = (slug: string) => slug !== "discovery-call";
