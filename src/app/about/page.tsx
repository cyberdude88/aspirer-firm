import { Container } from "@/components/Container";
import { FIRM, TEAM } from "@/lib/firm";

export const metadata = {
  title: `About — ${FIRM.name}`,
  description: `${FIRM.positioning} Founded by ${FIRM.founder.name}.`,
};

export default function About() {
  return (
    <main>
      <section className="border-b border-gray-200">
        <Container className="py-24">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">About</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight">
            We help others, help others.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-600">
            {FIRM.name} is a digital marketing agency focused entirely on mental and behavioral
            healthcare. We exist because the programs doing real clinical work deserve marketing
            partners who understand what the work actually is.
          </p>
        </Container>
      </section>

      <section>
        <Container className="py-16">
          <div className="grid gap-12 sm:grid-cols-2">
            <div>
              <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">Our Purpose</h2>
              <p className="mt-3 text-gray-700">
                To promote treatment programs that prioritize teamwork, clear communication, and
                innovative solutions. We pride ourselves on providing ethical and practical
                marketing for mental and behavioral healthcare centers.
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">Communication is our focus</h2>
              <p className="mt-3 text-gray-700">
                The treatment industry runs on a personal touch, and our agency is no exception.
                As a boutique firm we value the personal relationships behind every engagement.
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">Results-Driven</h2>
              <p className="mt-3 text-gray-700">
                Our marketing strategies are built from deep experience in behavioral treatment
                and proven to generate qualified inquiries — not vanity traffic.
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">Where we work</h2>
              <p className="mt-3 text-gray-700">
                We&apos;re a distributed team across {FIRM.offices.slice(0, -1).join(", ")} and {FIRM.offices.slice(-1)}.
                Direct contact:{" "}
                <a href={FIRM.phoneHref} className="underline underline-offset-4">{FIRM.phone}</a>{" · "}
                <a href={`mailto:${FIRM.email}`} className="underline underline-offset-4">{FIRM.email}</a>.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-gray-200 bg-gray-50/60">
        <Container className="py-16">
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-500">Our Team</h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-3">
            {TEAM.map(p => (
              <li key={p.name} className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-medium">{p.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{p.role}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </main>
  );
}
