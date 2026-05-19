import Link from "next/link";
import { AboutNavLink } from "./AboutNavLink";
import { FIRM } from "@/lib/firm";

export function Footer() {
  return (
    <footer className="foot-shell">
      <div className="foot">
        <div className="foot-brand">
          <Link href="/" className="brand">
            <div className="brand-word" aria-label="ASPIRER FIRM">
              <span className="brand-line brand-line-main">ASPIRER</span>
              <span className="brand-line brand-line-sub">FIRM</span>
            </div>
          </Link>
          <p>Mindset coaching for entrepreneurs. Licensed mental health professional. Confidential, evidence-based, founder-fluent.</p>
        </div>
        <div>
          <h4>Work</h4>
          <a href="/#approach">Approach</a>
          <a href="/#services">Services</a>
          <a href="/#voices">Voices</a>
          <Link href="/resources">Resources</Link>
        </div>
        <div>
          <h4>Firm</h4>
          <AboutNavLink>About</AboutNavLink>
          <AboutNavLink>Credentials</AboutNavLink>
          <a href={FIRM.social.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
        </div>
        <div>
          <h4>Contact</h4>
          <a href={`mailto:${FIRM.email}`}>{FIRM.email}</a>
          <a href={FIRM.phoneHref}>{FIRM.phone}</a>
          <Link href="/booking/discovery-call">Book a Call</Link>
        </div>
      </div>
      <div className="foot-bottom mono">
        <span>© {new Date().getFullYear()} ASPIRER FIRM. ALL RIGHTS RESERVED.</span>
        <span>PRIVACY · TERMS · CONFIDENTIALITY</span>
      </div>
    </footer>
  );
}
