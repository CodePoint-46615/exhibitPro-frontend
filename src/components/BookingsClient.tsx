"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { formatMoney } from "@/src/lib/format";

function StatusBadge({ status }: { status: string }) {
  const color = status === "paid" ? "bg-green-100 text-green-700" : status === "cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700";
  return <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>{status}</span>;
}

export default function BookingsClient() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/customer/bookings");
      setData(res.data || []);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function markPaid(id: string) {
    await api.patch(`/customer/bookings/${id}/pay`);
    await load();
  }
  async function cancel(id: string) {
    await api.patch(`/customer/bookings/${id}/cancel`);
    await load();
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="grid gap-3">
      {data?.map((b: any) => (
        <div key={b.bookingID} className="rounded-lg border p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="font-medium">{b.exhibition?.title}</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">Tickets: {b.ticketsBooked} • Total: {formatMoney(b.totalPrice)}</div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={b.paymentStatus} />
            {b.paymentStatus === "unpaid" && (
              <>
                <button onClick={() => markPaid(b.bookingID)} className="rounded bg-green-600 text-white px-3 py-1 text-sm">Mark Paid</button>
                <button onClick={() => cancel(b.bookingID)} className="rounded bg-red-600 text-white px-3 py-1 text-sm">Cancel</button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

