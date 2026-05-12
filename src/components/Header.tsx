import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-semibold tracking-tight">
          aspirer-firm
        </Link>
        <nav className="flex items-center gap-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-black">Home</Link>
          <Link href="/booking" className="hover:text-black">Booking</Link>
          <Link
            href="/api/auth/signin"
            className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-black hover:border-black"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
