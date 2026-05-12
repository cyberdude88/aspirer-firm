import Link from "next/link";
import { Logo } from "./Logo";
import { FIRM } from "@/lib/firm";

export function Footer() {
  return (
    <footer className="foot-shell">
      <div className="foot">
        <div className="foot-brand">
          <Link href="/" className="brand">
            <Logo />
            <div className="brand-word">ASPIRER<small>FIRM</small></div>
          </Link>
          <p>Mindset coaching for entrepreneurs. Licensed mental health professional. Confidential, evidence-based, founder-fluent.</p>
        </div>
        <div>
          <h4>Work</h4>
          <Link href="/#approach">Approach</Link>
          <Link href="/#services">Services</Link>
          <Link href="/#voices">Voices</Link>
          <Link href="/resources">Resources</Link>
        </div>
        <div>
          <h4>Firm</h4>
          <Link href="/about">About</Link>
          <Link href="/about">Credentials</Link>
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
