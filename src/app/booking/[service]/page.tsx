"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getService, isPaidServiceSlug } from "@/lib/services";

type FetchState = "loading" | "ready" | "error";

export default function ServiceBooking() {
  const { service } = useParams<{ service: string }>();
  const router = useRouter();
  const serviceDef = getService(service);
  const isPaidService = isPaidServiceSlug(service);

  const [slots, setSlots] = useState<string[]>([]);
  const [state, setState] = useState<FetchState>("loading");
  const [err, setErr] = useState<string | null>(null);
  const [loadingLabel, setLoadingLabel] = useState("Loading.");

  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState<string | null>(null);
  const [timeZone, setTimeZone] = useState("");

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  useEffect(() => {
    if (state !== "loading") {
      setLoadingLabel("Loading.");
      return;
    }

    const labels = ["Loading.", "Loading..", "Loading..."];
    let index = 0;
    const timer = window.setInterval(() => {
      index = (index + 1) % labels.length;
      setLoadingLabel(labels[index]);
    }, 450);

    return () => window.clearInterval(timer);
  }, [state]);

  useEffect(() => {
    setState("loading");
    fetch(`/api/availability?slug=${service}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) { setErr(d.error); setState("error"); return; }
        setSlots(d.slots ?? []);
        setState("ready");
      })
      .catch(e => { setErr(String(e)); setState("error"); });
  }, [service]);

  const slotsByDay = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const iso of slots) {
      const d = new Date(iso);
      const key = dayKey(d);
      const arr = map.get(key) ?? [];
      arr.push(iso);
      map.set(key, arr);
    }
    return map;
  }, [slots]);

  const today = useMemo(() => startOfDay(new Date()), []);
  const windowEnd = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 90);
    return d;
  }, [today]);

  const monthCells = useMemo(() => buildMonthCells(viewMonth), [viewMonth]);

  const canPrev = viewMonth > new Date(today.getFullYear(), today.getMonth(), 1);
  const canNext = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1) <= windowEnd;

  async function submit() {
    if (!selectedSlot || !serviceDef) return;

    setSubmitting(true);
    setSubmitErr(null);

    try {
      if (isPaidService) {
        const r = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ slug: service, slot: selectedSlot, name, email, notes }),
        });
        const d = await r.json().catch(() => ({}));

        if (!r.ok || !d.url) {
          setSubmitErr(d.error ?? "Could not start checkout");
          setSubmitting(false);
          return;
        }

        window.location.href = d.url;
        return;
      }

      const r = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug: service, slot: selectedSlot, name, email, notes }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        setSubmitErr(d.error ?? "Could not submit");
        setSubmitting(false);
        return;
      }

      router.push(`/booking/requested?slug=${service}`);
    } catch (error) {
      setSubmitErr(error instanceof Error ? error.message : "Could not submit");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
  }

  return (
    <main className="mx-auto max-w-4xl px-6 pb-20 pt-44 text-[color:var(--text-strong)] md:pt-56">
      <p className="mono text-xs uppercase tracking-widest text-[color:var(--gold)]">Book a session</p>
      <h1 className="mt-2 text-3xl font-semibold">{serviceDef?.title ?? String(service).replaceAll("-", " ")}</h1>
      <p className="mt-3 text-sm text-[color:var(--text-muted)]">
        {isPaidService
          ? "Pick a time, then continue to secure checkout to confirm your engagement."
          : "Pick a time in the next 90 days. Marie reviews each request and confirms by email."}
      </p>
      <p className="mt-2 text-xs text-[color:var(--text-muted)]">
        Times shown in {timeZone || "your local timezone"}.
      </p>

      {state === "loading" && (
        <p className="mt-10 text-[color:var(--text-muted)]" aria-live="polite">
          {loadingLabel}
        </p>
      )}
      {state === "error" && err && <p className="mt-10 text-red-400">{err}</p>}

      {state === "ready" && (
        <div className="mt-10 grid gap-10 rounded-2xl border border-[color:var(--chrome-border-1)] bg-[color:var(--chrome-bg-2)] p-6 backdrop-blur-md md:grid-cols-[1fr_280px] md:p-8">
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">
                {viewMonth.toLocaleString(undefined, { month: "long", year: "numeric" })}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => canPrev && setViewMonth(prevMonth(viewMonth))}
                  disabled={!canPrev}
                  className="rounded border border-[color:var(--chrome-border-1)] px-3 py-1 text-sm hover:border-[color:var(--chrome-border-3)] disabled:opacity-30"
                >‹</button>
                <button
                  onClick={() => canNext && setViewMonth(nextMonth(viewMonth))}
                  disabled={!canNext}
                  className="rounded border border-[color:var(--chrome-border-1)] px-3 py-1 text-sm hover:border-[color:var(--chrome-border-3)] disabled:opacity-30"
                >›</button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-widest text-[color:var(--text-muted)]">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d}>{d}</div>)}
            </div>

            <div className="mt-1 grid grid-cols-7 gap-1">
              {monthCells.map((cell, i) => {
                if (!cell) return <div key={i} />;
                const key = dayKey(cell);
                const inWindow = cell >= today && cell <= windowEnd;
                const hasSlots = inWindow && (slotsByDay.get(key)?.length ?? 0) > 0;
                const isSelected = selectedDay === key;
                return (
                  <button
                    key={i}
                    disabled={!hasSlots}
                    onClick={() => { setSelectedDay(key); setSelectedSlot(null); }}
                    className={
                      "aspect-square rounded text-sm transition duration-200 " +
                      (isSelected
                        ? "border border-[color:var(--gold)] bg-[color:var(--gold)] text-black shadow-[0_0_0_1px_rgba(212,176,106,0.45),0_0_24px_rgba(212,176,106,0.45)]"
                        : hasSlots
                          ? "border border-[color:var(--chrome-border-1)] hover:border-[color:var(--chrome-border-3)] hover:bg-[color:var(--chrome-bg-1)] text-[color:var(--text-strong)]"
                          : "text-[color:var(--text-faint)] opacity-60 cursor-not-allowed")
                    }
                  >
                    {cell.getDate()}
                  </button>
                );
              })}
            </div>
          </section>

          <aside>
            <h3 className="text-sm uppercase tracking-widest text-[color:var(--text-muted)] mono">
              {selectedDay
                ? new Date(selectedDay).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })
                : "Pick a date"}
            </h3>
            {selectedDay && (
              <ul className="mt-3 grid grid-cols-2 gap-2">
                {(slotsByDay.get(selectedDay) ?? []).map(iso => (
                  <li key={iso}>
                    <button
                      onClick={() => setSelectedSlot(iso)}
                      className={
                        "w-full rounded border px-2 py-2 text-sm transition duration-200 " +
                        (selectedSlot === iso
                          ? "border-[color:var(--gold)] bg-[color:var(--gold)]/18 text-[color:var(--gold)] shadow-[0_0_0_1px_rgba(212,176,106,0.35),0_0_26px_rgba(212,176,106,0.32)]"
                          : "border-[color:var(--chrome-border-1)] text-[color:var(--text-strong)] hover:border-[color:var(--chrome-border-3)] hover:bg-[color:var(--chrome-bg-1)]")
                      }
                    >
                      {new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {selectedDay && (slotsByDay.get(selectedDay)?.length ?? 0) === 0 && (
              <p className="mt-3 text-sm text-[color:var(--text-muted)]">No times left on this day.</p>
            )}
          </aside>
        </div>
      )}

      {state === "ready" && selectedSlot && (
        <section className="mt-12 max-w-xl rounded-xl border border-[color:var(--chrome-border-1)] bg-[color:var(--chrome-bg-2)] p-6 backdrop-blur-md">
          <h2 className="text-lg font-medium">{isPaidService ? "Continue to checkout" : "Request this time"}</h2>
          <p className="mt-1 text-sm text-[color:var(--text-muted)]">
            {new Date(selectedSlot).toLocaleString(undefined, {
              weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit",
            })}
          </p>
          <div className="mt-5 space-y-3">
            <label className="block text-sm">
              <span className="mono text-xs uppercase tracking-widest text-[color:var(--text-muted)]">Name</span>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="mt-1 w-full rounded border border-[color:var(--chrome-border-1)] bg-[color:var(--chrome-bg-1)] px-3 py-2 outline-none focus:border-[color:var(--gold)]"
              />
            </label>
            <label className="block text-sm">
              <span className="mono text-xs uppercase tracking-widest text-[color:var(--text-muted)]">Email</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 w-full rounded border border-[color:var(--chrome-border-1)] bg-[color:var(--chrome-bg-1)] px-3 py-2 outline-none focus:border-[color:var(--gold)]"
              />
            </label>
            <label className="block text-sm">
              <span className="mono text-xs uppercase tracking-widest text-[color:var(--text-muted)]">Notes (optional)</span>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded border border-[color:var(--chrome-border-1)] bg-[color:var(--chrome-bg-1)] px-3 py-2 outline-none focus:border-[color:var(--gold)]"
              />
            </label>
          </div>
          {submitErr && <p className="mt-3 text-sm text-red-400">{submitErr}</p>}
          <button
            onClick={submit}
            disabled={submitting || !name.trim() || !email.trim()}
            className="btn btn-primary mt-5 disabled:opacity-50"
          >
            {submitting
              ? (isPaidService ? "Starting checkout…" : "Submitting…")
              : (isPaidService ? "Continue to secure checkout" : "Submit request")}
            <span className="arr">→</span>
          </button>
        </section>
      )}
    </main>
  );
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function dayKey(d: Date) {
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return day.toISOString().slice(0, 10);
}

function prevMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() - 1, 1);
}

function nextMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 1);
}

function buildMonthCells(monthStart: Date): (Date | null)[] {
  const firstWeekday = monthStart.getDay();
  const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(monthStart.getFullYear(), monthStart.getMonth(), d));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
