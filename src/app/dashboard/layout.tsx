import { ReactNode } from "react";
import Sidebar from "../../components/dashboard/Sidebar";


export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar />
      <div className="flex flex-col flex-1 transition-all duration-300" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
     
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}