"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "@/src/components/Sidebar";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (open && e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && active === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="sm:hidden">
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
        <button
          ref={btnRef}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
          onClick={() => setOpen(true)}
        >
          <span className={`block w-6 h-0.5 bg-current transition-transform ${open ? "translate-y-1.5 rotate-45" : ""}`}></span>
          <span className={`block w-6 h-0.5 bg-current my-1 transition-opacity ${open ? "opacity-0" : "opacity-100"}`}></span>
          <span className={`block w-6 h-0.5 bg-current transition-transform ${open ? "-translate-y-1.5 -rotate-45" : ""}`}></span>
        </button>
        <div className="font-semibold">Dashboard</div>
        <div className="w-9" />
      </div>

      {open && (
        <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div ref={panelRef} className="absolute inset-y-0 left-0 w-64 max-w-[80%] bg-white dark:bg-slate-900 shadow-xl border-r border-slate-200 dark:border-slate-800 animate-[slideIn_.25s_ease-out]">
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800">
              <div className="font-semibold">Menu</div>
              <button aria-label="Close menu" className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-2" onClick={() => setOpen(false)}>
              <Sidebar />
            </div>
          </div>
          <style jsx>{`
            @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
          `}</style>
        </div>
      )}
    </div>
  );
}


