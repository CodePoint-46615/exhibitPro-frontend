"use client";

import Link from "next/link";
import { useState } from "react";

export default function LandingMobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="sm:hidden absolute top-3 right-3 z-20">
      <button
        aria-label="Open menu"
        className="p-2 rounded-md bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
        onClick={() => setOpen((v) => !v)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      {open && (
        <div className="mt-2 w-44 rounded-md border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 shadow-lg p-2 space-y-1">
          <Link href="/about" className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setOpen(false)}>About Us</Link>
          <Link href="/contact" className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setOpen(false)}>Contact Us</Link>
          <Link href="/login" className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setOpen(false)}>Login</Link>
          <Link href="/register" className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setOpen(false)}>Register</Link>
        </div>
      )}
    </div>
  );
}


