import Link from "next/link";
import { AboutNavLink } from "./AboutNavLink";
import { LogoMark } from "./LogoMark";
import { ThemeToggle } from "./ThemeToggle";
import { FIRM } from "@/lib/firm";

export function Header() {
  return (
    <nav className="nav" id="nav">
      <div className="brand">
        <Link href="/" className="brand-logo-link" aria-label="Aspirer Firm home">
          <LogoMark />
        </Link>
        <Link href="/" className="brand-word brand-word-hero" aria-label="ASPIRER FIRM">
          <span className="brand-line brand-line-main">ASPIRER</span>
          <span className="brand-line brand-line-sub">FIRM</span>
        </Link>
      </div>
      <div className="nav-row">
        <div className="nav-links">
          <Link href="/#approach">Approach</Link>
          <Link href="/#services">Services</Link>
          <Link href="/#voices">Voices</Link>
          <AboutNavLink>About</AboutNavLink>
        </div>
        <Link href="/booking/discovery-call" className="nav-cta">Book a Call</Link>
        <ThemeToggle />
      </div>
      <span className="sr-only">{FIRM.name}</span>
    </nav>
  );
}
