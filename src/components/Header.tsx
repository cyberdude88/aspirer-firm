import Link from "next/link";
import { AboutNavLink } from "./AboutNavLink";
import { LogoMark } from "./LogoMark";
import { FIRM } from "@/lib/firm";

export function Header() {
  return (
    <nav className="nav" id="nav">
      <Link href="/" className="brand">
        <LogoMark />
        <div className="brand-word brand-word-hero" aria-label="ASPIRER FIRM">
          <span className="brand-line brand-line-main">ASPIRER</span>
          <span className="brand-line brand-line-sub">FIRM</span>
        </div>
      </Link>
      <div className="nav-row">
        <div className="nav-links">
          <a href="/#approach">Approach</a>
          <a href="/#services">Services</a>
          <a href="/#voices">Voices</a>
          <AboutNavLink>About</AboutNavLink>
        </div>
        <Link href="/booking/discovery-call" className="nav-cta">Book a Call</Link>
      </div>
      <span className="sr-only">{FIRM.name}</span>
    </nav>
  );
}
