import Link from "next/link";
import { Container } from "@/components/Container";
import { CardGrid, type CardItem } from "@/components/CardGrid";
import { SERVICES } from "@/lib/services";
import { FIRM, FOCUS_AREAS, WHO_I_HELP, FREE_RESOURCES, INSIGHT_THEMES } from "@/lib/firm";

const COACHING_CARDS: CardItem[] = SERVICES.filter(s => s.category === "Coaching").map(s => ({
  href: `/booking/${s.slug}`,
  title: s.title,
  description: s.blurb,
  meta: `${s.durationMin} min`,
}));

const PROGRAM_CARDS: CardItem[] = SERVICES.filter(s => s.category === "Programs").map(s => ({
  href: `/booking/${s.slug}`,
  title: s.title,
  description: s.blurb,
  meta: `${s.durationMin} min · multi-session`,
}));

const FOCUS_CARDS: CardItem[] = FOCUS_AREAS.map(f => ({
  href: "/about",
  title: f.title,
  description: f.body,
}));

const HELP_CARDS: CardItem[] = WHO_I_HELP.map(w => ({
  href: `/about#${w.slug}`,
  title: w.title,
  description: "",
}));

export default function Home() {
  const worksheet = FREE_RESOURCES[0];

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-gray-200">
        <Container className="py-24 sm:py-32">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{FIRM.positioning}</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            {FIRM.tagline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-600">
            1:1 mindset coaching for founders who want to lead from a steadier place. Sessions and
            multi-session programs available; start with a free discovery call.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/booking/discovery-call"
              className="inline-flex h-11 items-center rounded-full bg-black px-5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Book free discovery call
            </Link>
            <Link
              href="/resources"
              className="inline-flex h-11 items-center rounded-full border border-gray-300 px-5 text-sm font-medium hover:border-black"
            >
              Download free worksheet
            </Link>
          </div>
        </Container>
      </section>

      {/* Free worksheet lead magnet */}
      <section className="border-b border-gray-200 bg-gray-50/60">
        <Container className="flex flex-col gap-6 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Free Resource</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">{worksheet.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{worksheet.description}</p>
          </div>
          <Link
            href={`/resources/${worksheet.slug}`}
            className="inline-flex h-11 items-center self-start rounded-full bg-black px-5 text-sm font-medium text-white hover:bg-gray-800 sm:self-auto"
          >
            {worksheet.cta}
          </Link>
        </Container>
      </section>

      {/* Focus Areas */}
      <section id="focus">
        <Container className="py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Focus Areas</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight">
            Where this work tends to land.
          </h2>
          <p className="mt-3 max-w-2xl text-gray-600">
            The things founders most often bring into sessions — themes drawn from years of 1:1
            work and from what shows up over and over in the room.
          </p>
          <div className="mt-10">
            <CardGrid items={FOCUS_CARDS} columns={3} />
          </div>
        </Container>
      </section>

      {/* Coaching */}
      <section id="coaching" className="border-y border-gray-200 bg-gray-50/60">
        <Container className="py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Coaching</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">1:1 sessions</h2>
          <p className="mt-3 max-w-2xl text-gray-600">
            Single working sessions, scheduled on the calendar and paid through secure checkout.
          </p>
          <div className="mt-10">
            <CardGrid items={COACHING_CARDS} columns={2} />
          </div>
        </Container>
      </section>

      {/* Programs */}
      <section id="programs">
        <Container className="py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Programs</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Multi-session programs</h2>
          <p className="mt-3 max-w-2xl text-gray-600">
            For founders who want a structured arc instead of one-off support.
          </p>
          <div className="mt-10">
            <CardGrid items={PROGRAM_CARDS} columns={2} />
          </div>
        </Container>
      </section>

      {/* Who I Help */}
      <section id="who-i-help" className="border-y border-gray-200 bg-gray-50/60">
        <Container className="py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Who I Help</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Founders and operators.</h2>
          <div className="mt-10">
            <CardGrid items={HELP_CARDS} columns={4} />
          </div>
        </Container>
      </section>

      {/* Insights */}
      <section id="insights">
        <Container className="py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Insights</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Recent themes</h2>
          <p className="mt-3 max-w-2xl text-gray-600">
            Short ideas I&apos;ve been working through publicly. Long-form pieces land here too.
          </p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-3">
            {INSIGHT_THEMES.map(t => (
              <li key={t.title} className="rounded-xl border border-gray-200 p-6">
                <p className="text-base font-medium">{t.title}</p>
                <p className="mt-3 text-xs uppercase tracking-widest text-gray-500">{t.source}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-gray-200 bg-black text-white">
        <Container className="py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Get In Touch</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">Start with a free call.</h2>
          <p className="mt-4 max-w-xl text-gray-300">
            Twenty minutes, no pressure. We&apos;ll talk through what&apos;s hard right now and
            whether 1:1 coaching is the right next step.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
            <a href={FIRM.phoneHref} className="hover:underline">{FIRM.phone}</a>
            <a href={`mailto:${FIRM.email}`} className="hover:underline">{FIRM.email}</a>
          </div>
          <div className="mt-10">
            <Link
              href="/booking/discovery-call"
              className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-black hover:bg-gray-200"
            >
              Book free discovery call
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
