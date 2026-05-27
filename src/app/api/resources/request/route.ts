import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { assertSameOrigin, jsonNoStore } from "@/lib/security";

export async function POST(req: NextRequest) {
  const blocked = assertSameOrigin(req);
  if (blocked) return blocked;

  const { slug, email } = await req.json();
  if (!slug || !email || typeof email !== "string" || !email.includes("@")) {
    return jsonNoStore({ error: "missing or invalid email" }, { status: 400 });
  }

  try {
    await supabaseAdmin().from("resource_requests").insert({
      resource_slug: slug,
      email,
    });
  } catch (err) {
    return jsonNoStore({ error: (err as Error).message }, { status: 500 });
  }

  return jsonNoStore({ ok: true });
}
