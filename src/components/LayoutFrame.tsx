"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "@/src/components/SiteHeader";
import SiteFooter from "@/src/components/SiteFooter";

export default function LayoutFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboard = pathname.startsWith("/dashboard");
  return (
    <div className="min-h-screen flex flex-col">
      {!isAuth && !isDashboard && <SiteHeader />}
      <div className="flex-1">{children}</div>
      {!isAuth && !isDashboard && <SiteFooter />}
    </div>
  );
}

