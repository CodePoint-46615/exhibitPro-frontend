import { API_BASE_URL } from "@/src/lib/api";
import { cookies } from "next/headers";
import NotificationsClient from "@/src/components/NotificationsClient";

export const dynamic = "force-dynamic"; // ensure fresh per-request

async function fetchExhibitions(token: string | null) {
  const res = await fetch(`${API_BASE_URL}/customer/exhibitions`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

function getUserIdFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const base64 = token.split(".")[1]?.replace(/-/g, "+").replace(/_/g, "/");
    if (!base64) return null;
    const json = Buffer.from(base64, "base64").toString("utf8");
    const payload = JSON.parse(json);
    return payload?.sub ?? null;
  } catch {
    return null;
  }
}

async function fetchUserName(userId: string | null, token: string | null): Promise<string | null> {
  if (!userId) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.fullName || data?.name || data?.email || null;
  } catch {
    return null;
  }
}

export default async function DashboardHome({ }: {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? null;
  const exhibitions = await fetchExhibitions(token);
  const userId = getUserIdFromToken(token);
  const fullName = await fetchUserName(userId, token);
  return (

    // dashboard
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">Dashboard</div>
        <form action="/logout" method="POST">
          <button type="submit" className="rounded-lg bg-red-600 hover:bg-red-700 text-white px-4 py-2">
            Logout
          </button>
        </form>
      </div>

      {/* welcome */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900">
          <div className="text-xl font-semibold text-slate-500">Hello, <span className="font-semibold text-slate-950 dark:text-slate-50">{fullName ?? "there"}!!🎉</span></div>
          <div className="text-[12px] font-normal text-justify text-slate-500">Welcome to ExhibitPro.🙌 Enrich your choice, Enrich your life with our exhibitions. Explore the world of exhibitions. Have a great day!🔥</div>
        </div>

        {/* exhibitions */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="text-sm text-slate-500">Total Exhibitions Available</div>
          <div className="text-xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            {exhibitions?.length ?? 0}
          </div>

        </div>
      </div>

      <NotificationsClient />


    </div>
  );
}

