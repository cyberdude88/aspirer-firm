// Single source of truth for brand + firm-wide constants.
// Sourced from the 2024 web.archive snapshot of aspirerfirm.com.

export const FIRM = {
  name: "Aspirer Firm",
  tagline: "We help others, help others.",
  positioning: "Digital marketing agency for mental & behavioral healthcare.",
  email: "marie.cook@aspirerfirm.com",
  phone: "+1 757-861-3906",
  phoneHref: "tel:+17578613906",
  offices: ["Virginia", "New York", "California", "Texas"],
  founder: { name: "Marie Cook", title: "C.E.O." },
  social: {
    twitter: "https://twitter.com/Aspirerfim",
    instagram: "",
    linkedin: "",
    facebook: "",
  },
} as const;

export const INDUSTRIES = [
  { title: "Addiction Treatment Centers",  slug: "addiction-treatment" },
  { title: "Mental Health Treatment",      slug: "mental-health" },
  { title: "Eating Disorder Treatment",    slug: "eating-disorder" },
  { title: "Non-Profit Programs",          slug: "non-profits" },
  { title: "Hospitals & Clinics",          slug: "hospitals-clinics" },
  { title: "Healthcare Marketing",         slug: "healthcare-marketing" },
] as const;

export const CASE_STUDIES = [
  { title: "Robert Alexander Center",   note: "Treatment center brand and digital footprint" },
  { title: "Atlanta Recovery Place",    note: "Conversion-focused web rebuild + inbound funnel" },
  { title: "Laguna View Detox",         note: "300% increase in conversions, first 3 months" },
  { title: "The Last House",            note: "Reputation management + content strategy" },
] as const;

export const TEAM = [
  { name: "Marie Cook",  role: "C.E.O." },
  { name: "Allen Cook",  role: "VP, Marketing & Operations" },
  { name: "Harris",      role: "Web Developer & Graphic Designer" },
] as const;

export const TESTIMONIALS = [
  {
    quote: "They are forever my go-to for branding, content and digital marketing. Their team is extremely knowledgeable and creative.",
    attribution: "Client, Treatment Center",
  },
  {
    quote: "Amazing to work with — knowledgeable, easy to communicate with, and full of good suggestions for increased business and overall marketing strategy.",
    attribution: "Client, Behavioral Health",
  },
  {
    quote: "Two years working with Aspirer Firm and they have completely changed our digital footprint.",
    attribution: "Client, Healthcare Program",
  },
] as const;
