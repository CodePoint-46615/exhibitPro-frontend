"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const item = (href: string, label: string, icon: string) => (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-50 dark:hover:bg-slate-800 ${pathname.startsWith(href) ? "bg-blue-100 text-blue-800 dark:bg-slate-800" : "text-slate-700 dark:text-slate-200"}`}
    >
      <i className={`fa-solid ${icon} w-5 text-center`}></i>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );

  return (
    <aside className="w-full sm:w-56 shrink-0 border-r border-slate-200 dark:border-slate-800 p-3 space-y-2 relative z-0">
      <div className="px-2 py-3 font-semibold text-slate-800 dark:text-white flex items-center gap-2">
        <i className="fa-solid fa-store"></i>
        <span>ExhibitPro</span>
      </div>
      {item("/dashboard", "Overview", "fa-gauge")}
      {item("/dashboard/exhibitions", "Exhibitions", "fa-image")}
      {item("/dashboard/bookings", "Bookings", "fa-ticket")}
      {item("/dashboard/feedbacks", "Feedbacks", "fa-comments")}
      {item("/dashboard/profile", "Profile", "fa-user")}
    </aside>
  );
}

