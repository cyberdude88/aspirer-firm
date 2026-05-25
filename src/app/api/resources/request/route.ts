import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const { slug, email } = await req.json();
  if (!slug || !email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "missing or invalid email" }, { status: 400 });
  }

  try {
    await supabaseAdmin().from("resource_requests").insert({
      resource_slug: slug,
      email,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }

  // TODO: trigger email send (Resend / Postmark / SendGrid) with download link.
  return NextResponse.json({ ok: true });
}
