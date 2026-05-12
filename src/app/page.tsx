import Link from "next/link";
import Image from "next/image";
import { FIRM, MARQUEE_TERMS, APPROACH_STEPS, SHOWCASE_CHECKLIST, METRICS, TESTIMONIALS } from "@/lib/firm";
import { SERVICES } from "@/lib/services";

const ENGAGEMENTS = SERVICES.filter(s => s.category === "Engagements");

const ICONS = [
  <svg key="1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2v20M2 12h20"/></svg>,
  <svg key="2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  <svg key="3" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 20 L12 6 L20 20"/><path d="M8 14h8"/></svg>,
];

const CHECK = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M4 12l5 5L20 6"/></svg>
);

const ARROW = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
);

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-reveal" aria-hidden="true">
          <span className="hero-signature" />
          <span className="hero-bars" />
          <span className="hero-sheen" />
        </div>
        <div className="hero-inner">
          <span className="hero-eyebrow"><span className="dot" /><span className="mono">{FIRM.positioning.toUpperCase()}</span></span>
          <h1>
            Mindset coaching for the <em>{FIRM.taglineEm}</em> who can&apos;t afford to break.
          </h1>
          <p className="hero-sub">{FIRM.subhead}</p>
          <div className="hero-meta mono">
            <span>BUILD UNBREAKABLE RESILIENCE</span>
            <span className="sep" />
            <span>OVERCOME SELF-DOUBT</span>
            <span className="sep" />
            <span>GROW WITH CONFIDENCE</span>
          </div>
          <div className="hero-actions">
            <Link href="/booking/discovery-call" className="btn btn-primary">Book a discovery call <span className="arr">→</span></Link>
            <Link href="#approach" className="btn btn-ghost">See the approach</Link>
          </div>
        </div>
        <div className="hero-scroll"><span>SCROLL</span><div className="bar" /></div>
      </section>

      {/* MARQUEE */}
      <div className="strip">
        <div className="marquee">
          {[0, 1].map(i => (
            <span key={i}>{MARQUEE_TERMS.map(t => <span key={t}>{t}</span>)}</span>
          ))}
        </div>
      </div>

      {/* APPROACH */}
      <section className="approach" id="approach">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="sec-tag mono">01 — THE APPROACH</span>
              <h2 className="sec-title reveal">A clinical foundation. A founder&apos;s vocabulary.</h2>
            </div>
            <p className="reveal d1">Not therapy. Not hustle culture. A structured mindset practice combining licensed clinical methods with the specific pressures of building a company.</p>
          </div>
          <div className="approach-grid">
            {APPROACH_STEPS.map((s, i) => (
              <div key={s.num} className={`ap-card reveal${i ? ` d${i}` : ""}`}>
                <div>
                  <div className="ap-icon">{ICONS[i]}</div>
                  <div className="ap-num mono" style={{ marginTop: 24 }}>/ {s.num}</div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOWCASE */}
      <section className="showcase">
        <div className="wrap">
          <div className="show-grid">
            <div className="show-visual reveal">
              <Image
                src="/portrait.jpg"
                alt={`${FIRM.founder.name} — ${FIRM.founder.title}`}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="show-portrait"
                priority={false}
              />
              <div className="show-visual-shade" />
              <div className="show-stats">
                <div className="n">12+</div>
                <div className="l mono">YEARS LICENSED</div>
              </div>
            </div>
            <div className="show-body">
              <span className="sec-tag mono">02 — THE WORK</span>
              <h2 className="reveal d1">Where high performance meets <em>genuine</em> mental health.</h2>
              <p className="reveal d2">Most coaches give you a louder voice telling you to push. We give you a quieter one — and the tools, accountability and clinical depth to actually move from reactive to deliberate, from output to outcome.</p>
              <div className="checklist">
                {SHOWCASE_CHECKLIST.map((c, i) => (
                  <div key={c} className={`check reveal d${Math.min(3, 2 + Math.floor(i / 2))}`}>{CHECK}{c}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services" id="services">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="sec-tag mono">03 — ENGAGEMENTS</span>
              <h2 className="sec-title reveal">Four ways we work together.</h2>
            </div>
            <p className="reveal d1">From a focused diagnostic to a full year of compounding work. Every engagement starts with a free 30-minute call.</p>
          </div>
          <div className="svc-list">
            {ENGAGEMENTS.map((s, i) => (
              <Link key={s.slug} className={`svc-row reveal${i ? ` d${i}` : ""}`} href={`/booking/${s.slug}`}>
                <div className="svc-num mono">/ 0{i + 1}</div>
                <div className="svc-name">{s.title}</div>
                <div className="svc-desc">{s.blurb}</div>
                <div className="svc-arrow">{ARROW}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="metrics">
        <div className="wrap metrics-grid">
          {METRICS.map((m, i) => (
            <div key={m.l} className={`metric reveal${i ? ` d${i}` : ""}`}>
              <div className="n">{m.n}</div>
              <div className="l mono">{m.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* VOICES */}
      <section className="quotes" id="voices">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="sec-tag mono">04 — VOICES</span>
              <h2 className="sec-title reveal">From operators who stopped white-knuckling it.</h2>
            </div>
            <p className="reveal d1">A few words from founders, CTOs and operators who&apos;ve worked through the program.</p>
          </div>
          <div className="quotes-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.who} className={`quote reveal${i ? ` d${i}` : ""}`}>
                <div className="mark">&ldquo;</div>
                <p>{t.quote}</p>
                <div className="qfoot">
                  <div className="avatar mono">{t.avatar}</div>
                  <div>
                    <div className="who">{t.who}</div>
                    <div className="role mono">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta" id="book">
        <div className="wrap">
          <div className="cta-card">
            <div className="inside">
              <span className="sec-tag mono" style={{ justifyContent: "center", display: "inline-flex" }}>05 — BEGIN</span>
              <h2>The hardest work you&apos;ll do is the work no one sees.</h2>
              <p>Book a 30-minute discovery call. We&apos;ll talk about where you are, what&apos;s costing you, and whether this work is the right fit. No pressure, no script.</p>
              <div className="cta-actions">
                <Link href="/booking/discovery-call" className="btn btn-primary">Book a discovery call <span className="arr">→</span></Link>
                <Link href="/resources" className="btn btn-ghost">Get the free worksheet</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
