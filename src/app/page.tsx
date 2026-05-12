import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-24">
      <header className="mb-16">
        <p className="text-sm uppercase tracking-widest text-gray-500">Aspirer Firm</p>
        <h1 className="mt-4 text-5xl font-semibold leading-tight">
          Life coaching, on your calendar.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-gray-600">
          Personal growth and success coaching, with sessions you book in seconds.
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/booking"
            className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            Book a session
          </Link>
          <Link
            href="/api/auth/signin"
            className="rounded-full border border-gray-300 px-6 py-3 text-sm font-medium hover:border-black"
          >
            Sign in with Google
          </Link>
        </div>
      </header>

      <section>
        <h2 className="text-sm uppercase tracking-widest text-gray-500">Services</h2>
        <p className="mt-2 text-gray-600">All seven service tracks discovered in the existing site.</p>
      </section>
    </main>
  );
}
