import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { isAdminEmail } from "@/lib/admin-auth";
import { ADMIN_BROWSER_SESSION_COOKIE } from "@/lib/admin-session";
import { getAuthSecret } from "@/lib/auth-secret";

export const config = {
  matcher: ["/admin/:path*"],
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: getAuthSecret() });
  const hasBrowserSession = req.cookies.get(ADMIN_BROWSER_SESSION_COOKIE)?.value === "1";
  if (isAdminEmail(token?.email) && hasBrowserSession) return NextResponse.next();

  const signInUrl = new URL("/signin", req.url);
  signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
  return NextResponse.redirect(signInUrl);
}
