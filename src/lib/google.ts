import { google } from "googleapis";

// OAuth2 client wired with the owner refresh token — used server-side to
// read availability and create events on the business Gmail account.
export function calendarClient() {
  const missing = [
    ["GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID],
    ["GOOGLE_CLIENT_SECRET", process.env.GOOGLE_CLIENT_SECRET],
    ["GOOGLE_OWNER_REFRESH_TOKEN", process.env.GOOGLE_OWNER_REFRESH_TOKEN],
  ].filter(([, value]) => !value).map(([key]) => key);

  if (missing.length) {
    throw new Error(`Google Calendar is not configured. Missing: ${missing.join(", ")}`);
  }

  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );
  oauth2.setCredentials({ refresh_token: process.env.GOOGLE_OWNER_REFRESH_TOKEN });
  return google.calendar({ version: "v3", auth: oauth2 });
}

export const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary";

export type FreeSlot = { start: string; end: string };

export async function listFreeSlots(opts: {
  timeMin: string;
  timeMax: string;
  slotMinutes?: number;
}): Promise<FreeSlot[]> {
  const cal = calendarClient();
  const fb = await cal.freebusy.query({
    requestBody: {
      timeMin: opts.timeMin,
      timeMax: opts.timeMax,
      items: [{ id: CALENDAR_ID }],
    },
  });
  const busy = fb.data.calendars?.[CALENDAR_ID]?.busy ?? [];
  const slot = (opts.slotMinutes ?? 60) * 60_000;
  const out: FreeSlot[] = [];
  let cursor = new Date(opts.timeMin).getTime();
  const end = new Date(opts.timeMax).getTime();
  const busyRanges = busy.map(b => [new Date(b.start!).getTime(), new Date(b.end!).getTime()] as const);
  while (cursor + slot <= end) {
    const slotEnd = cursor + slot;
    const overlaps = busyRanges.some(([bs, be]) => bs < slotEnd && be > cursor);
    if (!overlaps) out.push({ start: new Date(cursor).toISOString(), end: new Date(slotEnd).toISOString() });
    cursor += slot;
  }
  return out;
}

export async function createBooking(opts: {
  summary: string;
  description: string;
  start: string;
  end: string;
  attendeeEmail: string;
}) {
  const cal = calendarClient();
  const res = await cal.events.insert({
    calendarId: CALENDAR_ID,
    sendUpdates: "all",
    requestBody: {
      summary: opts.summary,
      description: opts.description,
      start: { dateTime: opts.start },
      end: { dateTime: opts.end },
      attendees: [{ email: opts.attendeeEmail }],
    },
  });
  return res.data;
}
