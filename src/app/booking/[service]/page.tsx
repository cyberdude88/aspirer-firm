"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Slot = { start: string; end: string };

export default function ServiceBooking() {
  const { service } = useParams<{ service: string }>();
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/availability?slug=${service}`)
      .then(r => r.json())
      .then(d => (d.error ? setErr(d.error) : setSlots(d.slots)))
      .catch(e => setErr(String(e)));
  }, [service]);

  async function book(slot: string) {
    setBusy(true);
    const r = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug: service, slot }),
    });
    const d = await r.json();
    if (d.url) window.location.href = d.url;
    else setErr(d.error ?? "checkout failed");
    setBusy(false);
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold capitalize">{String(service).replaceAll("-", " ")}</h1>
      {err && <p className="mt-4 text-red-600">{err}</p>}
      {!slots && !err && <p className="mt-4 text-gray-500">Loading availability…</p>}
      {slots && slots.length === 0 && <p className="mt-4">No open times in the next two weeks.</p>}
      {slots && slots.length > 0 && (
        <ul className="mt-8 grid gap-2 sm:grid-cols-3">
          {slots.map(s => (
            <li key={s.start}>
              <button
                disabled={busy}
                onClick={() => book(s.start)}
                className="w-full rounded border border-gray-200 p-3 text-sm hover:border-black disabled:opacity-50"
              >
                {new Date(s.start).toLocaleString(undefined, {
                  weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                })}
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
