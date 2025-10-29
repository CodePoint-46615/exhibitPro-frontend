"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/src/lib/api";
import { createBookingSchema } from "@/src/lib/validation";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function NewBookingPage() {
  const params = useSearchParams();
  const router = useRouter();

  const [tickets, setTickets] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exhibitionID = params.get("exhibitionID") || "";

  const customerID = useMemo(() => {
    try {
      const token = document.cookie.match(/(?:^|; )token=([^;]+)/)?.[1];
      if (!token) return null;
      const decoded = jwtDecode<{ sub: string }>(decodeURIComponent(token));
      return decoded.sub;
    } catch {
      return null;
    }
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const body = { exhibitionID, customerID: customerID || "", ticketsBooked: tickets };
    const parsed = createBookingSchema.safeParse(body);
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message || "Invalid input");
      return;
    }

    setLoading(true);
    try {
      await api.post("/customer/bookings", body);
      router.replace("/dashboard/bookings");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold mb-4">New Booking</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Exhibition ID</label>
          <input value={exhibitionID} readOnly className="w-full rounded-lg border px-3 py-2 bg-slate-100 dark:bg-slate-800" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tickets</label>
          <input type="number" min={1} value={tickets} onChange={(e)=>setTickets(parseInt(e.target.value || "1"))} className="w-full rounded-lg border px-3 py-2" />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"><i className="fa-solid fa-ticket"></i>{loading?"Booking...":"Create Booking"}</button>
      </form>
    </div>
  );
}

