import Link from "next/link";
import { Container } from "@/components/Container";
import { CardGrid, type CardItem } from "@/components/CardGrid";
import { SERVICES, CATEGORIES } from "@/lib/services";
import { FIRM, INDUSTRIES, CASE_STUDIES, TESTIMONIALS } from "@/lib/firm";

const SERVICE_CARDS: CardItem[] = SERVICES.filter(s => s.category !== "Intake").map(s => ({
  href: `/booking/${s.slug}`,
  title: s.title,
  description: s.blurb,
  meta: s.category,
}));

const INDUSTRY_CARDS: CardItem[] = INDUSTRIES.map(i => ({
  href: `/who-we-help#${i.slug}`,
  title: i.title,
  description: "",
}));

export default function Home() {
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
            {FIRM.name} is the go-to digital marketing agency for the treatment industry. Our work
            has a profound impact — helping you help others.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/booking/audit-request"
              className="inline-flex h-11 items-center rounded-full bg-black px-5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Get a Free Audit
            </Link>
            <Link
              href="/booking"
              className="inline-flex h-11 items-center rounded-full border border-gray-300 px-5 text-sm font-medium hover:border-black"
            >
              Book a Strategy Session
            </Link>
          </div>
        </Container>
      </section>

      {/* Who We Are */}
      <section id="who-we-are">
        <Container className="py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Who We Are</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight">
            We help others, help others.
          </h2>
          <div className="mt-6 grid gap-8 text-gray-700 sm:grid-cols-2">
            <p>
              Our objective is to promote treatment programs that prioritize teamwork, clear
              communication, and innovative solutions. As a boutique firm we value the personal
              relationships behind every engagement — the treatment industry runs on a personal
              touch, and so do we.
            </p>
            <p>
              We provide a comprehensive range of services to help your center establish and
              expand its brand: digital marketing, design, content, and consulting. Our extensive
              experience in mental and behavioral healthcare lets us move quickly without losing
              the care this industry demands.
            </p>
          </div>
          <div className="mt-8">
            <Link href="/about" className="text-sm font-medium underline underline-offset-4 hover:text-black">
              More about us →
            </Link>
          </div>
        </Container>
      </section>

      {/* What We Do — services grouped by category */}
      <section id="what-we-do" className="border-y border-gray-200 bg-gray-50/60">
        <Container className="py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">What We Do</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Services</h2>
          <p className="mt-3 max-w-2xl text-gray-600">
            Every track below opens a booking page where you can pick a time on our team calendar
            and check out securely.
          </p>

          <div className="mt-12 space-y-12">
            {CATEGORIES.filter(c => c !== "Intake").map(cat => {
              const cards = SERVICE_CARDS.filter(s => s.meta === cat);
              return (
                <div key={cat}>
                  <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-gray-500">{cat}</h3>
                  <CardGrid items={cards} columns={3} />
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Who We Help */}
      <section id="who-we-help">
        <Container className="py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Who We Help</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Built for the treatment industry</h2>
          <div className="mt-10">
            <CardGrid items={INDUSTRY_CARDS} columns={3} />
          </div>
        </Container>
      </section>

      {/* Case Studies */}
      <section id="case-studies" className="border-y border-gray-200 bg-gray-50/60">
        <Container className="py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Case Studies</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Examples of our work</h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {CASE_STUDIES.map(c => (
              <li key={c.title} className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-medium">{c.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{c.note}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Testimonials */}
      <section id="testimonials">
        <Container className="py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Testimonials</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">What our clients say</h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map(t => (
              <li key={t.attribution} className="rounded-xl border border-gray-200 p-6">
                <p className="text-sm text-gray-700">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 text-xs uppercase tracking-widest text-gray-500">{t.attribution}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-gray-200 bg-black text-white">
        <Container className="py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Get In Touch</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">Work with us.</h2>
          <p className="mt-4 max-w-xl text-gray-300">
            Tell us about your program. We&apos;ll send a comprehensive plan — marketing, branding,
            or both — built for the realities of behavioral healthcare.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
            <a href={FIRM.phoneHref} className="hover:underline">{FIRM.phone}</a>
            <a href={`mailto:${FIRM.email}`} className="hover:underline">{FIRM.email}</a>
            <span className="text-gray-400">{FIRM.offices.join(" · ")}</span>
          </div>
          <div className="mt-10">
            <Link
              href="/booking/audit-request"
              className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-black hover:bg-gray-200"
            >
              Request a free audit
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
