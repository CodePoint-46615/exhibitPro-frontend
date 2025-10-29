import Sidebar from "@/src/components/Sidebar";
import SiteFooter from "@/src/components/SiteFooter";
import MobileSidebar from "@/src/components/MobileSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <MobileSidebar />
      <div className="flex flex-1">
        <div className="hidden sm:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <main className="p-4 flex-1">
            {children}
          </main>
        </div>
      </div>
      <div className="relative z-10">
        <SiteFooter />
      </div>
    </div>
  );
}

