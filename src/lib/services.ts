// Mindset-coaching service catalog. Aligns with the current Aspirer Firm
// brand: 1:1 sessions, multi-session programs, plus free resources/intake.

export const SERVICES = [
  {
    slug: "discovery-call",
    title: "Free Discovery Call",
    durationMin: 20,
    category: "Intake",
    blurb: "A short, no-pressure call to see if we're a good fit. We'll talk through what's hard right now and whether 1:1 coaching is the right next step.",
  },
  {
    slug: "mindset-session",
    title: "1:1 Mindset Coaching Session",
    durationMin: 60,
    category: "Coaching",
    blurb: "A single 60-minute working session for a specific block or decision — bring a real situation, leave with a clear move.",
  },
  {
    slug: "conflict-communication",
    title: "Conflict & Communication Session",
    durationMin: 60,
    category: "Coaching",
    blurb: "For co-founder friction, hard team conversations, or family/work overlap. Shift the frame from “me vs. you” to “us vs. the problem.”",
  },
  {
    slug: "self-doubt-to-self-trust",
    title: "Self-Doubt to Self-Trust",
    durationMin: 60,
    category: "Programs",
    blurb: "A 4-session program for founders stuck in second-guessing. Build the internal evidence base you can lead from.",
  },
  {
    slug: "resilience-intensive",
    title: "Resilience Intensive",
    durationMin: 60,
    category: "Programs",
    blurb: "A 3-session intensive for founders coming out of (or heading into) a high-stakes stretch. Designed to hold under real pressure.",
  },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]["slug"];
export const getService = (slug: string) => SERVICES.find(s => s.slug === slug);

export const CATEGORIES = Array.from(new Set(SERVICES.map(s => s.category)));
