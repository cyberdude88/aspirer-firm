import Link from "next/link";
import { SERVICES } from "@/lib/services";

export default function BookingIndex() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Book a Session</h1>
      <p className="mt-2 text-gray-600">Choose a service to see open times on the Aspirer Firm calendar.</p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {SERVICES.map(s => (
          <li key={s.slug}>
            <Link
              href={`/booking/${s.slug}`}
              className="block rounded border border-gray-200 p-4 hover:border-black"
            >
              <div className="font-medium">{s.title}</div>
              <div className="text-sm text-gray-500">{s.durationMin} min</div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
