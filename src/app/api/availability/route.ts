import { NextRequest, NextResponse } from "next/server";
import { getService } from "@/lib/services";
import { bookingWindow, generateSlots, listActiveBookings } from "@/lib/booking";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  const service = getService(slug);
  if (!service) return NextResponse.json({ error: "unknown service" }, { status: 400 });

  try {
    const { start, end } = bookingWindow();
    const booked = await listActiveBookings(start.toISOString(), end.toISOString());
    const slots = generateSlots({ start, end, durationMin: service.durationMin, booked });
    return NextResponse.json({ slug, slots });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
