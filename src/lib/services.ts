export const SERVICES = [
  { slug: "life-coaching-session", title: "Life Coaching Session", durationMin: 60 },
  { slug: "stress-management", title: "Stress Management", durationMin: 60 },
  { slug: "counseling", title: "Counseling", durationMin: 60 },
  { slug: "business-coaching", title: "Business Coaching", durationMin: 60 },
  { slug: "interpersonal-relationship", title: "Interpersonal Relationships", durationMin: 60 },
  { slug: "assertive-communication-skills", title: "Assertive Communication Skills", durationMin: 60 },
  { slug: "einfuhrungsberatung", title: "Introductory Consultation", durationMin: 30 },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]["slug"];
export const getService = (slug: string) => SERVICES.find(s => s.slug === slug);
