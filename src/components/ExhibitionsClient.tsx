"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";

export default function ExhibitionsClient() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get("/customer/exhibitions");
        if (mounted) setData(res.data || []);
      } catch (e: any) {
        if (mounted) setError(e?.response?.data?.message || e?.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((ex: any) => (
        <a key={ex.exhibitionID} href={`/dashboard/exhibitions/${ex.exhibitionID}`} className="rounded-lg border p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow">
          <div className="font-medium">{ex.title}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{ex.description}</div>
        </a>
      ))}
    </div>
  );
}

