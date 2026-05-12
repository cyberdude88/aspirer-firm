import { Container } from "@/components/Container";
import { CardGrid, type CardItem } from "@/components/CardGrid";

const SECTIONS: CardItem[] = [
  {
    href: "/booking",
    title: "Booking",
    description: "Pick a service, see open times from the connected Google Calendar, pay with Stripe.",
    meta: "/booking",
  },
  {
    href: "/api/auth/signin",
    title: "Sign in",
    description: "Google OAuth via NextAuth. Calendar.events scope is requested up front.",
    meta: "/api/auth",
  },
  {
    href: "/api/availability?slug=life-coaching-session",
    title: "Availability API",
    description: "Server-side free/busy query against the owner calendar, sliced into bookable slots.",
    meta: "/api/availability",
  },
  {
    href: "/api/stripe/checkout",
    title: "Stripe Checkout",
    description: "Create a Checkout Session per slot. Webhook handler commits the calendar event.",
    meta: "/api/stripe/checkout",
  },
];

export default function Home() {
  return (
    <main>
      <section className="border-b border-gray-200">
        <Container className="py-24 sm:py-32">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">aspirer-firm</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            A clean Next.js front end, wired to Supabase, Stripe, and Google.
          </h1>
          <p className="mt-6 max-w-xl text-base text-gray-600 sm:text-lg">
            Booking, payments, and calendar sync — scaffolded and ready to extend.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="/booking"
              className="inline-flex h-11 items-center rounded-full bg-black px-5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Open booking
            </a>
            <a
              href="/api/auth/signin"
              className="inline-flex h-11 items-center rounded-full border border-gray-300 px-5 text-sm font-medium hover:border-black"
            >
              Sign in with Google
            </a>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-16">
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="text-xs uppercase tracking-[0.2em] text-gray-500">Endpoints</h2>
            <span className="text-xs text-gray-400">scaffolded routes</span>
          </div>
          <CardGrid items={SECTIONS} />
        </Container>
      </section>
    </main>
  );
}
