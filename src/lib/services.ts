// Real Aspirer Firm service categories (sourced from 2024 web.archive snapshot).
// Booking durationMin is the standard intake/strategy-session length used by the
// /api/availability slot generator.

export const SERVICES = [
  {
    slug: "audit-request",
    title: "Free Audit Request",
    durationMin: 30,
    category: "Intake",
    blurb: "A 30-minute call with our team to review your current marketing footprint and identify gaps before any engagement.",
  },
  {
    slug: "seo",
    title: "Search Engine Optimization",
    durationMin: 60,
    category: "Digital Marketing",
    blurb: "Healthcare-aware SEO: technical audit, content strategy, and link-building tuned for treatment center search intent.",
  },
  {
    slug: "ppc",
    title: "Pay Per Click Advertising",
    durationMin: 60,
    category: "Digital Marketing",
    blurb: "LegitScript-compliant paid search and social campaigns built for the addiction and behavioral-health space.",
  },
  {
    slug: "lead-generation",
    title: "Lead Generation",
    durationMin: 60,
    category: "Digital Marketing",
    blurb: "Inbound funnels designed to fill beds responsibly — qualified inquiries, not vanity volume.",
  },
  {
    slug: "branding-design",
    title: "Branding & Design",
    durationMin: 60,
    category: "Design",
    blurb: "Brand identity, logo, visual system, and collateral that reads as trustworthy in a sensitive industry.",
  },
  {
    slug: "web-development",
    title: "Web Design & Development",
    durationMin: 60,
    category: "Design",
    blurb: "Conversion-focused websites for treatment centers, clinics, and behavioral-health programs.",
  },
  {
    slug: "videography",
    title: "Videography",
    durationMin: 60,
    category: "Design",
    blurb: "Patient stories, facility walk-throughs, and clinician introductions filmed with care and consent.",
  },
  {
    slug: "content-marketing",
    title: "Content Marketing",
    durationMin: 60,
    category: "Content & Social",
    blurb: "Editorial that earns trust: clinical-grade explainers, family-facing guides, and evergreen resources.",
  },
  {
    slug: "social-media",
    title: "Social Media Marketing",
    durationMin: 60,
    category: "Content & Social",
    blurb: "Calendar, creative, and community management across the platforms your audience actually uses.",
  },
  {
    slug: "reputation-management",
    title: "Reputation Management",
    durationMin: 60,
    category: "Content & Social",
    blurb: "Reviews, listings, and crisis response — protect the trust your program has built.",
  },
  {
    slug: "email-marketing",
    title: "Email Marketing",
    durationMin: 60,
    category: "Content & Social",
    blurb: "Lifecycle, referral, and alumni nurture programs that respect HIPAA boundaries.",
  },
  {
    slug: "legitscript-consulting",
    title: "LegitScript Consulting",
    durationMin: 60,
    category: "Consulting",
    blurb: "Application prep, policy documentation, and ongoing compliance for LegitScript certification.",
  },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]["slug"];
export const getService = (slug: string) => SERVICES.find(s => s.slug === slug);

export const CATEGORIES = Array.from(new Set(SERVICES.map(s => s.category)));
