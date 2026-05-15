import Link from "next/link";
import { FIRM, WHO_I_HELP } from "@/lib/firm";
import { AboutPortraitCard } from "@/components/AboutPortraitCard";

export const metadata = {
  title: `About — ${FIRM.name}`,
  description: `${FIRM.positioning}. ${FIRM.tagline}`,
};

const PILLARS = [
  {
    tag: "APPROACH",
    title: "Clinical depth, founder fluency.",
    body: "A Licensed Mental Health Professional working as a mindset coach for entrepreneurs. The work is direct, structured, grounded in clinical training — but it isn't therapy. Sessions are about leverage: small shifts that change how you show up to the things that already matter.",
  },
  {
    tag: "WHAT SESSIONS FEEL LIKE",
    title: "Practical, fast, and human.",
    body: "Bring a real situation — a decision, a conflict, a stuck pattern. We unpack it, find the place to push, and leave with a move. Founders tend to describe the cadence as direct without being cold.",
  },
  {
    tag: "WHAT I WON'T DO",
    title: "No slogans. No theatre.",
    body: "I won't pretend to be neutral when a pattern is hurting you. I won't hand out generic mindset slogans. And I won't replace clinical care — when that's what's needed, I'll say so and help route to the right support.",
  },
  {
    tag: "REACH ME",
    title: "Direct line, no gatekeepers.",
    body: "Phone, email, or social. I read everything that comes in and answer personally — typically within a business day.",
    links: [
      { label: FIRM.phone, href: FIRM.phoneHref },
      { label: FIRM.email, href: `mailto:${FIRM.email}` },
      { label: "Facebook", href: FIRM.social.facebook, external: true },
    ],
  },
];

export default function About() {
  return (
    <main>
      <section className="approach about-intro" style={{ paddingBottom: 80 }}>
        <div className="wrap">
          <div className="about-hero-grid">
            <div>
              <span className="sec-tag mono">— ABOUT</span>
              <h1 className="sec-title reveal" style={{ marginTop: 18 }}>{FIRM.founder.name}</h1>
              <p className="mono reveal d1" style={{ marginTop: 18, fontSize: 12, letterSpacing: ".24em", color: "var(--gold)", textTransform: "uppercase" }}>
                {FIRM.founder.title}
              </p>
              <p className="reveal d2" style={{ marginTop: 28, maxWidth: "56ch", color: "var(--mute)", fontSize: 17, lineHeight: 1.65 }}>
                {FIRM.tagline}
              </p>
            </div>
            <AboutPortraitCard />
          </div>
        </div>
      </section>

      <section className="approach" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="approach-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
            {PILLARS.map((p, i) => (
              <div key={p.tag} className={`ap-card reveal${i ? ` d${i}` : ""}`}>
                <div>
                  <div className="ap-num mono">/ {p.tag}</div>
                  <h3 style={{ marginTop: 14 }}>{p.title}</h3>
                  <p>{p.body}</p>
                  {p.links && (
                    <p style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: "10px 18px" }}>
                      {p.links.map(l => (
                        <a
                          key={l.label}
                          href={l.href}
                          {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          style={{ color: "var(--gold)", borderBottom: "1px solid rgba(201,168,117,.4)", paddingBottom: 2 }}
                        >
                          {l.label}
                        </a>
                      ))}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="quotes" id="who">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="sec-tag mono">— WHO I HELP</span>
              <h2 className="sec-title reveal">Built for these operators.</h2>
            </div>
            <p className="reveal d1">If you recognise yourself in one of these — or the gap between them — this is the room for that work.</p>
          </div>
          <div className="quotes-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {WHO_I_HELP.map((w, i) => (
              <div key={w.slug} id={w.slug} className={`quote reveal${i ? ` d${Math.min(3, i)}` : ""}`}>
                <div className="mark">·</div>
                <p style={{ fontSize: 18, fontWeight: 500 }}>{w.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="wrap">
          <div className="cta-card">
            <div className="inside">
              <span className="sec-tag mono" style={{ justifyContent: "center", display: "inline-flex" }}>— BEGIN</span>
              <h2>Ready to take the next step?</h2>
              <p>Free 30-minute discovery call. We&apos;ll talk about where you are, what&apos;s costing you, and whether this work is the right fit.</p>
              <div className="cta-actions">
                <Link href="/booking/discovery-call" className="btn btn-primary">Book a discovery call <span className="arr">→</span></Link>
                <a href="/#approach" className="btn btn-ghost">See the approach</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
