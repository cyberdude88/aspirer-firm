import Link from "next/link";
import { getService } from "@/lib/services";

export default function BookingConfirmed({
  searchParams,
}: {
  searchParams: { slug?: string; session_id?: string };
}) {
  const service = getService(searchParams.slug ?? "");

  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-44 text-white md:pt-56">
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.34)] md:p-10">
        <p className="mono text-xs uppercase tracking-[0.24em] text-[color:var(--gold)]">Payment received</p>
        <h1 className="mt-3 text-3xl font-semibold md:text-4xl">Your booking is confirmed.</h1>
        <p className="mt-5 max-w-[58ch] text-base leading-7 text-white/72">
          Thanks{service ? ` for booking the ${service.title.toLowerCase()}` : ""}. Your payment went through and
          the session is being finalized on Marie&apos;s calendar.
        </p>
        <p className="mt-4 max-w-[58ch] text-sm leading-7 text-white/55">
          You&apos;ll receive a confirmation email from Stripe, followed by a calendar invite once the booking sync completes.
        </p>
        {searchParams.session_id ? (
          <div className="mt-8 inline-flex rounded-full border border-[color:var(--gold)]/25 bg-[color:var(--gold)]/10 px-4 py-2">
            <span className="mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--gold)]">
              Session {searchParams.session_id}
            </span>
          </div>
        ) : null}
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/booking" className="btn btn-ghost">Back to booking</Link>
          <Link href="/" className="btn btn-primary">Back to home <span className="arr">→</span></Link>
        </div>
      </div>
    </main>
  );
}
