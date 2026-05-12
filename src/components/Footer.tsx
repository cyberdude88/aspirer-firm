import Link from "next/link";
import { FIRM } from "@/lib/firm";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <p className="font-semibold">{FIRM.name}</p>
          <p className="mt-2 max-w-sm text-sm text-gray-600">{FIRM.positioning}</p>
          <p className="mt-4 text-sm text-gray-600">
            <a href={FIRM.phoneHref} className="hover:text-black">{FIRM.phone}</a>{" · "}
            <a href={`mailto:${FIRM.email}`} className="hover:text-black">{FIRM.email}</a>
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-gray-500">Firm</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-black">About Marie</Link></li>
            <li><Link href="/#focus" className="hover:text-black">Focus Areas</Link></li>
            <li><Link href="/#who-i-help" className="hover:text-black">Who I Help</Link></li>
            <li><Link href="/#insights" className="hover:text-black">Insights</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-gray-500">Work With Me</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/booking/discovery-call" className="hover:text-black">Free Discovery Call</Link></li>
            <li><Link href="/#coaching" className="hover:text-black">1:1 Coaching</Link></li>
            <li><Link href="/#programs" className="hover:text-black">Programs</Link></li>
            <li><Link href="/resources" className="hover:text-black">Free Worksheet</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {FIRM.name}. All rights reserved.</p>
          <p>Next.js · Supabase · Stripe · Google</p>
        </div>
      </div>
    </footer>
  );
}
