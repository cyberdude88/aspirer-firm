import { NextResponse } from "next/server";
import { ADMIN_BROWSER_SESSION_COOKIE } from "@/lib/admin-session";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // Intentionally omit maxAge/expires so this becomes a browser-session cookie.
  res.cookies.set(ADMIN_BROWSER_SESSION_COOKIE, "1", cookieOptions);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_BROWSER_SESSION_COOKIE, "", {
    ...cookieOptions,
    maxAge: 0,
  });
  return res;
}
