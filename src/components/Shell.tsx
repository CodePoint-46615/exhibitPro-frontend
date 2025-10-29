"use client";

import { useState } from "react";
import Sidebar from "@/src/components/Sidebar";

export default function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex">
      {/* Off-canvas sidebar only for small/medium */}
      <div className={`fixed inset-0 z-30 ${open ? 'block' : 'hidden'} sm:hidden`} onClick={()=>setOpen(false)} />
      <div className={`fixed z-40 top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 shadow-lg transform ${open ? 'translate-x-0' : '-translate-x-full'} transition-transform sm:hidden`}>
        <Sidebar />
      </div>
      <div className="flex-1">
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button aria-label="Menu" className="sm:hidden" onClick={()=>setOpen(v=>!v)}>
              <i className="fa-solid fa-bars"></i>
            </button>
            <span className="font-semibold">Dashboard</span>
          </div>
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
            <a href="/dashboard/profile" className="hover:text-blue-600"><i className="fa-solid fa-user"></i></a>
            <form action="/logout" method="post">
              <button className="hover:text-red-600" title="Logout" type="submit"><i className="fa-solid fa-right-from-bracket"></i> <span className="hidden md:inline">Logout</span></button>
            </form>
          </div>
        </header>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}

