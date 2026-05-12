"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function DecisionButtons({ id }: { id: number }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(decision: "approve" | "deny") {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/admin/bookings/decide", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, decision }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Update failed");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => submit("approve")}
          disabled={pending}
          className="btn btn-primary disabled:opacity-50"
        >
          Approve <span className="arr">→</span>
        </button>
        <button
          type="button"
          onClick={() => submit("deny")}
          disabled={pending}
          className="btn btn-ghost disabled:opacity-50"
        >
          Deny
        </button>
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
