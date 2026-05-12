import Link from "next/link";
import { Container } from "@/components/Container";
import { FIRM, WHO_I_HELP } from "@/lib/firm";

export const metadata = {
  title: `About — ${FIRM.name}`,
  description: `${FIRM.positioning}. ${FIRM.tagline}`,
};

export default function About() {
  return (
    <main>
      <section className="border-b border-gray-200">
        <Container className="py-24">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">About</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight">
            {FIRM.founder.name}
          </h1>
          <p className="mt-3 text-sm uppercase tracking-widest text-gray-500">{FIRM.founder.title}</p>
          <p className="mt-6 max-w-2xl text-lg text-gray-600">{FIRM.tagline}</p>
        </Container>
      </section>

      <section>
        <Container className="py-16">
          <div className="grid gap-12 sm:grid-cols-2">
            <div>
              <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">Approach</h2>
              <p className="mt-3 text-gray-700">
                I&apos;m a Licensed Mental Health Professional working as a mindset coach for
                entrepreneurs. The work is direct, structured, and grounded in clinical training —
                but it&apos;s not therapy. Sessions are about leverage: the small shifts that
                change how you show up to the things that already matter.
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">What sessions feel like</h2>
              <p className="mt-3 text-gray-700">
                Bring a real situation — a decision, a conflict, a stuck pattern. We unpack it,
                find the place to push, and leave with a move. Founders tend to describe the
                cadence as “practical, fast, and human.”
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">What I won&apos;t do</h2>
              <p className="mt-3 text-gray-700">
                I won&apos;t pretend to be neutral when a pattern is hurting you. I won&apos;t
                hand out generic mindset slogans. And I won&apos;t replace clinical care — when
                that&apos;s what&apos;s needed, I&apos;ll say so and help route to the right
                support.
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">Reach me</h2>
              <p className="mt-3 text-gray-700">
                <a href={FIRM.phoneHref} className="underline underline-offset-4">{FIRM.phone}</a>{" · "}
                <a href={`mailto:${FIRM.email}`} className="underline underline-offset-4">{FIRM.email}</a>
                {" · "}
                <a href={FIRM.social.facebook} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Facebook</a>
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-gray-200 bg-gray-50/60">
        <Container className="py-16">
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-500">Who I Help</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHO_I_HELP.map(w => (
              <li key={w.slug} id={w.slug} className="rounded-xl border border-gray-200 bg-white p-5">
                <p className="font-medium">{w.title}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Link
              href="/booking/discovery-call"
              className="inline-flex h-11 items-center rounded-full bg-black px-5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Book free discovery call
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
