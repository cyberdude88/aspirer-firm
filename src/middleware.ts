import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { isAdminEmail } from "@/lib/admin-auth";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const PUBLIC_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const config = {
  matcher: ["/admin/:path*"],
};

export async function middleware(req: NextRequest) {
  let res = NextResponse.next();

  const supabase = createServerClient(SUPABASE_URL, PUBLIC_KEY, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next();
        cookiesToSet.forEach(({ name, value, options }) => {
          res.cookies.set(name, value, options as CookieOptions);
        });
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  if (isAdminEmail(data.user?.email)) return res;

  const signInUrl = new URL("/signin", req.url);
  signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
  return NextResponse.redirect(signInUrl);
}
