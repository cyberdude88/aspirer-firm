import Link from "next/link";
import { Logo } from "./Logo";
import { FIRM } from "@/lib/firm";

export function Header() {
  return (
    <nav className="nav" id="nav">
      <Link href="/" className="brand">
        <Logo
          src="/logowhite.png"
          alt="Aspirer Firm logo"
          width={347}
          height={231}
        />
        <div className="brand-word brand-word-hero" aria-label="ASPIRER FIRM">
          <span className="brand-line brand-line-main">ASPIRER</span>
          <span className="brand-line brand-line-sub">FIRM</span>
        </div>
      </Link>
      <div className="nav-row">
        <div className="nav-links">
          <Link href="/#approach">Approach</Link>
          <Link href="/#services">Services</Link>
          <Link href="/#voices">Voices</Link>
          <Link href="/about">About</Link>
        </div>
        <Link href="/booking/discovery-call" className="nav-cta">Book a Call</Link>
      </div>
      <span className="sr-only">{FIRM.name}</span>
    </nav>
  );
}
