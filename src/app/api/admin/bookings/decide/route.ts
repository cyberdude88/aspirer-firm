import { NextRequest } from "next/server";
import { isAdminUser } from "@/lib/admin";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase-server";
import { assertSameOrigin, jsonNoStore } from "@/lib/security";

export async function POST(req: NextRequest) {
  const blocked = assertSameOrigin(req);
  if (blocked) return blocked;

  const { data, error: authError } = await supabaseServer().auth.getUser();
  const adminUser = data.user ?? null;
  const adminEmail = adminUser?.email ?? null;
  if (authError || !isAdminUser(adminUser)) {
    return jsonNoStore({ error: "unauthorized" }, { status: 401 });
  }

  let body: { id?: number; decision?: string };
  try {
    body = await req.json();
  } catch {
    return jsonNoStore({ error: "invalid json" }, { status: 400 });
  }

  const id = Number(body.id);
  const decision = body.decision === "approve" || body.decision === "deny" ? body.decision : null;
  if (!Number.isInteger(id) || id <= 0 || !decision) {
    return jsonNoStore({ error: "invalid payload" }, { status: 400 });
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
    return jsonNoStore({ error: error.message }, { status: 500 });
  }

  return jsonNoStore({ ok: true });
}
