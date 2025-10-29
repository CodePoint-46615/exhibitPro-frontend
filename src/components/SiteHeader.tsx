"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if ((e.key === "Tab") && panelRef.current) {
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
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  
  return (
    <header className="w-full z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-5">

      {/* logo section */}
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex">
          <a href="/" className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <img
              src="/avatar/logo-2.png"
              alt="Logo"
              className="w-[50px] object-contain"
            />
            ExhibitPro
          </a>


        </div>

        {/* nav bar */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700 dark:text-slate-200">
          <Link href="/about" className="hover:text-blue-600">About Us</Link>
          <Link href="/contact" className="hover:text-blue-600">Contact Us</Link>
          <Link href="/login" className="hover:text-blue-600">Login</Link>
          <Link href="/register" className="hover:text-blue-600">Register</Link>
        </nav>

        {/* mobile */}
        <button
          ref={btnRef}
          className="md:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`block w-6 h-0.5 bg-current transition-transform ${open ? "translate-y-1.5 rotate-45" : ""}`}></span>
          <span className={`block w-6 h-0.5 bg-current my-1 transition-opacity ${open ? "opacity-0" : "opacity-100"}`}></span>
          <span className={`block w-6 h-0.5 bg-current transition-transform ${open ? "-translate-y-1.5 -rotate-45" : ""}`}></span>
        </button>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 z-[60]" aria-modal="true" role="dialog">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div ref={panelRef} className="absolute top-0 right-0 w-64 max-w-[80%] h-full bg-white dark:bg-slate-900 shadow-xl border-l border-slate-200 dark:border-slate-800 p-4 animate-[slideIn_.25s_ease-out]">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Menu</div>
              <button className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close menu" onClick={() => setOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <nav className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
              {[
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact Us" },
                { href: "/login", label: "Login" },
                { href: "/register", label: "Register" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <style jsx>{`
            @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
          `}</style>
        </div>
      )}
    </header>
  );
}

