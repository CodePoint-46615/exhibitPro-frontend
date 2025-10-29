import { API_BASE_URL } from "@/src/lib/api";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function fetchExhibition(id: string, token: string | null) {
  const res = await fetch(`${API_BASE_URL}/customer/exhibitions/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function ExhibitionPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? null;
  const ex = await fetchExhibition(id, token);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{ex.title}</h1>
        <a href={`/dashboard/bookings/new?exhibitionID=${ex.exhibitionID}`} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
          <i className="fa-solid fa-ticket"></i>
          <span>Book Tickets</span>
        </a>
      </div>
      {!ex ? (
        <div className="text-sm text-red-600">Failed to load exhibition.</div>
      ) : (
        <>
          <p className="text-slate-700 dark:text-slate-200">{ex.description}</p>
          <div className="text-sm"><i className="fa-solid fa-tag"></i> Ticket price: {ex.ticketPrice}</div>
        </>
      )}
    </div>
  );
}

