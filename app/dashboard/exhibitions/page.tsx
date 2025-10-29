import { API_BASE_URL } from "@/src/lib/api";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function fetchExhibitions(token: string | null) {
  const res = await fetch(`${API_BASE_URL}/customer/exhibitions`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function ExhibitionsList() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? null;
  const exhibitions = await fetchExhibitions(token);
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 font-semibold">Available Exhibitions</div>
        <div className="p-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {exhibitions?.map((ex: any) => (
            <div key={ex.exhibitionID} className="group overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition">
              <a href={`/dashboard/exhibitions/${ex.exhibitionID}`} className="block">
                <div className="relative h-40 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img src={ex.imageUrl || "/avatar/exhibition.jpg"} alt="Exhibition" className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-4 space-y-1">
                  <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">{ex.title}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{ex.description}</div>
                  <div className="mt-2 text-sm text-slate-800 dark:text-slate-200">Price (per ticket): {ex.ticketPrice} BDT. </div>
                </div>
              </a>

              <div className="px-4 pb-4 flex gap-2">
                {/* <a href={`/dashboard/bookings/new?exhibitionId=${encodeURIComponent(ex.exhibitionID)}`} className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm text-center">Book Now</a> */}
                
                <a href={`/dashboard/exhibitions/${ex.exhibitionID}`} className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm text-center hover:bg-slate-50 dark:hover:bg-blue-600">Book Now</a>
              </div>
            </div>
          ))}
          {(!exhibitions || exhibitions.length === 0) && (
            <div className="col-span-full text-center text-slate-600 dark:text-slate-300">No exhibitions available.</div>
          )}
        </div>
      </div>
    </div>
  );
}

