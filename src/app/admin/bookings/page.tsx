import { requireAdminSession } from "@/lib/admin";
import { getService } from "@/lib/services";
import { supabaseAdmin } from "@/lib/supabase-server";
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

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams?: { view?: string };
}) {
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
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const toTime = (slot: string) => new Date(slot).getTime();
  const isTodayOrFuture = (slot: string) => toTime(slot) >= today.getTime();
  const sortUpcomingFirst = (a: BookingRow, b: BookingRow) => {
    const aTime = toTime(a.slot);
    const bTime = toTime(b.slot);
    const aUpcoming = aTime >= now.getTime();
    const bUpcoming = bTime >= now.getTime();

    if (aUpcoming && bUpcoming) return aTime - bTime;
    if (aUpcoming) return -1;
    if (bUpcoming) return 1;
    return bTime - aTime;
  };

  const pending = rows
    .filter(row => row.status === "pending" && isTodayOrFuture(row.slot))
    .sort(sortUpcomingFirst);
  const approved = rows
    .filter(row => row.status === "approved")
    .sort(sortUpcomingFirst);
  const denied = rows
    .filter(row => row.status === "denied" && isTodayOrFuture(row.slot))
    .sort(sortUpcomingFirst);

  const activeView = searchParams?.view === "approved" || searchParams?.view === "denied"
    ? searchParams.view
    : "pending";
  const activeSection = activeView === "approved"
    ? { id: "approved", title: "Approved", count: approved.length, emptyLabel: "No approved appointments yet.", rows: approved.slice(0, 20) }
    : activeView === "denied"
      ? { id: "denied", title: "Denied", count: denied.length, emptyLabel: "No denied appointments.", rows: denied.slice(0, 20) }
      : { id: "pending", title: "Pending", count: pending.length, emptyLabel: "No pending requests.", rows: pending, actionable: true };

  return (
    <main style={{ padding: "180px 0 120px" }}>
      <div className="wrap" style={{ maxWidth: 1120 }}>
        <span className="sec-tag mono">— ADMIN</span>
        <h1 className="sec-title" style={{ marginTop: 18 }}>Booking requests</h1>
        <p style={{ marginTop: 24, color: "var(--mute)", fontSize: 17, lineHeight: 1.65, maxWidth: "60ch" }}>
          Signed in as {session.email}. Pending requests hold their selected slot until you approve or deny them.
        </p>

        <nav
          aria-label="Booking sections"
          style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}
        >
          <SectionTab href="/admin/bookings?view=pending" label="Pending" active={activeView === "pending"} />
          <SectionTab href="/admin/bookings?view=approved" label="Approved" active={activeView === "approved"} />
          <SectionTab href="/admin/bookings?view=denied" label="Denied" active={activeView === "denied"} />
        </nav>

        <div style={{ marginTop: 36 }}>
          <StatusSection
            id={activeSection.id}
            title={activeSection.title}
            count={activeSection.count}
            emptyLabel={activeSection.emptyLabel}
            rows={activeSection.rows}
            actionable={activeSection.actionable}
          />
        </div>
      </div>
    </main>
  );
}

function SectionTab({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <a
      href={href}
      className={active ? "btn btn-primary" : "btn btn-ghost"}
      aria-current={active ? "page" : undefined}
      style={active ? { boxShadow: "0 0 0 1px var(--gold) inset" } : undefined}
    >
      {label}
    </a>
  );
}

function StatusSection({
  id,
  title,
  count,
  emptyLabel,
  rows,
  actionable = false,
}: {
  id: string;
  title: string;
  count: number;
  emptyLabel: string;
  rows: BookingRow[];
  actionable?: boolean;
}) {
  return (
    <section
      id={id}
      style={{
        scrollMarginTop: 160,
        border: "1px solid var(--line)",
        borderRadius: 24,
        padding: 24,
        background: "rgba(255,255,255,.025)",
      }}
    >
      <div className="sec-head">
        <h2>{title}</h2>
        <span className="mono">{count}</span>
      </div>
      {rows.length ? (
        <div style={{ marginTop: 20, display: "grid", gap: 18 }}>
          {rows.map(row => <BookingCard key={row.id} row={row} actionable={actionable} />)}
        </div>
      ) : (
        <p style={{ marginTop: 20, color: "var(--mute)" }}>{emptyLabel}</p>
      )}
    </section>
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
          <p style={{ marginTop: 10, color: "var(--text-strong)", lineHeight: 1.65 }}>
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
          <p className="mono" style={{ marginTop: 18, fontSize: 12, letterSpacing: ".18em", color: "var(--mute)" }}>
            Requested {created.toLocaleString()}
            {decidedAt ? ` · Decided ${decidedAt.toLocaleString()}${row.decided_by ? ` by ${row.decided_by}` : ""}` : ""}
          </p>
        </div>

        {actionable ? <DecisionButtons id={row.id} /> : null}
      </div>
    </article>
  );
}
