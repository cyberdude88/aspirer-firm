import { NextRequest, NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const { data, error: authError } = await supabaseServer().auth.getUser();
  const adminEmail = data.user?.email ?? null;
  if (authError || !isAdminEmail(adminEmail)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { id?: number; decision?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const id = Number(body.id);
  const decision = body.decision === "approve" || body.decision === "deny" ? body.decision : null;
  if (!Number.isInteger(id) || id <= 0 || !decision) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const status = decision === "approve" ? "approved" : "denied";
  const db = supabaseAdmin();
  const { error } = await db
    .from("booking_requests")
    .update({
      status,
      decided_at: new Date().toISOString(),
      decided_by: adminEmail,
    })
    .eq("id", id)
    .eq("status", "pending");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
