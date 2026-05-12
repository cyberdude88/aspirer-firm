"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FIRM } from "@/lib/firm";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/bookings";

  return (
    <main style={{ padding: "190px 0 120px" }}>
      <div className="wrap" style={{ maxWidth: 1120 }}>
        <div className="cta-card reveal in" style={{ textAlign: "left" }}>
          <div className="inside" style={{ maxWidth: 720 }}>
            <span className="sec-tag mono" style={{ display: "inline-flex" }}>— ADMIN ACCESS</span>
            <h1 style={{ marginTop: 18, fontSize: "clamp(36px,5vw,64px)", lineHeight: 1.04, letterSpacing: "-.02em" }}>
              Sign in to manage booking requests.
            </h1>
            <p style={{ marginTop: 22, maxWidth: "54ch", color: "var(--mute)", fontSize: 17, lineHeight: 1.7 }}>
              Use the Google account authorized for {FIRM.name} administration. If your email does not match the configured admin account, the portal will deny access.
            </p>
            <div style={{ marginTop: 32, display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button
                className="btn btn-primary"
                onClick={() => signIn("google", { callbackUrl })}
              >
                Continue with Google <span className="arr">→</span>
              </button>
              <a href="/" className="btn btn-ghost">Back to site</a>
            </div>
            <p className="mono" style={{ marginTop: 22, fontSize: 11, letterSpacing: ".18em", color: "var(--mute)" }}>
              Destination: {callbackUrl}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
