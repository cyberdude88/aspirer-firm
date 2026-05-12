import Link from "next/link";
import { getService } from "@/lib/services";

export default function BookingRequested({
  searchParams,
}: {
  searchParams: { slug?: string };
}) {
  const service = getService(searchParams.slug ?? "");
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-44 text-white md:pt-56">
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.34)] md:p-10">
        <p className="mono text-xs uppercase tracking-[0.24em] text-[color:var(--gold)]">Request received</p>
        <h1 className="mt-3 text-3xl font-semibold md:text-4xl">Thanks — we&apos;ve got it.</h1>
        <p className="mt-5 max-w-[58ch] text-base leading-7 text-white/72">
          Your request{service ? ` for the ${service.title.toLowerCase()}` : ""} is in the queue.
          Marie reviews each one personally and will email you to confirm, usually within one business day.
        </p>
        <p className="mt-4 max-w-[58ch] text-sm leading-7 text-white/55">
          If the time you picked is no longer workable when Marie reviews, she&apos;ll send a few alternatives.
          Paid engagements receive an invoice link after confirmation.
        </p>
        {service ? (
          <div className="mt-8 inline-flex rounded-full border border-[color:var(--gold)]/25 bg-[color:var(--gold)]/10 px-4 py-2">
            <span className="mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--gold)]">
              {service.title}
            </span>
          </div>
        ) : null}
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/booking" className="btn btn-ghost">Book another</Link>
          <Link href="/" className="btn btn-primary">Back to home <span className="arr">→</span></Link>
        </div>
      </div>
    </main>
  );
}
