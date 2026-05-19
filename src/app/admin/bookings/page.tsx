import { requireAdminSession } from "@/lib/admin";
import { getService } from "@/lib/services";
import { supabaseAdmin } from "@/lib/supabase";
import { DecisionButtons } from "./DecisionButtons";

type BookingRow = {
  id: number;
  created_at: string;
  slug: string;
  slot: string;
  duration_min: number;
  name: string;
  email: string;
  notes: string | null;
  status: "pending" | "approved" | "denied";
  decided_at: string | null;
  decided_by: string | null;
};

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const session = await requireAdminSession();
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("booking_requests")
    .select("id, created_at, slug, slot, duration_min, name, email, notes, status, decided_at, decided_by")
    .order("slot", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as BookingRow[];
  const pending = rows.filter(row => row.status === "pending");
  const decided = rows.filter(row => row.status !== "pending");

  return (
    <main style={{ padding: "180px 0 120px" }}>
      <div className="wrap" style={{ maxWidth: 1120 }}>
        <span className="sec-tag mono">— ADMIN</span>
        <h1 className="sec-title" style={{ marginTop: 18 }}>Booking requests</h1>
        <p style={{ marginTop: 24, color: "var(--mute)", fontSize: 17, lineHeight: 1.65, maxWidth: "60ch" }}>
          Signed in as {session.user?.email}. Pending requests hold their selected slot until you approve or deny them.
        </p>

        <section style={{ marginTop: 48 }}>
          <div className="sec-head">
            <h2>Pending</h2>
            <span className="mono">{pending.length}</span>
          </div>
          {pending.length ? (
            <div style={{ marginTop: 20, display: "grid", gap: 18 }}>
              {pending.map(row => <BookingCard key={row.id} row={row} actionable />)}
            </div>
          ) : (
            <p style={{ marginTop: 20, color: "var(--mute)" }}>No pending requests.</p>
          )}
        </section>

        <section style={{ marginTop: 56 }}>
          <div className="sec-head">
            <h2>Recently decided</h2>
            <span className="mono">{decided.length}</span>
          </div>
          {decided.length ? (
            <div style={{ marginTop: 20, display: "grid", gap: 18 }}>
              {decided.slice(0, 20).map(row => <BookingCard key={row.id} row={row} />)}
            </div>
          ) : (
            <p style={{ marginTop: 20, color: "var(--mute)" }}>No decisions recorded yet.</p>
          )}
        </section>
      </div>
    </main>
  );
}

function BookingCard({ row, actionable = false }: { row: BookingRow; actionable?: boolean }) {
  const service = getService(row.slug);
  const slot = new Date(row.slot);
  const created = new Date(row.created_at);
  const decidedAt = row.decided_at ? new Date(row.decided_at) : null;

  return (
    <article
      style={{
        border: "1px solid var(--line)",
        borderRadius: 20,
        padding: 24,
        background: "rgba(255,255,255,.03)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 20,
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: "70ch" }}>
          <div
            className="mono"
            style={{ fontSize: 11, letterSpacing: ".22em", color: "var(--gold)", textTransform: "uppercase" }}
          >
            {row.status}
          </div>
          <h3 style={{ marginTop: 12, fontSize: 24 }}>
            {service?.title ?? row.slug} · {row.duration_min} min
          </h3>
          <p style={{ marginTop: 10, color: "var(--mute)", lineHeight: 1.65 }}>
            {row.name} · {row.email}
          </p>
          <p style={{ marginTop: 10, color: "#fff", lineHeight: 1.65 }}>
            {slot.toLocaleString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              timeZoneName: "short",
            })}
          </p>
          {row.notes ? (
            <p style={{ marginTop: 14, color: "var(--mute)", lineHeight: 1.65 }}>{row.notes}</p>
          ) : null}
          <p className="mono" style={{ marginTop: 18, fontSize: 11, letterSpacing: ".18em", color: "var(--mute)" }}>
            Requested {created.toLocaleString()}
            {decidedAt ? ` · Decided ${decidedAt.toLocaleString()}${row.decided_by ? ` by ${row.decided_by}` : ""}` : ""}
          </p>
        </div>

        {actionable ? <DecisionButtons id={row.id} /> : null}
      </div>
    </article>
  );
}
