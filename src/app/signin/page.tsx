"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import { FIRM } from "@/lib/firm";

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/bookings";
  const initialError = searchParams.get("error");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(initialError ? "Username and/or password incorrect." : null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await signIn("admin-password", {
        username,
        password,
        redirect: false,
        callbackUrl,
      });
      if (!res || res.error) {
        setError("Username and/or password incorrect.");
        return;
      }
      router.push(res.url ?? callbackUrl);
      router.refresh();
    });
  }

  return (
    <main style={{ padding: "190px 0 120px" }}>
      <div className="wrap" style={{ maxWidth: 1120 }}>
        <div className="cta-card reveal in" style={{ textAlign: "left" }}>
          <div className="inside" style={{ maxWidth: 560 }}>
            <span className="sec-tag mono" style={{ display: "inline-flex" }}>— ADMIN ACCESS</span>
            <h1 style={{ marginTop: 18, fontSize: "clamp(32px,4.4vw,56px)", lineHeight: 1.04, letterSpacing: "-.02em" }}>
              Sign in to manage booking requests.
            </h1>
            <p style={{ marginTop: 18, maxWidth: "50ch", color: "var(--mute)", fontSize: 15, lineHeight: 1.65 }}>
              Enter the admin password to access the {FIRM.name} booking queue.
            </p>

            <form onSubmit={submit} style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 14, maxWidth: 380 }}>
              <label className="mono" style={{ fontSize: 11, letterSpacing: ".18em", color: "var(--mute)" }}>
                USERNAME
              </label>
              <input
                type="text"
                autoFocus
                required
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={pending}
                placeholder="Username"
                style={{
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,.18)",
                  background: "rgba(255,255,255,.04)",
                  color: "#fff",
                  fontSize: 15,
                  outline: "none",
                }}
              />
              <label className="mono" style={{ fontSize: 11, letterSpacing: ".18em", color: "var(--mute)", marginTop: 4 }}>
                PASSWORD
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={pending}
                placeholder="••••••••"
                style={{
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,.18)",
                  background: "rgba(255,255,255,.04)",
                  color: "#fff",
                  fontSize: 15,
                  outline: "none",
                }}
              />
              {error ? (
                <p className="mono" style={{ color: "#f3b3a3", fontSize: 12, letterSpacing: ".08em" }}>{error}</p>
              ) : null}
              <div style={{ marginTop: 8, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button type="submit" disabled={pending} className="btn btn-primary" style={{ opacity: pending ? 0.6 : 1 }}>
                  {pending ? "Signing in…" : "Sign in"} <span className="arr">→</span>
                </button>
                <a href="/" className="btn btn-ghost">Back to site</a>
              </div>
            </form>

            <p className="mono" style={{ marginTop: 22, fontSize: 11, letterSpacing: ".18em", color: "var(--mute)" }}>
              Destination: {callbackUrl}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
