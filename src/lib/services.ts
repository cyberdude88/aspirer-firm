export const SERVICES = [
  {
    slug: "life-coaching-session",
    title: "Life Coaching Session",
    durationMin: 60,
    blurb: "One-on-one coaching to clarify goals, build momentum, and stay accountable.",
  },
  {
    slug: "stress-management",
    title: "Stress Management",
    durationMin: 60,
    blurb: "Practical tools for handling pressure, anxiety, and burnout — built around your situation.",
  },
  {
    slug: "counseling",
    title: "Counseling",
    durationMin: 60,
    blurb: "Confidential conversation focused on personal challenges and emotional clarity.",
  },
  {
    slug: "business-coaching",
    title: "Business Coaching",
    durationMin: 60,
    blurb: "Leadership, strategy, and execution coaching for owners and operators.",
  },
  {
    slug: "interpersonal-relationship",
    title: "Interpersonal Relationships",
    durationMin: 60,
    blurb: "Communication patterns, boundaries, and conflict resolution at work and at home.",
  },
  {
    slug: "assertive-communication-skills",
    title: "Assertive Communication Skills",
    durationMin: 60,
    blurb: "Speak clearly, hold your ground, and stay respectful — even in hard conversations.",
  },
  {
    slug: "einfuhrungsberatung",
    title: "Introductory Consultation",
    durationMin: 30,
    blurb: "A short intake call to figure out which track fits and answer any questions.",
  },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]["slug"];
export const getService = (slug: string) => SERVICES.find(s => s.slug === slug);
