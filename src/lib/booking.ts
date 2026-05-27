import { supabaseAdmin } from "./supabase-server";

export const BUSINESS_TZ = process.env.BUSINESS_TZ || "Europe/Berlin";
export const BOOKING_WINDOW_DAYS = 90;
const DAY_START_HOUR = 9;
const DAY_END_HOUR = 17;

function partsInTz(date: Date, tz: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
  }).formatToParts(date);
  const get = (t: string) => parts.find(p => p.type === t)!.value;
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
    weekday: get("weekday") as "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat",
  };
}

function fromZonedTime(y: number, m: number, d: number, h: number, mn: number, tz: string) {
  const desired = Date.UTC(y, m - 1, d, h, mn);
  const guess = new Date(desired);
  const p = partsInTz(guess, tz);
  const actual = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
  return new Date(desired + (desired - actual));
}

export type Booked = { start: number; end: number };

export async function listActiveBookings(windowStartIso: string, windowEndIso: string): Promise<Booked[]> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("booking_requests")
    .select("slot, duration_min")
    .in("status", ["pending", "approved"])
    .gte("slot", windowStartIso)
    .lt("slot", windowEndIso);
  if (error) throw new Error(error.message);
  return (data ?? []).map(r => {
    const start = new Date(r.slot as string).getTime();
    return { start, end: start + (r.duration_min as number) * 60_000 };
  });
}

export function bookingWindow(now = new Date()) {
  const start = new Date(now.getTime() + 24 * 60 * 60_000);
  const end = new Date(now.getTime() + BOOKING_WINDOW_DAYS * 24 * 60 * 60_000);
  return { start, end };
}

export function generateSlots(opts: {
  start: Date;
  end: Date;
  durationMin: number;
  booked: Booked[];
  tz?: string;
}): string[] {
  const tz = opts.tz ?? BUSINESS_TZ;
  const out: string[] = [];
  const cursor = new Date(opts.start);
  const seenDays = new Set<string>();
  while (cursor.getTime() < opts.end.getTime() + 24 * 60 * 60_000) {
    const p = partsInTz(cursor, tz);
    const key = `${p.year}-${p.month}-${p.day}`;
    if (!seenDays.has(key)) {
      seenDays.add(key);
      if (p.weekday !== "Sat" && p.weekday !== "Sun") {
        const lastStartMinute = (DAY_END_HOUR - DAY_START_HOUR) * 60 - opts.durationMin;
        for (let mins = 0; mins <= lastStartMinute; mins += opts.durationMin) {
          const h = DAY_START_HOUR + Math.floor(mins / 60);
          const m = mins % 60;
          const slotStart = fromZonedTime(p.year, p.month, p.day, h, m, tz);
          const slotEnd = slotStart.getTime() + opts.durationMin * 60_000;
          if (slotStart.getTime() < opts.start.getTime()) continue;
          if (slotEnd > opts.end.getTime()) continue;
          const overlap = opts.booked.some(b => b.start < slotEnd && b.end > slotStart.getTime());
          if (!overlap) out.push(slotStart.toISOString());
        }
      }
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return out;
}
