"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { FREE_RESOURCES } from "@/lib/firm";

export default function ResourceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const resource = FREE_RESOURCES.find(r => r.slug === slug);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!resource) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="text-3xl font-semibold">Not found</h1>
        <p className="mt-2 text-gray-600">No resource at this slug.</p>
      </main>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const r = await fetch("/api/resources/request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, email }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? "request failed");
      setSent(true);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Free Resource</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{resource.title}</h1>
      <p className="mt-4 text-gray-700">{resource.description}</p>

      {!sent ? (
        <form onSubmit={submit} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-11 flex-1 rounded-full border border-gray-300 px-4 text-sm focus:border-black focus:outline-none"
          />
          <button
            disabled={busy}
            className="h-11 rounded-full bg-black px-5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {busy ? "Sending…" : resource.cta}
          </button>
        </form>
      ) : (
        <p className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6 text-sm">
          Sent. Check your inbox — if it doesn&apos;t arrive in a few minutes look in spam, then
          email <span className="font-medium">marie.cook@aspirerfirm.com</span> and I&apos;ll forward it directly.
        </p>
      )}
      {err && <p className="mt-4 text-sm text-red-600">{err}</p>}
    </main>
  );
}
