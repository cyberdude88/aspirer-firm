import { NextRequest, NextResponse } from "next/server";

function parseOrigin(value: string | null) {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function assertSameOrigin(req: NextRequest) {
  const origin = parseOrigin(req.headers.get("origin"));
  const expected = req.nextUrl.origin;
  if (origin && origin !== expected) {
    return NextResponse.json({ error: "cross-origin request blocked" }, { status: 403 });
  }

  const referer = parseOrigin(req.headers.get("referer"));
  if (!origin && referer && referer !== expected) {
    return NextResponse.json({ error: "cross-origin request blocked" }, { status: 403 });
  }

  return null;
}

export function jsonNoStore(body: unknown, init?: ResponseInit) {
  const res = NextResponse.json(body, init);
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("X-Content-Type-Options", "nosniff");
  return res;
}

export function getSiteOrigin(req: NextRequest) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      return new URL(configured).origin;
    } catch {
      // Fall back to the current request origin if the env var is malformed.
    }
  }
  return req.nextUrl.origin;
}
