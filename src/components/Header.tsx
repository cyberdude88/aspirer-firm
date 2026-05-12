import Link from "next/link";
import { Logo } from "./Logo";
import { FIRM } from "@/lib/firm";

export function Header() {
  return (
    <nav className="nav" id="nav">
      <Link href="/" className="brand">
        <Logo />
        <div className="brand-word">ASPIRER<small>FIRM</small></div>
      </Link>
      <div className="nav-links">
        <Link href="/#approach">Approach</Link>
        <Link href="/#services">Services</Link>
        <Link href="/#voices">Voices</Link>
        <Link href="/about">About</Link>
      </div>
      <Link href="/booking/discovery-call" className="nav-cta">Book a Call</Link>
      <span className="sr-only">{FIRM.name}</span>
    </nav>
  );
}
