import Link from "next/link";
import { FIRM } from "@/lib/firm";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-semibold tracking-tight">
          {FIRM.name}
        </Link>
        <nav className="flex items-center gap-6 text-sm text-gray-600">
          <Link href="/about" className="hover:text-black">About</Link>
          <Link href="/#what-we-do" className="hover:text-black">Services</Link>
          <Link href="/#who-we-help" className="hover:text-black">Who We Help</Link>
          <Link href="/#case-studies" className="hover:text-black">Work</Link>
          <Link
            href="/booking/audit-request"
            className="rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
          >
            Free Audit
          </Link>
        </nav>
      </div>
    </header>
  );
}
