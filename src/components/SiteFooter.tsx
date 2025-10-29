"use client";

import { useEffect, useState } from "react";

export default function SiteFooter() {
  const [year, setYear] = useState<string>(""
  );
  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-6 mt-10">
      <div className="text-center">
        © <span suppressHydrationWarning>{year || new Date().getFullYear()}</span> ExhibitPro. All rights reserved.
      </div>
    </footer >
  );
}

