import { NextRequest, NextResponse } from "next/server";
import { listFreeSlots } from "@/lib/google";
import { getService } from "@/lib/services";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  const service = getService(slug);
  if (!service) return NextResponse.json({ error: "unknown service" }, { status: 400 });

  const now = new Date();
  const start = new Date(now.getTime() + 24 * 60 * 60_000);
  const end = new Date(start.getTime() + 14 * 24 * 60 * 60_000);

  try {
    const slots = await listFreeSlots({
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      slotMinutes: service.durationMin,
    });
    return NextResponse.json({ slug, slots });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
