import Link from "next/link";
import { Container } from "@/components/Container";
import { FREE_RESOURCES } from "@/lib/firm";

export const metadata = {
  title: "Free resources — Aspirer Firm",
  description: "Free worksheets and tools from Aspirer Firm.",
};

export default function Resources() {
  return (
    <main>
      <Container className="py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Free Resources</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Tools you can use today</h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          Short, opinionated worksheets — no upsell, no email-only locks.
        </p>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {FREE_RESOURCES.map(r => (
            <li key={r.slug}>
              <Link
                href={`/resources/${r.slug}`}
                className="block h-full rounded-xl border border-gray-200 p-6 transition-colors hover:border-black"
              >
                <h2 className="text-lg font-medium">{r.title}</h2>
                <p className="mt-2 text-sm text-gray-600">{r.description}</p>
                <span className="mt-4 inline-block text-xs font-medium text-gray-700">{r.cta} →</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
