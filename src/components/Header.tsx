import Link from "next/link";
import { FIRM } from "@/lib/firm";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-serif-display text-lg tracking-tight">
          {FIRM.name}
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted">
          <Link href="/about" className="hover:text-black">About</Link>
          <Link href="/#coaching" className="hover:text-black">Coaching</Link>
          <Link href="/#programs" className="hover:text-black">Programs</Link>
          <Link href="/resources" className="hover:text-black">Worksheet</Link>
          <Link
            href="/booking/discovery-call"
            className="rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
          >
            Book Discovery Call
          </Link>
        </nav>
      </div>
    </header>
  );
}
